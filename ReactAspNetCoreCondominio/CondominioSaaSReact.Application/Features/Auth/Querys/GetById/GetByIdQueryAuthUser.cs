using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth.Queries.GetById;

public record GetByIdQueryAuthUser(Guid Id) : IRequest<Result<AuthUserDto>>;