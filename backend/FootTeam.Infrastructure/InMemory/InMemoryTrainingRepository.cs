using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryTrainingRepository : ITrainingRepository
{
    private readonly Dictionary<int, Training> _trainings = new();
    private int _seq = 1;
    private readonly object _lock = new();

    public Task<IReadOnlyList<Training>> ListAsync(CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult<IReadOnlyList<Training>>(_trainings.Values
                .OrderBy(t => t.StartTime)
                .ThenBy(t => t.TrainingID)
                .ToList());
        }
    }

    public Task<Training?> GetAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _trainings.TryGetValue(id, out var t);
            return Task.FromResult(t);
        }
    }

    public Task<Training> CreateAsync(Training training, CancellationToken ct = default)
    {
        lock (_lock)
        {
            training.TrainingID = _seq++;
            _trainings[training.TrainingID] = training;
            return Task.FromResult(training);
        }
    }

    public Task<Training?> UpdateAsync(Training training, CancellationToken ct = default)
    {
        lock (_lock)
        {
            if (!_trainings.ContainsKey(training.TrainingID)) return Task.FromResult<Training?>(null);
            var cur = _trainings[training.TrainingID];
            cur.Title = training.Title;
            cur.Description = training.Description;
            cur.Location = training.Location;
            cur.StartTime = training.StartTime;
            cur.EndTime = training.EndTime;
            cur.CoachID = training.CoachID;
            return Task.FromResult<Training?>(cur);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_trainings.Remove(id));
        }
    }
}
