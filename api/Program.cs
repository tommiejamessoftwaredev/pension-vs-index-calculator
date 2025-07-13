using FluentValidation;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using pvi_calculator_api.Models;
using pvi_calculator_api.Services;
using pvi_calculator_api.Services.Interfaces;
using pvi_calculator_api.Validators;

var host = new HostBuilder()
    .ConfigureFunctionsWebApplication()
    .ConfigureServices(services =>
    {
        services.AddApplicationInsightsTelemetryWorkerService();
        services.ConfigureFunctionsApplicationInsights();

        // Your existing services
        services.AddScoped<ICalculationService, CalculationService>();
        services.AddScoped<ITableStorageService, TableStorageService>();

        // FluentValidation
        services.AddScoped<IValidator<PensionInputs>, PensionInputsValidator>();
        services.AddScoped<IValidator<IndexInputs>, IndexInputsValidator>();
        services.AddScoped<IValidator<AnalyticsData>, AnalyticsDataValidator>();
        services.AddScoped<IValidator<CalculationRequest>, CalculationRequestValidator>();
        services.AddValidatorsFromAssemblyContaining<CalculationRequestValidator>();

        services.AddHttpClient();
        services.AddMemoryCache();
    })
    .Build();

host.Run();
