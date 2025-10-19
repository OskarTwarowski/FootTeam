using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryEventRepository : IEventRepository
{
    private readonly Dictionary<int, Event> _events = new();
    private int _seq = 1;
    private readonly object _lock = new();

    public Task<IReadOnlyList<Event>> ListAsync(CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult<IReadOnlyList<Event>>(_events.Values
                .OrderBy(e => e.EventDate)
                .ThenBy(e => e.EventID)
                .ToList());
        }
    }

    public Task<Event?> GetAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _events.TryGetValue(id, out var e);
            return Task.FromResult(e);
        }
    }

    public Task<Event> CreateAsync(Event ev, CancellationToken ct = default)
    {
        lock (_lock)
        {
            ev.EventID = _seq++;
            _events[ev.EventID] = ev;
            return Task.FromResult(ev);
        }
    }

    public Task<Event?> UpdateAsync(Event ev, CancellationToken ct = default)
    {
        lock (_lock)
        {
            if (!_events.ContainsKey(ev.EventID)) return Task.FromResult<Event?>(null);
            var cur = _events[ev.EventID];
            cur.Title = ev.Title;
            cur.Description = ev.Description;
            cur.EventDate = ev.EventDate;
            cur.Location = ev.Location;
            cur.CreatedBy = ev.CreatedBy;
            return Task.FromResult<Event?>(cur);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_events.Remove(id));
        }
    }
}
