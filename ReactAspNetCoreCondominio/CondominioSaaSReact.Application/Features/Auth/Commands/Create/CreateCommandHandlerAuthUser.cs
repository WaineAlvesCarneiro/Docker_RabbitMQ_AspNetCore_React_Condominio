using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Helpers;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Entities.Auth;
using CondominioSaaSReact.Domain.Interfaces;
using CondominioSaaSReact.Domain.Repositories.Auth;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CondominioSaaSReact.Application.Features.Auth.Commands.Create;

public record CreateCommandHandlerAuthUser(
    IAuthUserRepository repository,
    IMensageriaService mensageriaService,
    IEmailTemplateService emailTemplateService,
    ILogger<CreateCommandHandlerAuthUser> logger)
        : IRequestHandler<CreateCommandAuthUser, Result<AuthUserDto>>
{
    public async Task<Result<AuthUserDto>> Handle(CreateCommandAuthUser request, CancellationToken cancellationToken)
    {
        int quantidadeDeCaracteresSenhaAleatoria = 5;
        string senhaTemporaria = PasswordHasher.GerarSenhaAleatoria(quantidadeDeCaracteresSenhaAleatoria);
        AuthUser dado = request.ToEntity(senhaTemporaria);
        await repository.CreateAsync(dado, cancellationToken);

        await EnviarEmailBoasVindasAsync(dado, senhaTemporaria);

        return Result<AuthUserDto>.Success(dado.ToDto(), "Usuário criado com sucesso.");
    }

    private async Task EnviarEmailBoasVindasAsync(AuthUser dado, string senhaTemporaria)
    {
        try
        {
            var corpoEmail = emailTemplateService.GerarBoasVindasUsuario(dado.UserName, senhaTemporaria);
            var emailRequest = new EnvioEmailRequest(
                dado.Email,
                "Bem-vindo ao Sistema",
                corpoEmail,
                dado.EmpresaId.GetValueOrDefault()
            );

            await mensageriaService.PublicarMensagemAsync(emailRequest);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Create AuthUser] Falha ao enfileirar e-mail para {Email}", dado.Email);
        }
    }
}