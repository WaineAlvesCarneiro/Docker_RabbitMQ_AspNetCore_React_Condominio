using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Moradores.Queries.GetAll;

public class GetAllQueryHandlerMorador(IMoradorRepository repository)
    : IRequestHandler<GetAllQueryMorador, Result<IEnumerable<MoradorDto>>>
{
    public async Task<Result<IEnumerable<MoradorDto>>> Handle(GetAllQueryMorador request, CancellationToken cancellationToken)
    {
        var dados = await repository.GetAllAsync(empresaId: request.IdEmpresa, cancellationToken);

        var dtos = dados.Select(dado => dado.ToDto()).ToList();

        return Result<IEnumerable<MoradorDto>>.Success(dtos);
    }
}