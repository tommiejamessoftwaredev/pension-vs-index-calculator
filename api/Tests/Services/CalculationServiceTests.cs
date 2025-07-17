using Microsoft.Extensions.Logging;
using NSubstitute;
using pvi_calculator_api.Services;
using Xunit;

namespace Tests.Services
{
    public class CalculationServiceTests
    {
        private readonly ILogger<CalculationService> _mockLogger;
        private readonly CalculationService _calculationService;

        public CalculationServiceTests()
        {
            _mockLogger = Substitute.For<ILogger<CalculationService>>();
            _calculationService = new CalculationService(_mockLogger);
        }

        [Fact]
        public void CalculateCompoundGrowth_WithBasicInputs_ReturnsExpectedResult()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 5m;
            int years = 10;

            // Act
            var result = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.FinalBalance > startAmount);
            Assert.Equal(years, result.Years);
            Assert.Equal(years, result.YearlyBalances.Count);
            Assert.True(result.TotalEmployeeContrib > startAmount);
        }

        [Fact]
        public void CalculateCompoundGrowth_WithTaxRelief_IncreasesFinalBalance()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 5m;
            int years = 10;
            decimal taxRelief = 20m;

            // Act
            var resultWithoutTaxRelief = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, 0);
            var resultWithTaxRelief = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, taxRelief);

            // Assert
            Assert.True(resultWithTaxRelief.FinalBalance > resultWithoutTaxRelief.FinalBalance);
        }

        [Fact]
        public void CalculateCompoundGrowth_WithEmployerContribution_IncreasesFinalBalance()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 5m;
            int years = 10;
            decimal employerContrib = 3m;

            // Act
            var resultWithoutEmployer = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, 0, 0, 0);
            var resultWithEmployer = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, 0, 0, employerContrib);

            // Assert
            Assert.True(resultWithEmployer.FinalBalance > resultWithoutEmployer.FinalBalance);
            Assert.True(resultWithEmployer.TotalEmployerContrib > 0);
        }

        [Fact]
        public void CalculateCompoundGrowth_WithAnnualIncrease_IncreasesFinalBalance()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 5m;
            int years = 10;
            decimal annualIncrease = 3m;

            // Act
            var resultWithoutIncrease = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, 0, 0, 0, 0);
            var resultWithIncrease = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, 0, 0, 0, annualIncrease);

            // Assert
            Assert.True(resultWithIncrease.FinalBalance > resultWithoutIncrease.FinalBalance);
        }

        [Fact]
        public void CalculateCompoundGrowth_WithAnnualCharges_ReducesFinalBalance()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 5m;
            int years = 10;
            decimal annualCharges = 0.75m;

            // Act
            var resultWithoutCharges = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, 0, 0);
            var resultWithCharges = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years, 0, annualCharges);

            // Assert
            Assert.True(resultWithCharges.FinalBalance < resultWithoutCharges.FinalBalance);
        }

        [Theory]
        [InlineData(0, 0, 0)]
        [InlineData(1000, 100, 1)]
        [InlineData(50000, 1000, 20)]
        public void CalculateCompoundGrowth_WithVariousInputs_ReturnsValidResults(
            decimal startAmount, decimal monthlyAmount, int years)
        {
            // Arrange
            decimal annualRate = 5m;

            // Act
            var result = _calculationService.CalculateCompoundGrowth(
                startAmount, monthlyAmount, annualRate, years);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.FinalBalance >= 0);
            Assert.Equal(years, result.Years);
            Assert.Equal(years, result.YearlyBalances.Count);
        }

        [Fact]
        public void CalculateIndexGrowthWithTax_WithBasicInputs_ReturnsExpectedResult()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 7m;
            int years = 10;

            // Act
            var result = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.FinalBalance > startAmount);
            Assert.Equal(years, result.Years);
            Assert.Equal(years, result.YearlyBalances.Count);
            Assert.True(result.TotalContributions > startAmount);
        }

        [Fact]
        public void CalculateIndexGrowthWithTax_WithISA_HasNoCapitalGainsTax()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 7m;
            int years = 10;

            // Act
            var resultNonISA = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, isISA: false);
            var resultISA = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, isISA: true);

            // Assert
            Assert.True(resultISA.FinalBalance >= resultNonISA.FinalBalance);
            Assert.Equal(0, resultISA.CapitalGainsTax);
        }

        [Fact]
        public void CalculateIndexGrowthWithTax_WithHigherWithdrawalRate_AffectsFinalBalance()
        {
            // Arrange
            decimal startAmount = 100000m; // Larger starting amount to see tax effects
            decimal monthlyAmount = 1000m;
            decimal annualRate = 10m; // Higher return rate
            int years = 20; // Longer time period

            // Act
            var resultLowWithdrawal = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, withdrawalRate: 3, isISA: false);
            var resultHighWithdrawal = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, withdrawalRate: 6, isISA: false);

            // Assert
            Assert.NotEqual(resultLowWithdrawal.FinalBalance, resultHighWithdrawal.FinalBalance);
        }

        [Fact]
        public void CalculateIndexGrowthWithTax_WithAnnualCharges_ReducesFinalBalance()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 7m;
            int years = 10;

            // Act
            var resultLowCharges = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, annualCharges: 0.1m);
            var resultHighCharges = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, annualCharges: 1.0m);

            // Assert
            Assert.True(resultLowCharges.FinalBalance > resultHighCharges.FinalBalance);
        }

        [Fact]
        public void CalculateIndexGrowthWithTax_WithAnnualIncrease_IncreasesFinalBalance()
        {
            // Arrange
            decimal startAmount = 10000m;
            decimal monthlyAmount = 500m;
            decimal annualRate = 7m;
            int years = 10;
            decimal annualIncrease = 3m;

            // Act
            var resultWithoutIncrease = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, annualIncrease: 0);
            var resultWithIncrease = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years, annualIncrease: annualIncrease);

            // Assert
            Assert.True(resultWithIncrease.FinalBalance > resultWithoutIncrease.FinalBalance);
        }

        [Theory]
        [InlineData(5000, 300, 6, 5)]
        [InlineData(25000, 800, 8, 15)]
        [InlineData(100000, 2000, 10, 25)]
        public void CalculateIndexGrowthWithTax_WithVariousInputs_ReturnsValidResults(
            decimal startAmount, decimal monthlyAmount, decimal annualRate, int years)
        {
            // Act
            var result = _calculationService.CalculateIndexGrowthWithTax(
                startAmount, monthlyAmount, annualRate, years);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.FinalBalance >= 0);
            Assert.Equal(years, result.Years);
            Assert.Equal(years, result.YearlyBalances.Count);
            Assert.True(result.TotalContributions >= startAmount);
        }
    }
}