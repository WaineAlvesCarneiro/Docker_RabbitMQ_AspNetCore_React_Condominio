using CondominioSaaSReact.Application.Helpers;
using CondominioSaaSReact.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CondominioSaaSReact.API.Controllers.ApiBase;

[ApiController]
[Route("[controller]")]
[Authorize(Policy = "AdminPolicy")]
public abstract class ApiBaseController : ControllerBase
{
    protected bool IsUserAtivo => User.GetUserStatus() == TipoUserAtivo.Ativo && User.GetEmpresaStatus() == TipoEmpresaAtivo.Ativo;
    protected long UserEmpresaId => User.GetEmpresaId();
    protected string UserName => User.Identity?.Name ?? string.Empty;
    protected TipoRole? UserRole => User.GetUserRole();

    protected bool IsSuporte => User.IsSuporte();
    protected bool IsSindico => User.IsSindico();
    protected bool IsPorteiro => User.IsPorteiro();
}