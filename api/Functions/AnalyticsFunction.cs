using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Services;

namespace pvi_calculator_api.Functions
{
    public class AnalyticsFunction
    {
        private readonly ILogger _logger;
        private readonly TableStorageService _tableStorageService;

        public AnalyticsFunction(
            ILoggerFactory loggerFactory,
            TableStorageService tableStorageService
        )
        {
            _logger = loggerFactory.CreateLogger<AnalyticsFunction>();
            _tableStorageService = tableStorageService;
        }

        [Function("Analytics")]
        public async Task<HttpResponseData> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "analytics")]
                HttpRequestData req
        )
        {
            _logger.LogInformation("Analytics function processed a request.");

            try
            {
                var analyticsData = await _tableStorageService.GetAnalyticsAsync();

                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(analyticsData);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics");
                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(
                    new { error = $"Internal server error: {ex.Message}" }
                );
                return errorResponse;
            }
        }
    }
}
