using System.Text.Json.Serialization;

namespace pvi_calculator_api.Models
{
    public class PensionInputs
    {
        [JsonPropertyName("startAmount")]
        public decimal StartAmount { get; set; }

        [JsonPropertyName("startAge")]
        public int StartAge { get; set; }

        [JsonPropertyName("endAge")]
        public int EndAge { get; set; }

        [JsonPropertyName("monthlyAmount")]
        public decimal MonthlyAmount { get; set; }

        [JsonPropertyName("annualIncrease")]
        public decimal AnnualIncrease { get; set; }

        [JsonPropertyName("annualReturn")]
        public decimal AnnualReturn { get; set; }

        [JsonPropertyName("taxRelief")]
        public decimal TaxRelief { get; set; }

        [JsonPropertyName("employerContrib")]
        public decimal EmployerContrib { get; set; }
    }

    public class IndexInputs
    {
        [JsonPropertyName("startAmount")]
        public decimal StartAmount { get; set; }

        [JsonPropertyName("startAge")]
        public int StartAge { get; set; }

        [JsonPropertyName("endAge")]
        public int EndAge { get; set; }

        [JsonPropertyName("monthlyAmount")]
        public decimal MonthlyAmount { get; set; }

        [JsonPropertyName("annualIncrease")]
        public decimal AnnualIncrease { get; set; }

        [JsonPropertyName("annualReturn")]
        public decimal AnnualReturn { get; set; }

        [JsonPropertyName("withdrawalRate")]
        public decimal WithdrawalRate { get; set; }

        [JsonPropertyName("isISA")]
        public bool IsISA { get; set; }
    }

    public class AnalyticsData
    {
        [JsonPropertyName("userAgent")]
        public string UserAgent { get; set; } = string.Empty;

        [JsonPropertyName("timestamp")]
        public string Timestamp { get; set; } = string.Empty;

        [JsonPropertyName("screenResolution")]
        public string ScreenResolution { get; set; } = string.Empty;

        [JsonPropertyName("timezone")]
        public string Timezone { get; set; } = string.Empty;

        [JsonPropertyName("language")]
        public string Language { get; set; } = string.Empty;
    }

    public class CalculationRequest
    {
        [JsonPropertyName("pensionInputs")]
        public PensionInputs PensionInputs { get; set; } = new();

        [JsonPropertyName("indexInputs")]
        public IndexInputs IndexInputs { get; set; } = new();

        [JsonPropertyName("analytics")]
        public AnalyticsData? Analytics { get; set; }
    }

    public class CalculationResult
    {
        [JsonPropertyName("finalBalance")]
        public decimal FinalBalance { get; set; }

        [JsonPropertyName("yearlyBalances")]
        public List<decimal> YearlyBalances { get; set; } = new();

        [JsonPropertyName("totalEmployeeContrib")]
        public decimal? TotalEmployeeContrib { get; set; }

        [JsonPropertyName("totalEmployerContrib")]
        public decimal? TotalEmployerContrib { get; set; }

        [JsonPropertyName("totalContributions")]
        public decimal? TotalContributions { get; set; }

        [JsonPropertyName("capitalGainsTax")]
        public decimal? CapitalGainsTax { get; set; }

        [JsonPropertyName("years")]
        public int Years { get; set; }
    }

    public class CalculationResponse
    {
        [JsonPropertyName("pension")]
        public CalculationResult Pension { get; set; } = new();

        [JsonPropertyName("index")]
        public CalculationResult Index { get; set; } = new();

        [JsonPropertyName("difference")]
        public decimal Difference { get; set; }

        [JsonPropertyName("calculationId")]
        public string CalculationId { get; set; } = string.Empty;
    }

    public class HealthResponse
    {
        [JsonPropertyName("status")]
        public string Status { get; set; } = string.Empty;

        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; }
    }

    public class ErrorResponse
    {
        [JsonPropertyName("error")]
        public string Error { get; set; } = string.Empty;

        [JsonPropertyName("details")]
        public List<string>? Details { get; set; }
    }
}
