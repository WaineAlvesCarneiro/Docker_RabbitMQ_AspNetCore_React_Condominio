using CondominioSaaSReact.Application.Features.Moradores.Commands.ValidatorBase;

namespace CondominioSaaSReact.Application.Features.Moradores.Commands.Create;

public class CreateCommandValidatorMorador : CommandValidatorBaseMorador<CreateCommandMorador>
{
    public CreateCommandValidatorMorador()
    {
        ConfigureCommonRules();
    }
}