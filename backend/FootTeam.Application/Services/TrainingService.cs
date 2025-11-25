using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Application.Services;

public sealed class TrainingService(ITrainingRepository trainings) : ITrainingService
{
    private readonly ITrainingRepository _trainings = trainings;

    public Task<IReadOnlyList<Training>> ListAsync(CancellationToken ct = default)
        => _trainings.ListAsync(ct);

    public Task<Training?> GetAsync(int id, CancellationToken ct = default)
        => _trainings.GetAsync(id, ct);

    public async Task<Training> CreateAsync(string? title, string? description, string? location, DateTime? startTime, DateTime? endTime, int? coachId, int? teamId, CancellationToken ct = default)
    {
        var t = new Training
        {
            Title = string.IsNullOrWhiteSpace(title) ? null : title.Trim(),
            Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim(),
            Location = string.IsNullOrWhiteSpace(location) ? null : location.Trim(),
            StartTime = startTime,
            EndTime = endTime,
            CoachID = coachId,
            TeamID = teamId
        };
        return await _trainings.CreateAsync(t, ct);
    }

    public async Task<Training?> UpdateAsync(int id, string? title, string? description, string? location, DateTime? startTime, DateTime? endTime, int? coachId, int? teamId, CancellationToken ct = default)
    {
        var existing = await _trainings.GetAsync(id, ct);
        if (existing is null) return null;
        existing.Title = string.IsNullOrWhiteSpace(title) ? existing.Title : title!.Trim();
        existing.Description = string.IsNullOrWhiteSpace(description) ? existing.Description : description!.Trim();
        existing.Location = string.IsNullOrWhiteSpace(location) ? existing.Location : location!.Trim();
        existing.StartTime = startTime ?? existing.StartTime;
        existing.EndTime = endTime ?? existing.EndTime;
        existing.CoachID = coachId ?? existing.CoachID;
        if (teamId.HasValue)
        {
            existing.TeamID = teamId;
        }
        return await _trainings.UpdateAsync(existing, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        => _trainings.DeleteAsync(id, ct);

}
