using System.Text.Json;
using System.Text.Json.Serialization;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services;
using pvi_calculator_api.Services.Interfaces;
using pvi_calculator_api.Validators;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        // Configure JSON serialization options
        builder.Services.Configure<JsonSerializerOptions>(options =>
        {
            options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            options.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            options.PropertyNameCaseInsensitive = true;
        });
    })
    .ConfigureServices(
        (context, services) =>
        {
            // Configuration
            var configuration = context.Configuration;

            // Logging
            services.AddLogging(logging =>
            {
                logging.ClearProviders();
                logging.AddConsole();
                logging.SetMinimumLevel(LogLevel.Information);
            });

            // Application Services
            services.AddScoped<ICalculationService, CalculationService>();
            services.AddScoped<ITableStorageService, TableStorageService>();

            // FluentValidation
            services.AddScoped<IValidator<PensionInputs>, PensionInputsValidator>();
            services.AddScoped<IValidator<IndexInputs>, IndexInputsValidator>();
            services.AddScoped<IValidator<AnalyticsData>, AnalyticsDataValidator>();
            services.AddScoped<IValidator<CalculationRequest>, CalculationRequestValidator>();

            // Add all validators from the assembly
            services.AddValidatorsFromAssemblyContaining<CalculationRequestValidator>();

            // HTTP Client (if needed for external services)
            services.AddHttpClient();

            // Memory Cache (if needed for caching)
            services.AddMemoryCache();
        }
    )
    .ConfigureAppConfiguration(
        (context, config) =>
        {
            // Add additional configuration sources if needed
            config.AddJsonFile("local.settings.json", optional: true, reloadOnChange: true);
            config.AddEnvironmentVariables();
        }
    )
    .Build();

// Log startup information
var logger = host.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Pension Calculator API starting up...");

try
{
    // Validate critical services are registered
    var calculationService = host.Services.GetRequiredService<ICalculationService>();
    var storageService = host.Services.GetRequiredService<ITableStorageService>();
    var validator = host.Services.GetRequiredService<IValidator<CalculationRequest>>();

    logger.LogInformation("All required services registered successfully");
    logger.LogInformation("Pension Calculator API ready to handle requests");
}
catch (Exception ex)
{
    logger.LogError(ex, "Failed to validate service registration");
    throw;
}

host.Run();
