using FootTeam.Domain.Entities;

namespace FootTeam.Domain.Repositories;

public interface IEventRepository
{
    Task<IReadOnlyList<Event>> ListAsync(CancellationToken ct = default);
    Task<Event?> GetAsync(int id, CancellationToken ct = default);
    Task<Event> CreateAsync(Event ev, CancellationToken ct = default);
    Task<Event?> UpdateAsync(Event ev, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
