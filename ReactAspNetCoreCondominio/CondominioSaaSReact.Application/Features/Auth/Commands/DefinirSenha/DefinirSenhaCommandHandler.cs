using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Helpers;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories.Auth;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth.Commands.DefinirSenha;

public class DefinirSenhaCommandHandler(IAuthUserRepository repository)
    : IRequestHandler<DefinirSenhaCommand, Result<AuthUserDto>>
{
    public async Task<Result<AuthUserDto>> Handle(DefinirSenhaCommand request, CancellationToken cancellationToken)
    {
        var usuario = await repository.GetByUsernameAsync(request.UserName, cancellationToken);

        if (usuario == null) return Result<AuthUserDto>.Failure("Usuário não encontrado.");

        usuario.PasswordHash = PasswordHasher.HashPassword(request.NovaSenha);
        usuario.PrimeiroAcesso = false;
        usuario.DataAlteracao = DateTime.Now;

        await repository.UpdateAsync(usuario);

        return Result<AuthUserDto>.Success(usuario.ToDto(), "Senha definida com sucesso!");
    }
}