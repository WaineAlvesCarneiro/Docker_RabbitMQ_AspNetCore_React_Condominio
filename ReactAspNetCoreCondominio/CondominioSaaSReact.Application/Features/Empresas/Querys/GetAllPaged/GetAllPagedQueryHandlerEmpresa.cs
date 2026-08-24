using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Entities;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Empresas.Queries.GetAllPaged;

public class GetAllPagedQueryHandlerEmpresa(IEmpresaRepository repository)
    : IRequestHandler<GetAllPagedQueryEmpresa, Result<PagedResult<EmpresaDto>>>
{
    private readonly IEmpresaRepository _repository = repository;

    public async Task<Result<PagedResult<EmpresaDto>>> Handle(GetAllPagedQueryEmpresa request, CancellationToken cancellationToken)
    {
        (IEnumerable<Empresa> items, int totalCount) = await _repository.GetAllPagedAsync(
            page: request.ActualPage,
            pageSize: request.ActualPageSize,
            orderBy: request.ActualSortBy,
            direction: request.ActualDirection,
            razaoSocial: request.RazaoSocial,
            cnpj: request.Cnpj,
            cancellationToken: cancellationToken
        );

        var dtos = items.Select(dado => dado.ToDto()).ToList();

        PagedResult<EmpresaDto> pagedResult = new PagedResult<EmpresaDto>
        {
            Items = dtos,
            TotalCount = totalCount,
            PageIndex = request.ActualPage,
            LinesPerPage = request.ActualPageSize
        };

        return Result<PagedResult<EmpresaDto>>.Success(pagedResult);
    }
}
