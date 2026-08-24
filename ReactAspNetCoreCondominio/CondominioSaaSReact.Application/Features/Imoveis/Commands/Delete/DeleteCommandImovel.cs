using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Imoveis.Commands.Delete;

public record DeleteCommandImovel(long Id) : IRequest<Result>;