using CondominioSaaSReact.Application.Features.Imoveis.Commands.ValidatorBase;

namespace CondominioSaaSReact.Application.Features.Imoveis.Commands.Update;

public class UpdateCommandValidatorImovel : CommandValidatorBaseImovel<UpdateCommandImovel>
{
    public UpdateCommandValidatorImovel()
    {
        ConfigureCommonRules();
    }
}