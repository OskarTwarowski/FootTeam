using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryPlayerRepository : IPlayerRepository
{
    private readonly Dictionary<int, Player> _players = new();
    private int _seq = 1;
    private readonly object _lock = new();

    public Task<IReadOnlyList<Player>> ListAsync(string? team = null, CancellationToken ct = default)
    {
        lock (_lock)
        {
            IEnumerable<Player> q = _players.Values;
            if (!string.IsNullOrWhiteSpace(team))
            {
                var t = team.Trim();
                q = q.Where(p => string.Equals(p.Team, t, StringComparison.OrdinalIgnoreCase));
            }
            return Task.FromResult<IReadOnlyList<Player>>(q.OrderBy(p => p.LastName).ThenBy(p => p.FirstName).ToList());
        }
    }

    public Task<Player?> GetAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _players.TryGetValue(id, out var p);
            return Task.FromResult(p);
        }
    }

    public Task<Player> CreateAsync(Player player, CancellationToken ct = default)
    {
        lock (_lock)
        {
            player.PlayerID = _seq++;
            _players[player.PlayerID] = player;
            return Task.FromResult(player);
        }
    }

    public Task<Player?> UpdateAsync(Player player, CancellationToken ct = default)
    {
        lock (_lock)
        {
            if (!_players.ContainsKey(player.PlayerID)) return Task.FromResult<Player?>(null);
            var cur = _players[player.PlayerID];
            cur.FirstName = player.FirstName;
            cur.LastName = player.LastName;
            cur.BirthDate = player.BirthDate;
            cur.Position = player.Position;
            cur.Team = player.Team;
            cur.UserID = player.UserID;
            return Task.FromResult<Player?>(cur);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_players.Remove(id));
        }
    }
}
