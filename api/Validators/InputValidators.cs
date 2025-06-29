using FluentValidation;
using pvi_calculator_api.Models;

namespace pvi_calculator_api.Validators
{
    public class PensionInputsValidator : AbstractValidator<PensionInputs>
    {
        public PensionInputsValidator()
        {
            RuleFor(x => x.StartAmount)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Starting amount must be non-negative")
                .LessThanOrEqualTo(10_000_000)
                .WithMessage("Starting amount cannot exceed £10,000,000");

            RuleFor(x => x.StartAge)
                .GreaterThanOrEqualTo(16)
                .WithMessage("Starting age must be at least 16")
                .LessThanOrEqualTo(75)
                .WithMessage("Starting age cannot exceed 75");

            RuleFor(x => x.EndAge)
                .GreaterThanOrEqualTo(50)
                .WithMessage("Retirement age must be at least 50")
                .LessThanOrEqualTo(85)
                .WithMessage("Retirement age cannot exceed 85");

            RuleFor(x => x.MonthlyAmount)
                .GreaterThan(0)
                .WithMessage("Monthly contribution must be greater than 0")
                .LessThanOrEqualTo(40_000)
                .WithMessage("Monthly contribution cannot exceed £40,000");

            RuleFor(x => x.AnnualIncrease)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Annual increase must be non-negative")
                .LessThanOrEqualTo(20)
                .WithMessage("Annual increase cannot exceed 20%");

            RuleFor(x => x.AnnualReturn)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Annual return must be non-negative")
                .LessThanOrEqualTo(25)
                .WithMessage("Annual return cannot exceed 25%");

            RuleFor(x => x.TaxRelief)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Tax relief must be non-negative")
                .LessThanOrEqualTo(45)
                .WithMessage("Tax relief cannot exceed 45%");

            RuleFor(x => x.EmployerContrib)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Employer contribution must be non-negative")
                .LessThanOrEqualTo(25)
                .WithMessage("Employer contribution cannot exceed 25%");

            RuleFor(x => x)
                .Must(x => x.EndAge > x.StartAge)
                .WithMessage("Retirement age must be greater than starting age");
        }
    }

    public class IndexInputsValidator : AbstractValidator<IndexInputs>
    {
        public IndexInputsValidator()
        {
            RuleFor(x => x.StartAmount)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Starting amount must be non-negative")
                .LessThanOrEqualTo(10_000_000)
                .WithMessage("Starting amount cannot exceed £10,000,000");

            RuleFor(x => x.StartAge)
                .GreaterThanOrEqualTo(16)
                .WithMessage("Starting age must be at least 16")
                .LessThanOrEqualTo(75)
                .WithMessage("Starting age cannot exceed 75");

            RuleFor(x => x.EndAge)
                .GreaterThanOrEqualTo(50)
                .WithMessage("End age must be at least 50")
                .LessThanOrEqualTo(85)
                .WithMessage("End age cannot exceed 85");

            RuleFor(x => x.MonthlyAmount)
                .GreaterThan(0)
                .WithMessage("Monthly contribution must be greater than 0")
                .LessThanOrEqualTo(40_000)
                .WithMessage("Monthly contribution cannot exceed £40,000");

            RuleFor(x => x.AnnualIncrease)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Annual increase must be non-negative")
                .LessThanOrEqualTo(20)
                .WithMessage("Annual increase cannot exceed 20%");

            RuleFor(x => x.AnnualReturn)
                .GreaterThanOrEqualTo(0)
                .WithMessage("Annual return must be non-negative")
                .LessThanOrEqualTo(25)
                .WithMessage("Annual return cannot exceed 25%");

            RuleFor(x => x.WithdrawalRate)
                .GreaterThan(0)
                .WithMessage("Withdrawal rate must be greater than 0")
                .LessThanOrEqualTo(15)
                .WithMessage("Withdrawal rate cannot exceed 15%");

            RuleFor(x => x)
                .Must(x => x.EndAge > x.StartAge)
                .WithMessage("End age must be greater than starting age");
        }
    }

    public class CalculationRequestValidator : AbstractValidator<CalculationRequest>
    {
        public CalculationRequestValidator()
        {
            RuleFor(x => x.PensionInputs)
                .NotNull()
                .WithMessage("Pension inputs are required")
                .SetValidator(new PensionInputsValidator());

            RuleFor(x => x.IndexInputs)
                .NotNull()
                .WithMessage("Index inputs are required")
                .SetValidator(new IndexInputsValidator());

            // Analytics is optional, so only validate if provided
            RuleFor(x => x.Analytics)
                .SetValidator(new AnalyticsDataValidator()!)
                .When(x => x.Analytics != null);
        }
    }

    public class AnalyticsDataValidator : AbstractValidator<AnalyticsData>
    {
        public AnalyticsDataValidator()
        {
            RuleFor(x => x.UserAgent)
                .NotEmpty()
                .WithMessage("User agent is required")
                .MaximumLength(500)
                .WithMessage("User agent cannot exceed 500 characters");

            RuleFor(x => x.Timestamp)
                .NotEmpty()
                .WithMessage("Timestamp is required")
                .Must(BeValidTimestamp)
                .WithMessage("Timestamp must be a valid ISO 8601 date");

            RuleFor(x => x.ScreenResolution)
                .NotEmpty()
                .WithMessage("Screen resolution is required")
                .Matches(@"^\d+x\d+$")
                .WithMessage("Screen resolution must be in format 'WIDTHxHEIGHT'");

            RuleFor(x => x.Timezone)
                .NotEmpty()
                .WithMessage("Timezone is required")
                .MaximumLength(100)
                .WithMessage("Timezone cannot exceed 100 characters");

            RuleFor(x => x.Language)
                .NotEmpty()
                .WithMessage("Language is required")
                .MaximumLength(20)
                .WithMessage("Language cannot exceed 20 characters");
        }

        private static bool BeValidTimestamp(string timestamp)
        {
            return DateTime.TryParse(timestamp, out _);
        }
    }
}
