namespace CondominioSaaSReact.Domain.Entities.Auth;

public record AuthLoginRequest(
    string Username,
    string Password
);