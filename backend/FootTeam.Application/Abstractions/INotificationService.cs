using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface INotificationService
{
    Task<Notification?> GetAsync(int id, CancellationToken ct = default);
    Task<IReadOnlyList<Notification>> ListAsync(int? teamId = null, CancellationToken ct = default);
    Task<IReadOnlyList<Notification>> GetByCreatorAsync(int userId, CancellationToken ct = default);
    
    Task<Notification> CreateAsync(
        string title, 
        string? description, 
        DateTime? startTime, 
        DateTime? endTime, 
        int createdBy,
        int? teamId, 
        CancellationToken ct = default);
        
    Task<Notification?> UpdateAsync(
        int id, 
        string? title, 
        string? description, 
        DateTime? startTime, 
        DateTime? endTime, 
        int? teamId, 
        CancellationToken ct = default);
        
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
