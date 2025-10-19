using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface IEventService
{
    Task<IReadOnlyList<Event>> ListAsync(CancellationToken ct = default);
    Task<Event?> GetAsync(int id, CancellationToken ct = default);
    Task<Event> CreateAsync(string? title, string? description, DateTime? eventDate, string? location, int? createdBy, CancellationToken ct = default);
    Task<Event?> UpdateAsync(int id, string? title, string? description, DateTime? eventDate, string? location, int? createdBy, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
