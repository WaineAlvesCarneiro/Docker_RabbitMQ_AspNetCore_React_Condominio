using CondominioSaaSReact.Application.Features.Auth.Commands.ValidatorBase;

namespace CondominioSaaSReact.Application.Features.Auth.Commands.Update;

public class UpdateCommandValidatorAuthUser : CommandValidatorBaseAuthUser<UpdateCommandAuthUser>
{
    public UpdateCommandValidatorAuthUser()
    {
        ConfigureCommonRules();
    }
}