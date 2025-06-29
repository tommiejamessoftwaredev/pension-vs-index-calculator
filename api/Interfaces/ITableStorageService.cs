using pvi_calculator_api.Models;

namespace pvi_calculator_api.Services.Interfaces
{
    public interface ITableStorageService
    {
        Task SaveCalculationAsync(
            string calculationId,
            PensionInputs pensionInputs,
            IndexInputs indexInputs,
            CalculationResult pensionResult,
            CalculationResult indexResult,
            decimal difference,
            string clientIP,
            string country
        );

        Task SaveAnalyticsAsync(
            string calculationId,
            AnalyticsData? analytics,
            string country,
            string clientIP
        );

        Task<object> GetAnalyticsAsync();
    }
}