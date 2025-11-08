using FootTeam.Domain.Entities;

namespace FootTeam.Domain.Repositories;

public interface ITeamRepository
{
    Task<IReadOnlyList<Team>> ListAsync(CancellationToken ct = default);
    Task<Team?> GetAsync(int id, CancellationToken ct = default);
    Task<Team> CreateAsync(Team team, CancellationToken ct = default);
    Task<Team?> UpdateAsync(Team team, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
