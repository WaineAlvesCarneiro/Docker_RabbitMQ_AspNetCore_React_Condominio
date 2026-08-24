using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth.Queries.GetAllPaged;

public record GetAllPagedQueryAuthUser(
    int Page = 1,
    int PageSize = 5,
    string? SortBy = "Id",
    string Direction = "ASC",
    long? EmpresaId = null,
    string? UserName = null)
        : IRequest<Result<PagedResult<AuthUserDto>>>
{
    public int ActualPage => Page < 1 ? 1 : Page;
    public int ActualPageSize => PageSize < 1 ? 5 : PageSize;
    public string ActualSortBy => !string.IsNullOrWhiteSpace(SortBy) ? SortBy : "Id";
    public string ActualDirection => Direction;
}