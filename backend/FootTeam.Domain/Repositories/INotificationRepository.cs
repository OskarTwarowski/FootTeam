using FootTeam.Domain.Entities;

namespace FootTeam.Domain.Repositories;

public interface INotificationRepository
{
    Task<IReadOnlyList<Notification>> ListAsync(int? teamId = null, CancellationToken ct = default);
    Task<IReadOnlyList<Notification>> GetByCreatorAsync(int userId, CancellationToken ct = default);
    Task<Notification?> GetAsync(int id, CancellationToken ct = default);
    Task<Notification> CreateAsync(Notification notification, CancellationToken ct = default);
    Task<Notification?> UpdateAsync(Notification notification, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
