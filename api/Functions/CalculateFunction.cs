using System.Net;
using System.Text.Json;
using FluentValidation;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services.Interfaces;

namespace pvi_calculator_api.Functions
{
    public class CalculateFunction
    {
        private readonly ILogger<CalculateFunction> _logger;
        private readonly ICalculationService _calculationService;
        private readonly ITableStorageService _tableStorageService;
        private readonly IValidator<CalculationRequest> _validator;

        public CalculateFunction(
            ILogger<CalculateFunction> logger,
            ICalculationService calculationService,
            ITableStorageService tableStorageService,
            IValidator<CalculationRequest> validator
        )
        {
            _logger = logger;
            _calculationService = calculationService;
            _tableStorageService = tableStorageService;
            _validator = validator;
        }

        [Function("Calculate")]
        public async Task<HttpResponseData> CalculatePension(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "calculate")]
                HttpRequestData req
        )
        {
            _logger.LogInformation("Calculate function processing request");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

                if (string.IsNullOrWhiteSpace(requestBody))
                {
                    return await CreateErrorResponse(
                        req,
                        HttpStatusCode.BadRequest,
                        "Request body is required"
                    );
                }

                var calculationRequest = JsonSerializer.Deserialize<CalculationRequest>(
                    requestBody,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (calculationRequest == null)
                {
                    return await CreateErrorResponse(
                        req,
                        HttpStatusCode.BadRequest,
                        "Invalid request format"
                    );
                }

                // Validate the request
                var validationResult = await _validator.ValidateAsync(calculationRequest);
                if (!validationResult.IsValid)
                {
                    var errorDetails = validationResult.Errors.Select(e => e.ErrorMessage).ToList();
                    return await CreateValidationErrorResponse(
                        req,
                        "Validation failed",
                        errorDetails
                    );
                }

                // Generate unique calculation ID
                var calculationId = Guid.NewGuid().ToString();

                _logger.LogInformation("Processing calculation {CalculationId}", calculationId);

                // Get client IP and country (simplified for Azure Functions)
                var clientIP = GetClientIP(req);
                var country = "Unknown"; // Could integrate with a GeoIP service

                // Calculate pension
                var pensionYears =
                    calculationRequest.PensionInputs.EndAge
                    - calculationRequest.PensionInputs.StartAge;
                var pensionResult = _calculationService.CalculateCompoundGrowth(
                    calculationRequest.PensionInputs.StartAmount,
                    calculationRequest.PensionInputs.MonthlyAmount,
                    calculationRequest.PensionInputs.AnnualReturn,
                    pensionYears,
                    calculationRequest.PensionInputs.TaxRelief,
                    0.75m, // charges
                    calculationRequest.PensionInputs.EmployerContrib,
                    calculationRequest.PensionInputs.AnnualIncrease
                );

                // Calculate index fund
                var indexYears =
                    calculationRequest.IndexInputs.EndAge - calculationRequest.IndexInputs.StartAge;
                var indexResult = _calculationService.CalculateIndexGrowthWithTax(
                    calculationRequest.IndexInputs.StartAmount,
                    calculationRequest.IndexInputs.MonthlyAmount,
                    calculationRequest.IndexInputs.AnnualReturn,
                    indexYears,
                    0.2m, // Index fund charges
                    calculationRequest.IndexInputs.WithdrawalRate,
                    calculationRequest.IndexInputs.AnnualIncrease,
                    calculationRequest.IndexInputs.IsISA
                );

                var difference = pensionResult.FinalBalance - indexResult.FinalBalance;

                // Save to table storage (fire and forget for performance)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await _tableStorageService.SaveCalculationAsync(
                            calculationId,
                            calculationRequest.PensionInputs,
                            calculationRequest.IndexInputs,
                            pensionResult,
                            indexResult,
                            difference,
                            clientIP,
                            country
                        );

                        await _tableStorageService.SaveAnalyticsAsync(
                            calculationId,
                            calculationRequest.Analytics,
                            country,
                            clientIP
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(
                            ex,
                            "Error saving calculation data for {CalculationId}",
                            calculationId
                        );
                    }
                });

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(
                    new CalculationResponse
                    {
                        Pension = pensionResult,
                        Index = indexResult,
                        Difference = difference,
                        CalculationId = calculationId,
                    }
                );

                _logger.LogInformation(
                    "Calculation {CalculationId} completed successfully",
                    calculationId
                );
                return response;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Invalid JSON in request");
                return await CreateErrorResponse(
                    req,
                    HttpStatusCode.BadRequest,
                    "Invalid JSON format"
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error processing calculation");
                return await CreateErrorResponse(
                    req,
                    HttpStatusCode.InternalServerError,
                    "An unexpected error occurred"
                );
            }
        }

        private static string GetClientIP(HttpRequestData req)
        {
            // Try different headers that might contain the client IP
            var headers = new[] { "X-Forwarded-For", "X-Real-IP", "CF-Connecting-IP" };

            foreach (var header in headers)
            {
                if (req.Headers.TryGetValues(header, out var values))
                {
                    var ip = values.FirstOrDefault()?.Split(',').FirstOrDefault()?.Trim();
                    if (!string.IsNullOrEmpty(ip) && ip != "unknown")
                    {
                        return ip;
                    }
                }
            }

            return "Unknown";
        }

        private static async Task<HttpResponseData> CreateErrorResponse(
            HttpRequestData req,
            HttpStatusCode statusCode,
            string message
        )
        {
            var response = req.CreateResponse(statusCode);
            await response.WriteAsJsonAsync(new ErrorResponse { Error = message });
            return response;
        }

        private static async Task<HttpResponseData> CreateValidationErrorResponse(
            HttpRequestData req,
            string message,
            List<string> details
        )
        {
            var response = req.CreateResponse(HttpStatusCode.BadRequest);
            await response.WriteAsJsonAsync(
                new ErrorResponse { Error = message, Details = details }
            );
            return response;
        }
    }
}
