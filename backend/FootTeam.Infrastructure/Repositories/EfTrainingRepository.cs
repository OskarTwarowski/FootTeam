using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Repositories;

public sealed class EfTrainingRepository(AppDbContext db) : ITrainingRepository
{
    private readonly AppDbContext _db = db;

    public Task<IReadOnlyList<Training>> ListAsync(CancellationToken ct = default)
        => _db.Trainings.AsNoTracking().OrderBy(t => t.StartTime).ToListAsync(ct).ContinueWith(t => (IReadOnlyList<Training>)t.Result, ct);

    public Task<Training?> GetAsync(int id, CancellationToken ct = default)
        => _db.Trainings.AsNoTracking().FirstOrDefaultAsync(t => t.TrainingID == id, ct);

    public async Task<Training> CreateAsync(Training training, CancellationToken ct = default)
    {
        _db.Trainings.Add(training);
        await _db.SaveChangesAsync(ct);
        return training;
    }

    public async Task<Training?> UpdateAsync(Training training, CancellationToken ct = default)
    {
        var existing = await _db.Trainings.FirstOrDefaultAsync(t => t.TrainingID == training.TrainingID, ct);
        if (existing is null) return null;
        existing.Title = training.Title;
        existing.Description = training.Description;
        existing.Location = training.Location;
        existing.StartTime = training.StartTime;
        existing.EndTime = training.EndTime;
        existing.CoachID = training.CoachID;
        await _db.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _db.Trainings.FirstOrDefaultAsync(t => t.TrainingID == id, ct);
        if (existing is null) return false;
        _db.Trainings.Remove(existing);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
