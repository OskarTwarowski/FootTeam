using FootTeam.Domain.Entities;

namespace FootTeam.Domain.Repositories;

public interface IPlayerRepository
{
    Task<IReadOnlyList<Player>> ListAsync(string? team = null, CancellationToken ct = default);
    Task<Player?> GetAsync(int id, CancellationToken ct = default);
    Task<Player> CreateAsync(Player player, CancellationToken ct = default);
    Task<Player?> UpdateAsync(Player player, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
