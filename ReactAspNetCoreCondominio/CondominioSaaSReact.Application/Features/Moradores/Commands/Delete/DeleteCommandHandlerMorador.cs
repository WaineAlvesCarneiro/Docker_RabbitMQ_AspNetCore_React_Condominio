using CondominioSaaSReact.Domain.Common;
using CondominioSaaSReact.Domain.Repositories;
using MediatR;

namespace CondominioSaaSReact.Application.Features.Moradores.Commands.Delete;

public class DeleteCommandHandlerMorador(IMoradorRepository repository)
    : IRequestHandler<DeleteCommandMorador, Result>
{
    public async Task<Result> Handle(DeleteCommandMorador request, CancellationToken cancellationToken)
    {
        var dado = await repository.GetByIdAsync(request.Id, cancellationToken);
        if (dado is null) return Result.Failure("Morador não encontrado.");

        await repository.DeleteAsync(dado, cancellationToken);
        return Result.Success("Morador deletado com sucesso.");
    }
}