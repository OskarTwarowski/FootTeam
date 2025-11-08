using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryTeamRepository : ITeamRepository
{
    private readonly Dictionary<int, Team> _teams = new();
    private int _seq = 1;
    private readonly object _lock = new();

    public Task<IReadOnlyList<Team>> ListAsync(CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult<IReadOnlyList<Team>>(
                _teams.Values
                    .OrderBy(t => t.Name)
                    .ToList()
            );
        }
    }

    public Task<Team?> GetAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _teams.TryGetValue(id, out var team);
            return Task.FromResult(team);
        }
    }

    public Task<Team> CreateAsync(Team team, CancellationToken ct = default)
    {
        lock (_lock)
        {
            team.TeamID = _seq++;
            _teams[team.TeamID] = team;
            return Task.FromResult(team);
        }
    }

    public Task<Team?> UpdateAsync(Team team, CancellationToken ct = default)
    {
        lock (_lock)
        {
            if (!_teams.ContainsKey(team.TeamID)) return Task.FromResult<Team?>(null);
            _teams[team.TeamID] = team;
            return Task.FromResult<Team?>(team);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_teams.Remove(id));
        }
    }
}
