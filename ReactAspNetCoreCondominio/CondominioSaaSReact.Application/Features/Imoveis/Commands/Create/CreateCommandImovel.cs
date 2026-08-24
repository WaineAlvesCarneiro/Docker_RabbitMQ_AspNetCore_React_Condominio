using CondominioSaaSReact.Application.DTOs;
using CondominioSaaSReact.Application.Features.Imoveis.Commands.ValidatorBase;
using CondominioSaaSReact.Domain.Common;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Imoveis.Commands.Create;

public record CreateCommandImovel : IRequest<Result<ImovelDto>>, ICommandBaseImovel
{
    public long Id { get; set; }
    public required string Bloco { get; set; }
    public required string Apartamento { get; set; }
    public required string BoxGaragem { get; set; }
    public long EmpresaId { get; set; }
}