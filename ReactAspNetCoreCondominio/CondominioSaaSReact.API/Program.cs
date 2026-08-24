using CondominioSaaSReact.API.Endpoints;
using CondominioSaaSReact.Configurations.Configs;
using CondominioSaaSReact.Configurations.Configurations;

var builder = WebApplication.CreateBuilder(args);

builder.Host.AddAppLogging();
builder.Services.AddDatabase(builder.Configuration);
builder.Services.AddMemoryCache();
builder.Services.AddMediatRAndValidators();
builder.Services.AddRepositories();
builder.Services.AddRabbitMQEmailTokenServices(builder.Configuration);
builder.Services.AddAppCorsPolicy(builder.Configuration);
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddAppAuthorizationPolicies();
builder.Services.AddHealthChecks();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ConfigureJsonDefaults();
    });
builder.Services.AddSwaggerAndSecurity();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok("healthy"));

await app.ApplyMigrationsWithRetryAsync();

app.Use(async (context, next) =>
{
    if (context.Request.Path == "/")
    {
        context.Response.Redirect("/swagger");
        return;
    }
    await next();
});

app.UseAppMiddleware(app.Environment);
app.MapControllers();
app.MapEnumsEndpoints();

app.Run("http://0.0.0.0:8081");

public partial class Program { }
