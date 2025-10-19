using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryTrainingParticipantRepository : ITrainingParticipantRepository
{
    private readonly HashSet<(int TrainingID, int PlayerID)> _set = new();
    private readonly object _lock = new();

    public Task<IReadOnlyList<TrainingParticipant>> ListByTrainingAsync(int trainingId, CancellationToken ct = default)
    {
        lock (_lock)
        {
            var list = _set.Where(x => x.TrainingID == trainingId)
                .Select(x => new TrainingParticipant { TrainingID = x.TrainingID, PlayerID = x.PlayerID })
                .OrderBy(x => x.PlayerID)
                .ToList();
            return Task.FromResult<IReadOnlyList<TrainingParticipant>>(list);
        }
    }

    public Task<bool> AddAsync(int trainingId, int playerId, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _set.Add((trainingId, playerId));
            return Task.FromResult(true);
        }
    }

    public Task<bool> RemoveAsync(int trainingId, int playerId, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_set.Remove((trainingId, playerId)));
        }
    }
}
