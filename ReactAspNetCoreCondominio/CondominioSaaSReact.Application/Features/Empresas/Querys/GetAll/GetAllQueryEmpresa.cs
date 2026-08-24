using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Empresas.Queries.GetAll;

public record GetAllQueryEmpresa(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<EmpresaDto>>>
{
    public long? IdEmpresa => EmpresaId;
}