using CondominioSaaSReact.Application.Features.Imoveis.Commands.ValidatorBase;

namespace CondominioSaaSReact.Application.Features.Imoveis.Commands.Create;

public class CreateCommandValidatorImovel : CommandValidatorBaseImovel<CreateCommandImovel>
{
    public CreateCommandValidatorImovel()
    {
        ConfigureCommonRules();
    }
}