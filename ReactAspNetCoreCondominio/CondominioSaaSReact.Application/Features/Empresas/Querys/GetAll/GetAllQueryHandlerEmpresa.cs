using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Empresas.Queries.GetAll;

public class GetAllQueryHandlerEmpresa(IEmpresaRepository repository)
    : IRequestHandler<GetAllQueryEmpresa, Result<IEnumerable<EmpresaDto>>>
{
    public async Task<Result<IEnumerable<EmpresaDto>>> Handle(GetAllQueryEmpresa request, CancellationToken cancellationToken)
    {
        var dados = await repository.GetAllAsync(
            empresaId: request.IdEmpresa, cancellationToken);

        var dtos = dados.Select(dado => dado.ToDto()).ToList();

        return Result<IEnumerable<EmpresaDto>>.Success(dtos);
    }
}
