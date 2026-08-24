using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Moradores.Queries.GetById;

public record GetByIdQueryMorador(long Id) : IRequest<Result<MoradorDto>>;