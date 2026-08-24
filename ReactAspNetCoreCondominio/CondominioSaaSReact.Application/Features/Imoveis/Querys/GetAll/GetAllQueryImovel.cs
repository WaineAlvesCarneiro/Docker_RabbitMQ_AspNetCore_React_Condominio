using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Imoveis.Queries.GetAll;

public record GetAllQueryImovel(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<ImovelDto>>>
{
    public long? IdEmpresa => EmpresaId;
}