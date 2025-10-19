using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Application.Services;

public sealed class EventService(IEventRepository repository) : IEventService
{
    private readonly IEventRepository _repository = repository;

    public Task<IReadOnlyList<Event>> ListAsync(CancellationToken ct = default)
        => _repository.ListAsync(ct);

    public Task<Event?> GetAsync(int id, CancellationToken ct = default)
        => _repository.GetAsync(id, ct);

    public async Task<Event> CreateAsync(string? title, string? description, DateTime? eventDate, string? location, int? createdBy, CancellationToken ct = default)
    {
        var ev = new Event
        {
            Title = string.IsNullOrWhiteSpace(title) ? null : title.Trim(),
            Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim(),
            EventDate = eventDate,
            Location = string.IsNullOrWhiteSpace(location) ? null : location.Trim(),
            CreatedBy = createdBy
        };
        return await _repository.CreateAsync(ev, ct);
    }

    public async Task<Event?> UpdateAsync(int id, string? title, string? description, DateTime? eventDate, string? location, int? createdBy, CancellationToken ct = default)
    {
        var existing = await _repository.GetAsync(id, ct);
        if (existing is null) return null;
        existing.Title = string.IsNullOrWhiteSpace(title) ? existing.Title : title!.Trim();
        existing.Description = string.IsNullOrWhiteSpace(description) ? existing.Description : description!.Trim();
        existing.EventDate = eventDate ?? existing.EventDate;
        existing.Location = string.IsNullOrWhiteSpace(location) ? existing.Location : location!.Trim();
        existing.CreatedBy = createdBy ?? existing.CreatedBy;
        return await _repository.UpdateAsync(existing, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        => _repository.DeleteAsync(id, ct);
}
