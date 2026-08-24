using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Entities;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Imoveis.Commands.Create;

public class CreateCommandHandlerImovel(
    IImovelRepository repository)
        : IRequestHandler<CreateCommandImovel, Result<ImovelDto>>
{
    public async Task<Result<ImovelDto>> Handle(CreateCommandImovel request, CancellationToken cancellationToken)
    {
        Imovel dado = request.ToEntity();
        await repository.CreateAsync(dado, cancellationToken);

        return Result<ImovelDto>.Success(dado.ToDto(), "Imóvel criado com sucesso.");
    }
}