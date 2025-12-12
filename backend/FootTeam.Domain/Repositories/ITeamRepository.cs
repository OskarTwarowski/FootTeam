using FootTeam.Domain.Entities;
using System.Linq.Expressions;

namespace FootTeam.Domain.Repositories;

public interface ITeamRepository
{
    Task<IReadOnlyList<Team>> ListAsync(CancellationToken ct = default);
    Task<Team?> GetAsync(int id, CancellationToken ct = default);
    Task<Team?> GetWithDetailsAsync(int id, params Expression<Func<Team, object>>[] includes);
    Task<Team> CreateAsync(Team team, CancellationToken ct = default);
    Task<Team?> UpdateAsync(Team team, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Player>> GetPlayersByTeamIdAsync(int teamId, CancellationToken ct = default);
    Task<bool> TeamCodeExistsAsync(string teamCode, CancellationToken ct = default);
}
