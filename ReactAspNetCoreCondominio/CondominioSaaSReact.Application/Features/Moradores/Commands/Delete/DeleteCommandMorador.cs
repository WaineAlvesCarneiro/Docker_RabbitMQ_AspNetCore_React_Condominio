using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Moradores.Commands.Delete;

public record DeleteCommandMorador(long Id) : IRequest<Result>;