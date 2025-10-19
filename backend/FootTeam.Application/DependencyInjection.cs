using FootTeam.Application.Abstractions;
using FootTeam.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace FootTeam.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IPlayerService, PlayerService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITrainingService, TrainingService>();
        services.AddScoped<IEventService, EventService>();
        return services;
    }
}
