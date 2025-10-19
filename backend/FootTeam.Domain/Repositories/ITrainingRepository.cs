using FootTeam.Domain.Entities;

namespace FootTeam.Domain.Repositories;

public interface ITrainingRepository
{
    Task<IReadOnlyList<Training>> ListAsync(CancellationToken ct = default);
    Task<Training?> GetAsync(int id, CancellationToken ct = default);
    Task<Training> CreateAsync(Training training, CancellationToken ct = default);
    Task<Training?> UpdateAsync(Training training, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
