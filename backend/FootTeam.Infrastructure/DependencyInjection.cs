using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.InMemory;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using FootTeam.Infrastructure.Repositories;

namespace FootTeam.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Default")
            ?? "Server=localhost;Port=3306;Database=SportClubDB;User=root;Password=yourpassword;";
        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        services.AddSingleton<IPlayerRepository, InMemoryPlayerRepository>();
        services.AddSingleton<IUserRepository, InMemoryUserRepository>();
        services.AddSingleton<ITrainingRepository, InMemoryTrainingRepository>();
        services.AddSingleton<ITrainingParticipantRepository, InMemoryTrainingParticipantRepository>();
        services.AddSingleton<IEventRepository, InMemoryEventRepository>();
        return services;
    }
}
