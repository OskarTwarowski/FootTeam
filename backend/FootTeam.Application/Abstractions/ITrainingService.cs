using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface ITrainingService
{
    Task<IReadOnlyList<Training>> ListAsync(CancellationToken ct = default);
    Task<Training?> GetAsync(int id, CancellationToken ct = default);
    Task<Training> CreateAsync(string? title, string? description, string? location, DateTime? startTime, DateTime? endTime, int? coachId, CancellationToken ct = default);
    Task<Training?> UpdateAsync(int id, string? title, string? description, string? location, DateTime? startTime, DateTime? endTime, int? coachId, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);

    Task<IReadOnlyList<TrainingParticipant>> ListParticipantsAsync(int trainingId, CancellationToken ct = default);
    Task<bool> AddParticipantAsync(int trainingId, int playerId, CancellationToken ct = default);
    Task<bool> RemoveParticipantAsync(int trainingId, int playerId, CancellationToken ct = default);
}
