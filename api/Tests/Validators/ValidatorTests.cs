using pvi_calculator_api.Models;
using pvi_calculator_api.Validators;
using Xunit;

namespace Tests.Validators
{
    public class PensionInputsValidatorTests
    {
        private readonly PensionInputsValidator _validator;

        public PensionInputsValidatorTests()
        {
            _validator = new PensionInputsValidator();
        }

        [Fact]
        public void ValidInput_ShouldPassValidation()
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.True(result.IsValid);
            Assert.Empty(result.Errors);
        }

        [Theory]
        [InlineData(-1000)]
        [InlineData(15_000_000)]
        public void StartAmount_OutOfRange_ShouldFailValidation(decimal startAmount)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = startAmount,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.StartAmount));
        }

        [Theory]
        [InlineData(15)]
        [InlineData(80)]
        public void StartAge_OutOfRange_ShouldFailValidation(int startAge)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = startAge,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.StartAge));
        }

        [Theory]
        [InlineData(45)]
        [InlineData(90)]
        public void EndAge_OutOfRange_ShouldFailValidation(int endAge)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = endAge,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.EndAge));
        }

        [Fact]
        public void EndAge_LessThanOrEqualToStartAge_ShouldFailValidation()
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 65,
                EndAge = 60,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == "Retirement age must be greater than starting age");
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-100)]
        [InlineData(50_000)]
        public void MonthlyAmount_OutOfRange_ShouldFailValidation(decimal monthlyAmount)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = monthlyAmount,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.MonthlyAmount));
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(25)]
        public void AnnualIncrease_OutOfRange_ShouldFailValidation(decimal annualIncrease)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = annualIncrease,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.AnnualIncrease));
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(30)]
        public void AnnualReturn_OutOfRange_ShouldFailValidation(decimal annualReturn)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = annualReturn,
                TaxRelief = 20,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.AnnualReturn));
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(50)]
        public void TaxRelief_OutOfRange_ShouldFailValidation(decimal taxRelief)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = taxRelief,
                EmployerContrib = 3
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.TaxRelief));
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(30)]
        public void EmployerContrib_OutOfRange_ShouldFailValidation(decimal employerContrib)
        {
            // Arrange
            var input = new PensionInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                TaxRelief = 20,
                EmployerContrib = employerContrib
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(PensionInputs.EmployerContrib));
        }
    }

    public class IndexInputsValidatorTests
    {
        private readonly IndexInputsValidator _validator;

        public IndexInputsValidatorTests()
        {
            _validator = new IndexInputsValidator();
        }

        [Fact]
        public void ValidInput_ShouldPassValidation()
        {
            // Arrange
            var input = new IndexInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                WithdrawalRate = 4,
                IsISA = false
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.True(result.IsValid);
            Assert.Empty(result.Errors);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        [InlineData(20)]
        public void WithdrawalRate_OutOfRange_ShouldFailValidation(decimal withdrawalRate)
        {
            // Arrange
            var input = new IndexInputs
            {
                StartAmount = 10000,
                StartAge = 25,
                EndAge = 65,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                WithdrawalRate = withdrawalRate,
                IsISA = false
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(IndexInputs.WithdrawalRate));
        }

        [Fact]
        public void EndAge_LessThanOrEqualToStartAge_ShouldFailValidation()
        {
            // Arrange
            var input = new IndexInputs
            {
                StartAmount = 10000,
                StartAge = 65,
                EndAge = 60,
                MonthlyAmount = 500,
                AnnualIncrease = 3,
                AnnualReturn = 7,
                WithdrawalRate = 4,
                IsISA = false
            };

            // Act
            var result = _validator.Validate(input);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.ErrorMessage == "End age must be greater than starting age");
        }
    }

    public class CalculationRequestValidatorTests
    {
        private readonly CalculationRequestValidator _validator;

        public CalculationRequestValidatorTests()
        {
            _validator = new CalculationRequestValidator();
        }

        [Fact]
        public void ValidRequest_ShouldPassValidation()
        {
            // Arrange
            var request = new CalculationRequest
            {
                PensionInputs = new PensionInputs
                {
                    StartAmount = 10000,
                    StartAge = 25,
                    EndAge = 65,
                    MonthlyAmount = 500,
                    AnnualIncrease = 3,
                    AnnualReturn = 7,
                    TaxRelief = 20,
                    EmployerContrib = 3
                },
                IndexInputs = new IndexInputs
                {
                    StartAmount = 10000,
                    StartAge = 25,
                    EndAge = 65,
                    MonthlyAmount = 500,
                    AnnualIncrease = 3,
                    AnnualReturn = 7,
                    WithdrawalRate = 4,
                    IsISA = false
                }
            };

            // Act
            var result = _validator.Validate(request);

            // Assert
            Assert.True(result.IsValid);
            Assert.Empty(result.Errors);
        }

        [Fact]
        public void NullPensionInputs_ShouldFailValidation()
        {
            // Arrange
            var request = new CalculationRequest
            {
                PensionInputs = null!,
                IndexInputs = new IndexInputs
                {
                    StartAmount = 10000,
                    StartAge = 25,
                    EndAge = 65,
                    MonthlyAmount = 500,
                    AnnualIncrease = 3,
                    AnnualReturn = 7,
                    WithdrawalRate = 4,
                    IsISA = false
                }
            };

            // Act
            var result = _validator.Validate(request);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(CalculationRequest.PensionInputs));
        }

        [Fact]
        public void NullIndexInputs_ShouldFailValidation()
        {
            // Arrange
            var request = new CalculationRequest
            {
                PensionInputs = new PensionInputs
                {
                    StartAmount = 10000,
                    StartAge = 25,
                    EndAge = 65,
                    MonthlyAmount = 500,
                    AnnualIncrease = 3,
                    AnnualReturn = 7,
                    TaxRelief = 20,
                    EmployerContrib = 3
                },
                IndexInputs = null!
            };

            // Act
            var result = _validator.Validate(request);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(CalculationRequest.IndexInputs));
        }
    }

    public class AnalyticsDataValidatorTests
    {
        private readonly AnalyticsDataValidator _validator;

        public AnalyticsDataValidatorTests()
        {
            _validator = new AnalyticsDataValidator();
        }

        [Fact]
        public void ValidAnalyticsData_ShouldPassValidation()
        {
            // Arrange
            var analytics = new AnalyticsData
            {
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Timestamp = DateTime.UtcNow.ToString("O"),
                ScreenResolution = "1920x1080",
                Timezone = "Europe/London",
                Language = "en-GB"
            };

            // Act
            var result = _validator.Validate(analytics);

            // Assert
            Assert.True(result.IsValid);
            Assert.Empty(result.Errors);
        }

        [Theory]
        [InlineData("")]
        public void EmptyUserAgent_ShouldFailValidation(string userAgent)
        {
            // Arrange
            var analytics = new AnalyticsData
            {
                UserAgent = userAgent,
                Timestamp = DateTime.UtcNow.ToString("O"),
                ScreenResolution = "1920x1080",
                Timezone = "Europe/London",
                Language = "en-GB"
            };

            // Act
            var result = _validator.Validate(analytics);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(AnalyticsData.UserAgent));
        }

        [Fact]
        public void NullUserAgent_ShouldFailValidation()
        {
            // Arrange
            var analytics = new AnalyticsData
            {
                UserAgent = null!,
                Timestamp = DateTime.UtcNow.ToString("O"),
                ScreenResolution = "1920x1080",
                Timezone = "Europe/London",
                Language = "en-GB"
            };

            // Act
            var result = _validator.Validate(analytics);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(AnalyticsData.UserAgent));
        }

        [Theory]
        [InlineData("invalid-date")]
        [InlineData("")]
        public void InvalidTimestamp_ShouldFailValidation(string timestamp)
        {
            // Arrange
            var analytics = new AnalyticsData
            {
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Timestamp = timestamp,
                ScreenResolution = "1920x1080",
                Timezone = "Europe/London",
                Language = "en-GB"
            };

            // Act
            var result = _validator.Validate(analytics);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(AnalyticsData.Timestamp));
        }

        [Theory]
        [InlineData("invalid-resolution")]
        [InlineData("1920")]
        [InlineData("")]
        public void InvalidScreenResolution_ShouldFailValidation(string screenResolution)
        {
            // Arrange
            var analytics = new AnalyticsData
            {
                UserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                Timestamp = DateTime.UtcNow.ToString("O"),
                ScreenResolution = screenResolution,
                Timezone = "Europe/London",
                Language = "en-GB"
            };

            // Act
            var result = _validator.Validate(analytics);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(AnalyticsData.ScreenResolution));
        }

        [Fact]
        public void TooLongUserAgent_ShouldFailValidation()
        {
            // Arrange
            var analytics = new AnalyticsData
            {
                UserAgent = new string('a', 600), // Exceeds 500 character limit
                Timestamp = DateTime.UtcNow.ToString("O"),
                ScreenResolution = "1920x1080",
                Timezone = "Europe/London",
                Language = "en-GB"
            };

            // Act
            var result = _validator.Validate(analytics);

            // Assert
            Assert.False(result.IsValid);
            Assert.Contains(result.Errors, e => e.PropertyName == nameof(AnalyticsData.UserAgent));
        }
    }
}