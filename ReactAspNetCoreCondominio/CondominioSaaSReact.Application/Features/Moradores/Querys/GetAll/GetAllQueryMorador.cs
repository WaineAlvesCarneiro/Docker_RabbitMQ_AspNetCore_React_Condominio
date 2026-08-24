using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Moradores.Queries.GetAll;

public record GetAllQueryMorador(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<MoradorDto>>>
{
    public long? IdEmpresa => EmpresaId;
}