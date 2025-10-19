using FootTeam.Domain.Entities;

namespace FootTeam.Domain.Repositories;

public interface ITrainingParticipantRepository
{
    Task<IReadOnlyList<TrainingParticipant>> ListByTrainingAsync(int trainingId, CancellationToken ct = default);
    Task<bool> AddAsync(int trainingId, int playerId, CancellationToken ct = default);
    Task<bool> RemoveAsync(int trainingId, int playerId, CancellationToken ct = default);
}
