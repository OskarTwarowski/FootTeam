using FootTeam.Application.Abstractions;
using FootTeam.Domain.Repositories;
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
            ?? throw new ArgumentNullException("Connection string 'Default' not found in configuration.");
            
        services.AddDbContext<AppDbContext>(options =>
            options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

        
        services.AddScoped<ITeamRepository, EfTeamRepository>();
        services.AddScoped<IPlayerRepository, EfPlayerRepository>();
        services.AddScoped<IUserRepository, EfUserRepository>();
        services.AddScoped<ITrainingRepository, EfTrainingRepository>();
        services.AddScoped<INotificationRepository, EfNotificationRepository>();
        
        return services;
    }
}
