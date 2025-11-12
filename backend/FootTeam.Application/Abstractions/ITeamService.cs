using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface ITeamService
{
    Task<IEnumerable<Team>> GetTeamsAsync(CancellationToken ct = default);
    Task<Team?> GetTeamByIdAsync(int id, CancellationToken ct = default);
    Task<Team> CreateTeamAsync(Team team, CancellationToken ct = default);
    Task<bool> UpdateTeamAsync(Team team, CancellationToken ct = default);
    Task<bool> DeleteTeamAsync(int id, CancellationToken ct = default);
    Task<IEnumerable<Player>> GetTeamPlayersAsync(int teamId, CancellationToken ct = default);
}
