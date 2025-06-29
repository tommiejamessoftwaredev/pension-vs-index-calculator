using pvi_calculator_api.Models;

namespace pvi_calculator_api.Services.Interfaces
{
    public interface ICalculationService
    {
        CalculationResult CalculateCompoundGrowth(
            decimal startAmount,
            decimal monthlyAmount,
            decimal annualRate,
            int years,
            decimal taxRelief = 0,
            decimal annualCharges = 0,
            decimal employerContrib = 0,
            decimal annualIncrease = 0
        );

        CalculationResult CalculateIndexGrowthWithTax(
            decimal startAmount,
            decimal monthlyAmount,
            decimal annualRate,
            int years,
            decimal annualCharges = 0.2m,
            decimal withdrawalRate = 4,
            decimal annualIncrease = 0
        );
    }
}