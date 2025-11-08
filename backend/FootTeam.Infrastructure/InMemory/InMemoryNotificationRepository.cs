using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryNotificationRepository : INotificationRepository
{
    private readonly Dictionary<int, Notification> _notifications = new();
    private int _seq = 1;
    private readonly object _lock = new();

    public Task<IReadOnlyList<Notification>> ListAsync(int? teamId = null, CancellationToken ct = default)
    {
        lock (_lock)
        {
            var query = _notifications.Values.AsQueryable();
            
            if (teamId.HasValue)
            {
                query = query.Where(n => n.TeamID == teamId);
            }
            
            return Task.FromResult<IReadOnlyList<Notification>>(query
                .OrderBy(n => n.StartTime)
                .ThenBy(n => n.NotificationID)
                .ToList());
        }
    }

    public Task<Notification?> GetAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _notifications.TryGetValue(id, out var notification);
            return Task.FromResult(notification);
        }
    }

    public Task<IReadOnlyList<Notification>> GetByCreatorAsync(int userId, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult<IReadOnlyList<Notification>>(_notifications.Values
                .Where(n => n.CreatedBy == userId)
                .OrderBy(n => n.StartTime)
                .ThenBy(n => n.NotificationID)
                .ToList());
        }
    }

    public Task<Notification> CreateAsync(Notification notification, CancellationToken ct = default)
    {
        lock (_lock)
        {
            notification.NotificationID = _seq++;
            _notifications[notification.NotificationID] = notification;
            return Task.FromResult(notification);
        }
    }

    public Task<Notification?> UpdateAsync(Notification notification, CancellationToken ct = default)
    {
        lock (_lock)
        {
            if (!_notifications.ContainsKey(notification.NotificationID))
            {
                return Task.FromResult<Notification?>(null);
            }
            _notifications[notification.NotificationID] = notification;
            return Task.FromResult<Notification?>(notification);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_notifications.Remove(id));
        }
    }
}
