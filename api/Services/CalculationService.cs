using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services.Interfaces;

namespace pvi_calculator_api.Services
{
    public class CalculationService : ICalculationService
    {
        private readonly ILogger<CalculationService> _logger;

        public CalculationService(ILogger<CalculationService> logger)
        {
            _logger = logger;
        }

        public CalculationResult CalculateCompoundGrowth(
            decimal startAmount,
            decimal monthlyAmount,
            decimal annualRate,
            int years,
            decimal taxRelief = 0,
            decimal annualCharges = 0,
            decimal employerContrib = 0,
            decimal annualIncrease = 0
        )
        {
            try
            {
                _logger.LogInformation(
                    "Starting compound growth calculation for {Years} years",
                    years
                );

                var effectiveAnnualRate = annualRate - annualCharges;
                var effectiveMonthlyRate = effectiveAnnualRate / 12 / 100;
                var months = years * 12;

                var assumedMonthlySalary = 2500m; // £30k/year

                var balance = startAmount;
                var yearlyBalances = new List<decimal>();
                var currentMonthlyAmount = monthlyAmount;
                var totalEmployeeContrib = startAmount;
                var totalEmployerContrib = 0m;

                for (int month = 1; month <= months; month++)
                {
                    var effectiveMonthlyAmount = currentMonthlyAmount * (1 + taxRelief / 100);
                    var monthlyEmployerContrib = assumedMonthlySalary * (employerContrib / 100);
                    var totalMonthlyContrib = effectiveMonthlyAmount + monthlyEmployerContrib;

                    balance = balance * (1 + effectiveMonthlyRate) + totalMonthlyContrib;

                    totalEmployeeContrib += currentMonthlyAmount;
                    totalEmployerContrib += monthlyEmployerContrib;

                    if (month % 12 == 0)
                    {
                        yearlyBalances.Add(balance);
                        currentMonthlyAmount = currentMonthlyAmount * (1 + annualIncrease / 100);
                    }
                }

                _logger.LogInformation(
                    "Compound growth calculation completed. Final balance: {FinalBalance:C}",
                    balance
                );

                return new CalculationResult
                {
                    FinalBalance = balance,
                    YearlyBalances = yearlyBalances,
                    TotalEmployeeContrib = totalEmployeeContrib,
                    TotalEmployerContrib = totalEmployerContrib,
                    Years = years,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating compound growth");
                throw;
            }
        }

        public CalculationResult CalculateIndexGrowthWithTax(
            decimal startAmount,
            decimal monthlyAmount,
            decimal annualRate,
            int years,
            decimal annualCharges = 0.2m,
            decimal withdrawalRate = 4,
            decimal annualIncrease = 0,
            bool isISA = false
        )
        {
            try
            {
                _logger.LogInformation(
                    "Starting index growth calculation for {Years} years",
                    years
                );

                var monthlyRate = (annualRate - annualCharges) / 12 / 100;
                var months = years * 12;
                var capitalGainsAllowance = 6000m;
                var capitalGainsRate = 0.20m;

                var balance = startAmount;
                var totalContributions = startAmount;
                var yearlyBalances = new List<decimal>();
                var currentMonthlyAmount = monthlyAmount;

                for (int month = 1; month <= months; month++)
                {
                    balance = balance * (1 + monthlyRate) + currentMonthlyAmount;
                    totalContributions += currentMonthlyAmount;

                    if (month % 12 == 0)
                    {
                        yearlyBalances.Add(balance);
                        currentMonthlyAmount = currentMonthlyAmount * (1 + annualIncrease / 100);
                    }
                }

                // Calculate tax on withdrawal (ISA has no capital gains tax)
                var totalCapitalGainsTax = 0m;
                var effectiveValue = balance;

                if (!isISA)
                {
                    var retirementYears = 25;
                    var annualWithdrawal = balance * (withdrawalRate / 100);
                    var remainingBalance = balance;
                    var remainingContributions = totalContributions;

                    for (int year = 1; year <= retirementYears && remainingBalance > 0; year++)
                    {
                        remainingBalance *= (1 + (annualRate - annualCharges) / 100);

                        var withdrawAmount = Math.Min(annualWithdrawal, remainingBalance);
                        var gainsRatio = Math.Max(
                            0,
                            (remainingBalance - remainingContributions) / remainingBalance
                        );
                        var gainsPortion = withdrawAmount * gainsRatio;
                        var contributionsPortion = withdrawAmount * (1 - gainsRatio);

                        var taxableGains = Math.Max(0, gainsPortion - capitalGainsAllowance);
                        var yearlyTax = taxableGains * capitalGainsRate;
                        totalCapitalGainsTax += yearlyTax;

                        remainingBalance -= withdrawAmount;
                        remainingContributions -= contributionsPortion;

                        if (remainingBalance < 1000)
                            break;
                    }

                    effectiveValue = balance - totalCapitalGainsTax;
                }

                _logger.LogInformation(
                    "Index growth calculation completed. Final balance: {FinalBalance:C}, Tax: {Tax:C}",
                    effectiveValue,
                    totalCapitalGainsTax
                );

                return new CalculationResult
                {
                    FinalBalance = effectiveValue,
                    YearlyBalances = yearlyBalances,
                    TotalContributions = totalContributions,
                    CapitalGainsTax = totalCapitalGainsTax,
                    Years = years,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating index growth with tax");
                throw;
            }
        }
    }
}
