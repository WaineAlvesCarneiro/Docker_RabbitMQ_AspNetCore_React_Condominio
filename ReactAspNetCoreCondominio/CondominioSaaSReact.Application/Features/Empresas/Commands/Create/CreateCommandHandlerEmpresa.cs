using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Entities;
using CondominioSaaSReact.Domain.Interfaces;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;

namespace CondominioSaaSReact.Application.Features.Empresas.Commands.Create;

public record CreateCommandHandlerEmpresa(
    IEmpresaRepository repository,
    IMensageriaService mensageriaService,
    IEmailTemplateService emailTemplateService,
    ILogger<CreateCommandHandlerEmpresa> logger)
        : IRequestHandler<CreateCommandEmpresa, Result<EmpresaDto>>
{
    public async Task<Result<EmpresaDto>> Handle(CreateCommandEmpresa request, CancellationToken cancellationToken)
    {
        Empresa dado = request.ToEntity();
        await repository.CreateAsync(dado, cancellationToken);

        await EnviarEmailBoasVindasAsync(dado);

        return Result<EmpresaDto>.Success(dado.ToDto(), "Empresa criada com sucesso.");
    }

    private async Task EnviarEmailBoasVindasAsync(Empresa dado)
    {
        try
        {
            var corpoEmail = emailTemplateService.GerarBoasVindasEmpresa(dado.RazaoSocial);
            var emailRequest = new EnvioEmailRequest(
                dado.Email,
                "Bem-vindo ao Sistema",
                corpoEmail,
                dado.Id
            );

            await mensageriaService.PublicarMensagemAsync(emailRequest);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "[Create Empresa] Falha ao enfileirar e-mail para {Email}", dado.Email);
        }
    }
}