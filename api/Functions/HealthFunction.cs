using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;

namespace pvi_calculator_api.Functions
{
    public class HealthFunction
    {
        private readonly ILogger<HealthFunction> _logger;

        public HealthFunction(ILogger<HealthFunction> logger)
        {
            _logger = logger;
        }

        [Function("Health")]
        public async Task<HttpResponseData> Health(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")] HttpRequestData req
        )
        {
            _logger.LogInformation("Health check requested");

            try
            {
                var response = req.CreateResponse(HttpStatusCode.OK);
                await response.WriteAsJsonAsync(
                    new HealthResponse { Status = "OK", Timestamp = DateTime.UtcNow }
                );

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Health check failed");

                var errorResponse = req.CreateResponse(HttpStatusCode.InternalServerError);
                await errorResponse.WriteAsJsonAsync(
                    new ErrorResponse { Error = "Health check failed" }
                );
                return errorResponse;
            }
        }
    }
}
