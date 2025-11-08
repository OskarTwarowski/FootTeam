using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryPlayerRepository : IPlayerRepository
{
    private readonly Dictionary<int, Player> _players = new();
    private readonly ITeamRepository _teamRepository;
    private int _seq = 1;
    private readonly object _lock = new();

    public InMemoryPlayerRepository(ITeamRepository teamRepository)
    {
        _teamRepository = teamRepository;
    }

    public async Task<IReadOnlyList<Player>> ListAsync(int? teamId = null, CancellationToken ct = default)
    {
        IEnumerable<Player> query = _players.Values;
        
        if (teamId.HasValue)
        {
            query = query.Where(p => p.TeamID == teamId.Value);
        }
        
        var result = query
            .OrderBy(p => p.LastName)
            .ThenBy(p => p.FirstName)
            .Select(p => new Player
            {
                PlayerID = p.PlayerID,
                FirstName = p.FirstName,
                LastName = p.LastName,
                BirthDate = p.BirthDate,
                Position = p.Position,
                TeamID = p.TeamID,
                UserID = p.UserID
            })
            .ToList();
        
        foreach (var player in result.Where(p => p.TeamID.HasValue))
        {
            player.Team = await _teamRepository.GetAsync(player.TeamID.Value, ct);
        }
        
        return result;
    }

    public async Task<Player?> GetAsync(int id, CancellationToken ct = default)
    {
        var player = _players.Values.FirstOrDefault(p => p.PlayerID == id);
        if (player == null) return null;

        var result = new Player
        {
            PlayerID = player.PlayerID,
            FirstName = player.FirstName,
            LastName = player.LastName,
            BirthDate = player.BirthDate,
            Position = player.Position,
            TeamID = player.TeamID,
            UserID = player.UserID
        };

        if (result.TeamID.HasValue)
        {
            result.Team = await _teamRepository.GetAsync(result.TeamID.Value, ct);
        }

        return result;
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
