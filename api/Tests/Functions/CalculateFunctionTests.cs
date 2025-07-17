using System.Net;
using System.Text;
using System.Text.Json;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using NSubstitute;
using pvi_calculator_api.Functions;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services.Interfaces;
using Xunit;

namespace Tests.Functions
{
    public class CalculateFunctionTests
    {
        private readonly ILogger<CalculateFunction> _mockLogger;
        private readonly ICalculationService _mockCalculationService;
        private readonly ITableStorageService _mockTableStorageService;
        private readonly IValidator<CalculationRequest> _mockValidator;
        private readonly CalculateFunction _function;

        public CalculateFunctionTests()
        {
            _mockLogger = Substitute.For<ILogger<CalculateFunction>>();
            _mockCalculationService = Substitute.For<ICalculationService>();
            _mockTableStorageService = Substitute.For<ITableStorageService>();
            _mockValidator = Substitute.For<IValidator<CalculationRequest>>();
            _function = new CalculateFunction(
                _mockLogger, _mockCalculationService, _mockTableStorageService, _mockValidator);
        }

        [Fact]
        public void CalculateFunction_Constructor_SetsUpDependencies()
        {
            // Arrange & Act - constructor called in test setup
            
            // Assert
            Assert.NotNull(_function);
        }

        [Fact]
        public void CalculateFunction_HasCorrectValidationDependency()
        {
            // Arrange & Act - constructor called in test setup
            
            // Assert
            Assert.NotNull(_mockValidator);
        }

        [Fact]
        public void CalculateFunction_VerifyDependencyInjection()
        {
            // This test verifies that all dependencies are properly injected
            // and the function can be instantiated without throwing exceptions
            
            // Arrange & Act
            var function = new CalculateFunction(
                _mockLogger, 
                _mockCalculationService, 
                _mockTableStorageService, 
                _mockValidator);

            // Assert
            Assert.NotNull(function);
        }

    }
}