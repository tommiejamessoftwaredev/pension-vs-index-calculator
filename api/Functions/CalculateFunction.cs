using System.Net;
using System.Text.Json;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services;

namespace pvi_calculator_api.Functions
{
    public class CalculateFunction
    {
        private readonly ILogger _logger;
        private readonly CalculationService _calculationService;
        private readonly TableStorageService _tableStorageService;

        public CalculateFunction(
            ILoggerFactory loggerFactory,
            CalculationService calculationService,
            TableStorageService tableStorageService
        )
        {
            _logger = loggerFactory.CreateLogger<CalculateFunction>();
            _calculationService = calculationService;
            _tableStorageService = tableStorageService;
        }

        [Function("Calculate")]
        public async Task<HttpResponseData> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "calculate")]
                HttpRequestData req
        )
        {
            _logger.LogInformation("Calculate function processed a request.");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                var calculationRequest = JsonSerializer.Deserialize<CalculationRequest>(
                    requestBody,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                );

                if (
                    calculationRequest?.PensionInputs == null
                    || calculationRequest?.IndexInputs == null
                )
                {
                    var badResponse = req.CreateResponse(HttpStatusCode.BadRequest);
                    await badResponse.WriteAsJsonAsync(new { error = "Missing required inputs" });
                    return badResponse;
                }

                // Generate unique calculation ID
                var calculationId = Guid.NewGuid().ToString();

                // Get client IP and country (simplified for Azure Functions)
                var clientIP =
                    req.Headers.GetValues("X-Forwarded-For").FirstOrDefault() ?? "Unknown";
                var country = "Unknown"; // You could add a GeoIP service here

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
                    0.75m, // NEST charges
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
                    calculationRequest.IndexInputs.AnnualIncrease
                );

                var difference = pensionResult.FinalBalance - indexResult.FinalBalance;

                // Save to table storage
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

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing calculation");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(new { error = "Internal server error" });
                return errorResponse;
            }
        }
    }
}
