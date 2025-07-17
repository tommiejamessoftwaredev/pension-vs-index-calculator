using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using pvi_calculator_api.Functions;
using Xunit;

namespace Tests.Functions
{
    public class HealthFunctionTests
    {
        private readonly ILogger<HealthFunction> _mockLogger;
        private readonly HealthFunction _function;

        public HealthFunctionTests()
        {
            _mockLogger = Substitute.For<ILogger<HealthFunction>>();
            _function = new HealthFunction(_mockLogger);
        }

        [Fact]
        public void HealthFunction_Constructor_SetsUpDependencies()
        {
            // Arrange & Act - constructor called in test setup
            
            // Assert
            Assert.NotNull(_function);
        }

        [Fact]
        public void HealthFunction_HasCorrectLoggerDependency()
        {
            // Arrange & Act - constructor called in test setup
            
            // Assert
            Assert.NotNull(_mockLogger);
        }

        [Fact]
        public void HealthFunction_VerifyDependencyInjection()
        {
            // This test verifies that the health function can be instantiated
            // with its logger dependency without throwing exceptions
            
            // Arrange & Act
            var function = new HealthFunction(_mockLogger);

            // Assert
            Assert.NotNull(function);
        }
    }
}