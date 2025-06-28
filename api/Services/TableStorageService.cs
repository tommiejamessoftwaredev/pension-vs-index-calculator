using System.Text.Json;
using Azure.Data.Tables;
using pvi_calculator_api.Models;

namespace pvi_calculator_api.Services
{
    public class TableStorageService
    {
        private readonly TableClient _calculationsTable;
        private readonly TableClient _analyticsTable;

        public TableStorageService(string connectionString)
        {
            _calculationsTable = new TableClient(connectionString, "calculations");
            _analyticsTable = new TableClient(connectionString, "analytics");

            // Create tables if they don't exist
            _calculationsTable.CreateIfNotExists();
            _analyticsTable.CreateIfNotExists();
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
        }

        public async Task SaveAnalyticsAsync(
            string calculationId,
            AnalyticsData analytics,
            string country,
            string clientIP
        )
        {
            if (analytics == null)
                return;

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
        }

        public async Task<object> GetAnalyticsAsync()
        {
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

            return new
            {
                totalCalculations = calculations.Count,
                calculations = calculations.TakeLast(100),
                analytics = analytics.TakeLast(100),
            };
        }
    }
}
