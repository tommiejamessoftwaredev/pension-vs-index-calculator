
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using pvi_calculator_api.Services;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddScoped<CalculationService>();
        services.AddScoped<TableStorageService>(provider =>
        {
            var connectionString = Environment.GetEnvironmentVariable("AzureWebJobsStorage");
            return new TableStorageService(connectionString);
        });
    })
    .Build();

host.Run();