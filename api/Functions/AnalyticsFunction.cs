using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services.Interfaces;

namespace pvi_calculator_api.Functions
{
    public class AnalyticsFunction
    {
        private readonly ILogger<AnalyticsFunction> _logger;
        private readonly ITableStorageService _tableStorageService;

        public AnalyticsFunction(
            ILogger<AnalyticsFunction> logger,
            ITableStorageService tableStorageService
        )
        {
            _logger = logger;
            _tableStorageService = tableStorageService;
        }

        [Function("Analytics")]
        public async Task<HttpResponseData> Analytics(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "analytics")]
                HttpRequestData req
        )
        {
            _logger.LogInformation("Analytics data requested");

            try
            {
                // In a real application, you'd want to add authentication here
                // For now, we'll just return the data
                var analyticsData = await _tableStorageService.GetAnalyticsAsync();

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(analyticsData);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics data");

                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(
                    new ErrorResponse { Error = "Failed to retrieve analytics data" }
                );
                return errorResponse;
            }
        }
    }
}
