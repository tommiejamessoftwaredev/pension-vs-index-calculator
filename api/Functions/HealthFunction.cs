using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;

namespace pvi_calculator_api.Functions
{
    public class HealthFunction
    {
        private readonly ILogger _logger;

        public HealthFunction(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<HealthFunction>();
        }

        [Function("Health")]
        public async Task<HttpResponseData> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "health")] HttpRequestData req
        )
        {
            _logger.LogInformation("Health check processed a request.");

            var response = req.CreateResponse(HttpStatusCode.OK);
            await response.WriteAsJsonAsync(
                new HealthResponse { Status = "OK", Timestamp = DateTime.UtcNow }
            );

            return response;
        }
    }
}
