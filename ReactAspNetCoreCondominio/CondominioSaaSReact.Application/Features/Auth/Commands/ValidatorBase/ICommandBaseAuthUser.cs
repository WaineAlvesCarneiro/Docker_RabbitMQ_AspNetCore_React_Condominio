using CondominioSaaSReact.Domain.Enums;

namespace CondominioSaaSReact.Application.Features.Auth.Commands.ValidatorBase;

public interface ICommandBaseAuthUser
{
    long? EmpresaId { get; set; }
    string UserName { get; set; }
    DateTime DataInclusao { get; set; }
    DateTime? DataAlteracao { get; set; }
}