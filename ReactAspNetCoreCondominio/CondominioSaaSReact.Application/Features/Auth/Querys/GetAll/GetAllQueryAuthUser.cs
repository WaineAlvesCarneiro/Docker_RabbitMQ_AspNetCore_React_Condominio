using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth.Queries.GetAll;

public record GetAllQueryAuthUser(
    long? EmpresaId = null)
        : IRequest<Result<IEnumerable<AuthUserDto>>>
{
    public long? IdEmpresa => EmpresaId;
}