using CondominioSaaSReact.Configurations.Converters;
using System.Text.Json;

namespace CondominioSaaSReact.Configurations.Configurations;

public static class JsonExtensions
{
    public static void ConfigureJsonDefaults(this JsonSerializerOptions options)
    {
        options.Converters.Add(new JsonDateOnlyConverter());
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    }
}
