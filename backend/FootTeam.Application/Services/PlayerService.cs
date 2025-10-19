using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Application.Services;

public sealed class PlayerService(IPlayerRepository repository) : IPlayerService
{
    private readonly IPlayerRepository _repository = repository;

    public Task<IReadOnlyList<Player>> ListAsync(string? team = null, CancellationToken ct = default)
        => _repository.ListAsync(team, ct);

    public Task<Player?> GetAsync(int id, CancellationToken ct = default)
        => _repository.GetAsync(id, ct);

    public async Task<Player> CreateAsync(string firstName, string lastName, DateTime? birthDate, string? position, string? team, int? userId, CancellationToken ct = default)
    {
        var player = new Player
        {
            FirstName = firstName.Trim(),
            LastName = lastName.Trim(),
            BirthDate = birthDate,
            Position = string.IsNullOrWhiteSpace(position) ? null : position!.Trim(),
            Team = string.IsNullOrWhiteSpace(team) ? null : team!.Trim(),
            UserID = userId
        };
        return await _repository.CreateAsync(player, ct);
    }

    public async Task<Player?> UpdateAsync(int id, string? firstName, string? lastName, DateTime? birthDate, string? position, string? team, int? userId, CancellationToken ct = default)
    {
        var existing = await _repository.GetAsync(id, ct);
        if (existing is null) return null;
        if (!string.IsNullOrWhiteSpace(firstName)) existing.FirstName = firstName.Trim();
        if (!string.IsNullOrWhiteSpace(lastName)) existing.LastName = lastName.Trim();
        existing.BirthDate = birthDate ?? existing.BirthDate;
        existing.Position = string.IsNullOrWhiteSpace(position) ? existing.Position : position!.Trim();
        existing.Team = string.IsNullOrWhiteSpace(team) ? existing.Team : team!.Trim();
        existing.UserID = userId ?? existing.UserID;
        return await _repository.UpdateAsync(existing, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        => _repository.DeleteAsync(id, ct);
}
