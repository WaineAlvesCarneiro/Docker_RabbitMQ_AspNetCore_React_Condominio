using CondominioSaaSReact.Application.Helpers;
using CondominioSaaSReact.Domain.Entities.Auth;
using CondominioSaaSReact.Domain.Repositories.Auth;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth;

public class AuthLoginQueryHandler(IAuthUserRepository authUserRepository) : IRequestHandler<AuthLoginQuery, AuthUser>
{
    private readonly IAuthUserRepository _authUserRepository = authUserRepository;

    public async Task<AuthUser> Handle(AuthLoginQuery request, CancellationToken cancellationToken)
    {
        var user = await _authUserRepository.GetByUsernameAsync(request.Username, cancellationToken);

        if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash)) return null!;

        return user;
    }
}