using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth.Commands.DefinirSenha;

public class DefinirSenhaCommand : IRequest<Result<AuthUserDto>>
{
    public string UserName { get; set; } = string.Empty;
    public string NovaSenha { get; set; } = string.Empty;
}
