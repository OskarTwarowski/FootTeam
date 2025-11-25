using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Application.Services;

public sealed class NotificationService(INotificationRepository repository) : INotificationService
{
    private readonly INotificationRepository _repository = repository;

    public Task<IReadOnlyList<Notification>> ListAsync(int? teamId = null, CancellationToken ct = default)
        => teamId.HasValue 
            ? _repository.ListAsync(teamId, ct) 
            : _repository.ListAsync(null, ct);

    public Task<Notification?> GetAsync(int id, CancellationToken ct = default)
        => _repository.GetAsync(id, ct);

    public Task<IReadOnlyList<Notification>> GetByCreatorAsync(int userId, CancellationToken ct = default)
        => _repository.GetByCreatorAsync(userId, ct);

    public async Task<Notification> CreateAsync(
        string title, 
        string? description, 
        DateTime? startTime, 
        DateTime? endTime, 
        int createdBy,
        int? teamId, 
        CancellationToken ct = default)
    {
        var notification = new Notification
        {
            Title = title.Trim(),
            Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim(),
            StartTime = startTime,
            EndTime = endTime,
            CreatedBy = createdBy,
            TeamID = teamId
        };
        return await _repository.CreateAsync(notification, ct);
    }

    public async Task<Notification?> UpdateAsync(
        int id, 
        string? title, 
        string? description, 
        DateTime? startTime, 
        DateTime? endTime, 
        int? teamId, 
        CancellationToken ct = default)
    {
        var existing = await _repository.GetAsync(id, ct);
        if (existing is null) return null;
        
        if (title != null) existing.Title = title.Trim();
        if (description != null) existing.Description = description.Trim();
        if (startTime.HasValue) existing.StartTime = startTime;
        if (endTime.HasValue) existing.EndTime = endTime;
        if (teamId.HasValue)
        {
            existing.TeamID = teamId <= 0 ? null : teamId;
        }
        
        return await _repository.UpdateAsync(existing, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        => _repository.DeleteAsync(id, ct);
}
