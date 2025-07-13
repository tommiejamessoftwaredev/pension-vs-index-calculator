using System.Text.Json;
using Azure.Data.Tables;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services.Interfaces;

namespace pvi_calculator_api.Services
{
    public class TableStorageService : ITableStorageService
    {
        private readonly TableClient _calculationsTable;
        private readonly TableClient _analyticsTable;
        private readonly ILogger<TableStorageService> _logger;

        public TableStorageService(
            IConfiguration configuration,
            ILogger<TableStorageService> logger
        )
        {
            _logger = logger;

            var connectionString =
                Environment.GetEnvironmentVariable("TABLESTORAGECONNECTIONSTRING")
                ?? throw new InvalidOperationException("Azure Storage connection string not found");

            _calculationsTable = new TableClient(connectionString, "calculations");
            _analyticsTable = new TableClient(connectionString, "analytics");

            // Tables will be created on first use instead of during initialization
            _logger.LogInformation("TableStorageService initialized successfully");
        }

        public async Task SaveCalculationAsync(
            string calculationId,
            PensionInputs pensionInputs,
            IndexInputs indexInputs,
            CalculationResult pensionResult,
            CalculationResult indexResult,
            decimal difference,
            string clientIP,
            string country
        )
        {
            try
            {
                _logger.LogInformation("Saving calculation {CalculationId}", calculationId);

                // Ensure table exists before adding entity
                await _calculationsTable.CreateIfNotExistsAsync();

                var entity = new TableEntity("calculation", calculationId)
                {
                    ["timestamp"] = DateTime.UtcNow,
                    ["pensionInputs"] = JsonSerializer.Serialize(pensionInputs),
                    ["indexInputs"] = JsonSerializer.Serialize(indexInputs),
                    ["pensionResult"] = JsonSerializer.Serialize(pensionResult),
                    ["indexResult"] = JsonSerializer.Serialize(indexResult),
                    ["difference"] = (double)difference,
                    ["clientIP"] = clientIP,
                    ["country"] = country,
                };

                await _calculationsTable.AddEntityAsync(entity);
                _logger.LogInformation(
                    "Calculation {CalculationId} saved successfully",
                    calculationId
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving calculation {CalculationId}", calculationId);
                throw;
            }
        }

        public async Task SaveAnalyticsAsync(
            string calculationId,
            AnalyticsData? analytics,
            string country,
            string clientIP
        )
        {
            if (analytics == null)
            {
                _logger.LogDebug(
                    "No analytics data provided for calculation {CalculationId}",
                    calculationId
                );
                return;
            }

            try
            {
                _logger.LogInformation(
                    "Saving analytics for calculation {CalculationId}",
                    calculationId
                );

                // Ensure table exists before adding entity
                await _analyticsTable.CreateIfNotExistsAsync();

                var entity = new TableEntity("analytics", Guid.NewGuid().ToString())
                {
                    ["calculationId"] = calculationId,
                    ["timestamp"] = DateTime.UtcNow,
                    ["userAgent"] = analytics.UserAgent,
                    ["country"] = country,
                    ["screenResolution"] = analytics.ScreenResolution,
                    ["timezone"] = analytics.Timezone,
                    ["language"] = analytics.Language,
                    ["clientIP"] = clientIP,
                };

                await _analyticsTable.AddEntityAsync(entity);
                _logger.LogInformation(
                    "Analytics saved successfully for calculation {CalculationId}",
                    calculationId
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error saving analytics for calculation {CalculationId}",
                    calculationId
                );
                // Don't throw here - analytics failure shouldn't break the calculation
            }
        }

        public async Task<object> GetAnalyticsAsync()
        {
            try
            {
                _logger.LogInformation("Retrieving analytics data");

                var calculations = new List<TableEntity>();
                var analytics = new List<TableEntity>();

                await foreach (var entity in _calculationsTable.QueryAsync<TableEntity>())
                {
                    calculations.Add(entity);
                }

                await foreach (var entity in _analyticsTable.QueryAsync<TableEntity>())
                {
                    analytics.Add(entity);
                }

                _logger.LogInformation(
                    "Retrieved {CalculationCount} calculations and {AnalyticsCount} analytics records",
                    calculations.Count,
                    analytics.Count
                );

                return new
                {
                    totalCalculations = calculations.Count,
                    calculations = calculations.TakeLast(100),
                    analytics = analytics.TakeLast(100),
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics data");
                throw;
            }
        }
    }
}
