using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Empresas.Commands.Delete;

public record DeleteCommandEmpresa(long Id) : IRequest<Result>;