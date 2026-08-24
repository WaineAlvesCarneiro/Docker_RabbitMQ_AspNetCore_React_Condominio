using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Imoveis.Queries.GetById;

public record GetByIdQueryHandlerImovel(IImovelRepository repository)
    : IRequestHandler<GetByIdQueryImovel, Result<ImovelDto>>
{
    public async Task<Result<ImovelDto>> Handle(GetByIdQueryImovel request, CancellationToken cancellationToken)
    {
        var dado = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (dado is null) return Result<ImovelDto>.Failure("Imóvel não encontrado.");

        return Result<ImovelDto>.Success(dado.ToDto());
    }
}