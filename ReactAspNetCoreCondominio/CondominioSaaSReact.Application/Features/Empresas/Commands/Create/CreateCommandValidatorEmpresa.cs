using CondominioSaaSReact.Application.Features.Empresas.Commands.ValidatorBase;
using CondominioSaaSReact.Domain.Repositories;

namespace CondominioSaaSReact.Application.Features.Empresas.Commands.Create;

public class CreateCommandValidatorEmpresa : CommandValidatorBaseEmpresa<CreateCommandEmpresa>
{
    public CreateCommandValidatorEmpresa(IEmpresaRepository repository)
    {
        ConfigureCommonRules(repository);
    }
}