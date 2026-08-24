using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories.Auth;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth.Queries.GetAll;

public class GetAllQueryHandlerAuthUser(IAuthUserRepository repository)
    : IRequestHandler<GetAllQueryAuthUser, Result<IEnumerable<AuthUserDto>>>
{
    public async Task<Result<IEnumerable<AuthUserDto>>> Handle(GetAllQueryAuthUser request, CancellationToken cancellationToken)
    {
        var dados = await repository.GetAllAsync(empresaId: request.IdEmpresa, cancellationToken);

        var dtos = dados.Select(dado => dado.ToDto()).ToList();

        return Result<IEnumerable<AuthUserDto>>.Success(dtos);
    }
}
