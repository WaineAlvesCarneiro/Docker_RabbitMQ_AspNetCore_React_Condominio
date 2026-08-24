using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Imoveis.Queries.GetAll;

public record GetAllQueryHandlerImovel(IImovelRepository repository)
    : IRequestHandler<GetAllQueryImovel, Result<IEnumerable<ImovelDto>>>
{
    public async Task<Result<IEnumerable<ImovelDto>>> Handle(GetAllQueryImovel request, CancellationToken cancellationToken)
    {
        var dados = await repository.GetAllAsync(empresaId: request.IdEmpresa, cancellationToken);

        var dtos = dados.Select(dado => dado.ToDto()).ToList();

        return Result<IEnumerable<ImovelDto>>.Success(dtos);
    }
}
