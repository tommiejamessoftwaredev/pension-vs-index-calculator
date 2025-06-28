namespace pvi_calculator_api.Models
{
    public class PensionInputs
    {
        public decimal StartAmount { get; set; }
        public int StartAge { get; set; }
        public int EndAge { get; set; }
        public decimal MonthlyAmount { get; set; }
        public decimal AnnualIncrease { get; set; }
        public decimal AnnualReturn { get; set; }
        public decimal TaxRelief { get; set; }
        public decimal EmployerContrib { get; set; }
    }

    public class IndexInputs
    {
        public decimal StartAmount { get; set; }
        public int StartAge { get; set; }
        public int EndAge { get; set; }
        public decimal MonthlyAmount { get; set; }
        public decimal AnnualIncrease { get; set; }
        public decimal AnnualReturn { get; set; }
        public decimal WithdrawalRate { get; set; }
    }

    public class AnalyticsData
    {
        public string UserAgent { get; set; }
        public string Timestamp { get; set; }
        public string ScreenResolution { get; set; }
        public string Timezone { get; set; }
        public string Language { get; set; }
    }

    public class CalculationRequest
    {
        public PensionInputs PensionInputs { get; set; }
        public IndexInputs IndexInputs { get; set; }
        public AnalyticsData Analytics { get; set; }
    }

    public class CalculationResult
    {
        public decimal FinalBalance { get; set; }
        public List<decimal> YearlyBalances { get; set; } = new();
        public decimal? TotalEmployeeContrib { get; set; }
        public decimal? TotalEmployerContrib { get; set; }
        public decimal? TotalContributions { get; set; }
        public decimal? CapitalGainsTax { get; set; }
        public int Years { get; set; }
    }

    public class CalculationResponse
    {
        public CalculationResult Pension { get; set; }
        public CalculationResult Index { get; set; }
        public decimal Difference { get; set; }
        public string CalculationId { get; set; }
    }

    public class HealthResponse
    {
        public string Status { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
