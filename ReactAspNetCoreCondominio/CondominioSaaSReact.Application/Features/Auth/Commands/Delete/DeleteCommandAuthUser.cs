using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Auth.Commands.Delete;

public record DeleteCommandAuthUser(Guid Id) : IRequest<Result>;