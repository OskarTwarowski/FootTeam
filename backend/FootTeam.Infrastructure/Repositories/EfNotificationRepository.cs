using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Repositories;

public sealed class EfNotificationRepository(AppDbContext db) : INotificationRepository
{
    private readonly AppDbContext _db = db;

    public Task<IReadOnlyList<Notification>> ListAsync(int? teamId = null, CancellationToken ct = default)
    {
        var query = _db.Notifications.AsNoTracking();
        
        if (teamId.HasValue)
        {
            query = query.Where(n => n.TeamID == teamId || n.TeamID == null);
        }
        
        return query
            .Include(n => n.Creator)
            .Include(n => n.Team)
            .OrderBy(n => n.StartTime)
            .ToListAsync(ct)
            .ContinueWith(t => (IReadOnlyList<Notification>)t.Result, ct);
    }

    public async Task<Notification?> GetAsync(int id, CancellationToken ct = default)
        => await _db.Notifications
            .AsNoTracking()
            .Include(n => n.Creator)
            .Include(n => n.Team)
            .FirstOrDefaultAsync(x => x.NotificationID == id, ct);

    public async Task<IReadOnlyList<Notification>> GetByCreatorAsync(int userId, CancellationToken ct = default)
        => await _db.Notifications
            .AsNoTracking()
            .Include(n => n.Creator)
            .Include(n => n.Team)
            .Where(n => n.CreatedBy == userId)
            .OrderBy(n => n.StartTime)
            .ToListAsync(ct);

    public async Task<Notification> CreateAsync(Notification notification, CancellationToken ct = default)
    {
        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync(ct);
        return notification;
    }

    public async Task<Notification?> UpdateAsync(Notification notification, CancellationToken ct = default)
    {
        var existing = await _db.Notifications.FindAsync(notification.NotificationID, ct);
        if (existing is null) return null;

        _db.Entry(existing).CurrentValues.SetValues(notification);
        await _db.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var rowsAffected = await _db.Notifications
            .Where(n => n.NotificationID == id)
            .ExecuteDeleteAsync(ct);
        
        return rowsAffected > 0;
    }
}
