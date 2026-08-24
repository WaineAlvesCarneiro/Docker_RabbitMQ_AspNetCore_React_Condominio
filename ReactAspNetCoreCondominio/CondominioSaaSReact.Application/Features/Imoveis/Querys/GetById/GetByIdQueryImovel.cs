using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Imoveis.Queries.GetById;

public record GetByIdQueryImovel(long Id) : IRequest<Result<ImovelDto>>;