using CondominioSaaSReact.Configurations.Configs;
using CondominioSaaSReact.Configurations.Configurations;
using CondominioSaaSReact.Infrastructure.Messaging;

var builder = Host.CreateDefaultBuilder(args)
    .AddAppLogging()
    .ConfigureAppConfiguration((hostingContext, config) =>
    {
        config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
              .AddJsonFile($"appsettings.{hostingContext.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: true)
              .AddEnvironmentVariables();
    })
    .ConfigureServices((context, services) =>
    {
        services.AddDatabase(context.Configuration);
        services.AddMemoryCache();
        services.AddMediatRAndValidators();
        services.AddRepositories();
        services.AddRabbitMQEmailTokenServices(context.Configuration);
        services.AddHostedService<EmailConsumerWorker>();
    })
    .UseConsoleLifetime();

await builder.RunConsoleAsync();
