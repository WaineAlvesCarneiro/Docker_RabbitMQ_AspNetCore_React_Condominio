using CondominioSaaSReact.Domain.Repositories;
using CondominioSaaSReact.Domain.Repositories.Auth;
using CondominioSaaSReact.Infrastructure.Repositories;
using CondominioSaaSReact.Infrastructure.Repositories.Auth;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace CondominioSaaSReact.Configurations.Configs;

public static class RepositoriesConfig
{
    public static IServiceCollection AddRepositories(this IServiceCollection services)
    {
        services.TryAddScoped<IAuthUserRepository, AuthUserRepository>();
        services.TryAddScoped<IEmpresaRepository, EmpresaRepository>();
        services.TryAddScoped<IImovelRepository, ImovelRepository>();
        services.TryAddScoped<IMoradorRepository, MoradorRepository>();

        return services;
    }
}