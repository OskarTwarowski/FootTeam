using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using System.Linq;

namespace FootTeam.Application.Services;

public sealed class PlayerService(IPlayerRepository repository, ITeamRepository teamRepository) : IPlayerService
{
    private readonly IPlayerRepository _repository = repository;
    private readonly ITeamRepository _teamRepository = teamRepository;

    public async Task<IReadOnlyList<Player>> ListAsync(int? teamId = null, CancellationToken ct = default)
    {
        if (teamId.HasValue)
        {
            var team = await _teamRepository.GetAsync(teamId.Value, ct);
            if (team == null)
            {
                return new List<Player>().AsReadOnly();
            }
        }
        return await _repository.ListAsync(teamId, ct);
    }

    public Task<Player?> GetAsync(int id, CancellationToken ct = default)
        => _repository.GetAsync(id, ct);

    public async Task<Player> CreateAsync(string firstName, string lastName, DateTime? birthDate, string? position, int? teamId, int? userId, CancellationToken ct = default)
    {
        Team? team = null;
        if (teamId.HasValue)
        {
            team = await _teamRepository.GetAsync(teamId.Value, ct);
        }

        var player = new Player
        {
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            BirthDate = birthDate,
            Position = string.IsNullOrWhiteSpace(position) ? null : position!.Trim(),
            Team = team,
            TeamID = teamId,
            UserID = userId
        };
        return await _repository.CreateAsync(player, ct);
    }

    public async Task<Player?> UpdateAsync(int id, string? firstName, string? lastName, DateTime? birthDate, string? position, int? teamId, CancellationToken ct = default)
    {
        var existing = await _repository.GetAsync(id, ct);
        if (existing is null) return null;
        
        if (!string.IsNullOrWhiteSpace(firstName)) existing.FirstName = firstName.Trim();
        if (!string.IsNullOrWhiteSpace(lastName)) existing.LastName = lastName.Trim();
        if (birthDate.HasValue) existing.BirthDate = birthDate;
        if (!string.IsNullOrWhiteSpace(position)) existing.Position = position.Trim();
        
        if (teamId.HasValue)
        {
            var team = await _teamRepository.GetAsync(teamId.Value, ct);
            if (team != null)
            {
                existing.Team = team;
                existing.TeamID = teamId;
            }
        }
        
        return await _repository.UpdateAsync(existing, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        => _repository.DeleteAsync(id, ct);

    public async Task<Player?> GetByUserIdAsync(int userId, CancellationToken ct = default)
    {
        var players = await _repository.ListAsync(ct: ct);
        return players.FirstOrDefault(p => p.UserID == userId);
    }

    public async Task<Player?> UpdateByUserIdAsync(int userId, string? firstName, string? lastName, DateTime? birthDate, string? position, int? teamId, CancellationToken ct = default)
    {
        var players = await _repository.ListAsync(ct: ct);
        var player = players.FirstOrDefault(p => p.UserID == userId);
        if (player is null) return null;

        if (!string.IsNullOrWhiteSpace(firstName)) player.FirstName = firstName.Trim();
        if (!string.IsNullOrWhiteSpace(lastName)) player.LastName = lastName.Trim();
        if (birthDate.HasValue) player.BirthDate = birthDate;
        if (!string.IsNullOrWhiteSpace(position)) player.Position = position.Trim();
        
        if (teamId.HasValue)
        {
            var team = await _teamRepository.GetAsync(teamId.Value, ct);
            if (team != null)
            {
                player.Team = team;
            }
        }

        return await _repository.UpdateAsync(player, ct);
    }

    public async Task<bool> DeleteByUserIdAsync(int userId, CancellationToken ct = default)
    {
        var players = await _repository.ListAsync(ct: ct);
        var player = players.FirstOrDefault(p => p.UserID == userId);
        if (player is null) return false;

        return await _repository.DeleteAsync(player.PlayerID, ct);
    }
}
