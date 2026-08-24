using CondominioSaaSReact.Application.Helpers;
using CondominioSaaSReact.Domain.Entities.Auth;
using CondominioSaaSReact.Domain.Enums;
using CondominioSaaSReact.Infrastructure.Data;

namespace CondominioSaaSReact.Integration.Tests.Data
{
    public static class SeedData
    {
        public static void Initialize(ApplicationDbContext context)
        {
            const string ADMIN_USERNAME = "Admin";
            const string ADMIN_EMAIL = "email@gmail.com";
            const TipoRole ADMIN_ROLE = (TipoRole)1;
            const string ADMIN_PASSWORD = "12345";

            if (!context.AuthUsers.Any(u => u.UserName == ADMIN_USERNAME))
            {
                var admin = new AuthUser
                {
                    UserName = ADMIN_USERNAME,
                    Email = ADMIN_EMAIL,
                    Role = ADMIN_ROLE,
                    PasswordHash = PasswordHasher.HashPassword(ADMIN_PASSWORD)
                };

                context.AuthUsers.Add(admin);
                context.SaveChanges();

                bool ok = PasswordHasher.VerifyPassword(ADMIN_PASSWORD, admin.PasswordHash);
                Console.WriteLine($"Verificação de senha no seed: {ok}");
            }

            Console.WriteLine($"Usuários no banco: {context.AuthUsers.Count()}");
        }
    }
}
