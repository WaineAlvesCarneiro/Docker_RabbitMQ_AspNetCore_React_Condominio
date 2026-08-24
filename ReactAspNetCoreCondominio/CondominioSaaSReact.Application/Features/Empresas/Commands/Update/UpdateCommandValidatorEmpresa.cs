using CondominioSaaSReact.Application.Features.Empresas.Commands.ValidatorBase;
using CondominioSaaSReact.Domain.Repositories;

namespace CondominioSaaSReact.Application.Features.Empresas.Commands.Update;

public class UpdateCommandValidatorEmpresa : CommandValidatorBaseEmpresa<UpdateCommandEmpresa>
{
    public UpdateCommandValidatorEmpresa(IEmpresaRepository repository)
    {
        ConfigureCommonRules(repository);
    }
}