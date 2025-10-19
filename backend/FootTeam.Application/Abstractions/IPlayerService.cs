using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface IPlayerService
{
    Task<IReadOnlyList<Player>> ListAsync(string? team = null, CancellationToken ct = default);
    Task<Player?> GetAsync(int id, CancellationToken ct = default);
    Task<Player> CreateAsync(string firstName, string lastName, DateTime? birthDate, string? position, string? team, int? userId, CancellationToken ct = default);
    Task<Player?> UpdateAsync(int id, string? firstName, string? lastName, DateTime? birthDate, string? position, string? team, int? userId, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
