using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Repositories;

public sealed class EfEventRepository(AppDbContext db) : IEventRepository
{
    private readonly AppDbContext _db = db;

    public Task<IReadOnlyList<Event>> ListAsync(CancellationToken ct = default)
        => _db.Events.AsNoTracking().OrderBy(e => e.EventDate).ToListAsync(ct).ContinueWith(t => (IReadOnlyList<Event>)t.Result, ct);

    public Task<Event?> GetAsync(int id, CancellationToken ct = default)
        => _db.Events.AsNoTracking().FirstOrDefaultAsync(e => e.EventID == id, ct);

    public async Task<Event> CreateAsync(Event ev, CancellationToken ct = default)
    {
        _db.Events.Add(ev);
        await _db.SaveChangesAsync(ct);
        return ev;
    }

    public async Task<Event?> UpdateAsync(Event ev, CancellationToken ct = default)
    {
        var existing = await _db.Events.FirstOrDefaultAsync(e => e.EventID == ev.EventID, ct);
        if (existing is null) return null;
        existing.Title = ev.Title;
        existing.Description = ev.Description;
        existing.EventDate = ev.EventDate;
        existing.Location = ev.Location;
        existing.CreatedBy = ev.CreatedBy;
        await _db.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _db.Events.FirstOrDefaultAsync(e => e.EventID == id, ct);
        if (existing is null) return false;
        _db.Events.Remove(existing);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
