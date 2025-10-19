using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Application.Services;

public sealed class TrainingService(ITrainingRepository trainings, ITrainingParticipantRepository participants) : ITrainingService
{
    private readonly ITrainingRepository _trainings = trainings;
    private readonly ITrainingParticipantRepository _participants = participants;

    public Task<IReadOnlyList<Training>> ListAsync(CancellationToken ct = default)
        => _trainings.ListAsync(ct);

    public Task<Training?> GetAsync(int id, CancellationToken ct = default)
        => _trainings.GetAsync(id, ct);

    public async Task<Training> CreateAsync(string? title, string? description, string? location, DateTime? startTime, DateTime? endTime, int? coachId, CancellationToken ct = default)
    {
        var t = new Training
        {
            Title = string.IsNullOrWhiteSpace(title) ? null : title.Trim(),
            Description = string.IsNullOrWhiteSpace(description) ? null : description.Trim(),
            Location = string.IsNullOrWhiteSpace(location) ? null : location.Trim(),
            StartTime = startTime,
            EndTime = endTime,
            CoachID = coachId
        };
        return await _trainings.CreateAsync(t, ct);
    }

    public async Task<Training?> UpdateAsync(int id, string? title, string? description, string? location, DateTime? startTime, DateTime? endTime, int? coachId, CancellationToken ct = default)
    {
        var existing = await _trainings.GetAsync(id, ct);
        if (existing is null) return null;
        existing.Title = string.IsNullOrWhiteSpace(title) ? existing.Title : title!.Trim();
        existing.Description = string.IsNullOrWhiteSpace(description) ? existing.Description : description!.Trim();
        existing.Location = string.IsNullOrWhiteSpace(location) ? existing.Location : location!.Trim();
        existing.StartTime = startTime ?? existing.StartTime;
        existing.EndTime = endTime ?? existing.EndTime;
        existing.CoachID = coachId ?? existing.CoachID;
        return await _trainings.UpdateAsync(existing, ct);
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        => _trainings.DeleteAsync(id, ct);

    public Task<IReadOnlyList<TrainingParticipant>> ListParticipantsAsync(int trainingId, CancellationToken ct = default)
        => _participants.ListByTrainingAsync(trainingId, ct);

    public Task<bool> AddParticipantAsync(int trainingId, int playerId, CancellationToken ct = default)
        => _participants.AddAsync(trainingId, playerId, ct);

    public Task<bool> RemoveParticipantAsync(int trainingId, int playerId, CancellationToken ct = default)
        => _participants.RemoveAsync(trainingId, playerId, ct);
}
