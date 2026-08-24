using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Mappings;
using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Empresas.Queries.GetById;

public class GetByIdQueryHandlerEmpresa(IEmpresaRepository repository)
    : IRequestHandler<GetByIdQueryEmpresa, Result<EmpresaDto>>
{
    public async Task<Result<EmpresaDto>> Handle(GetByIdQueryEmpresa request, CancellationToken cancellationToken)
    {
        var dado = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (dado is null) return Result<EmpresaDto>.Failure("Empresa não encontrada.");

        return Result<EmpresaDto>.Success(dado.ToDto());
    }
}