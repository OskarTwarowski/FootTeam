using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface IPlayerService
{
    Task<IReadOnlyList<Player>> ListAsync(int? teamId = null, CancellationToken ct = default);
    Task<Player?> GetAsync(int id, CancellationToken ct = default);
    Task<Player?> GetByUserIdAsync(int userId, CancellationToken ct = default);
    Task<Player> CreateAsync(string firstName, string lastName, int? teamId, int? userId, CancellationToken ct = default);
    Task<Player?> UpdateAsync(int id, string? firstName, string? lastName, int? teamId, CancellationToken ct = default);
    Task<Player?> UpdateByUserIdAsync(int userId, string? firstName, string? lastName, int? teamId, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<bool> DeleteByUserIdAsync(int userId, CancellationToken ct = default);
}
