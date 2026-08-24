using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Empresas.Queries.GetById;

public record GetByIdQueryEmpresa(long Id) : IRequest<Result<EmpresaDto>>;