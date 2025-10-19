using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Repositories;

public sealed class EfTrainingParticipantRepository(AppDbContext db) : ITrainingParticipantRepository
{
    private readonly AppDbContext _db = db;

    public async Task<IReadOnlyList<TrainingParticipant>> ListByTrainingAsync(int trainingId, CancellationToken ct = default)
        => await _db.TrainingParticipants.AsNoTracking()
            .Where(tp => tp.TrainingID == trainingId)
            .OrderBy(tp => tp.PlayerID)
            .ToListAsync(ct);

    public async Task<bool> AddAsync(int trainingId, int playerId, CancellationToken ct = default)
    {
        var exists = await _db.TrainingParticipants.AnyAsync(tp => tp.TrainingID == trainingId && tp.PlayerID == playerId, ct);
        if (exists) return true;
        _db.TrainingParticipants.Add(new TrainingParticipant { TrainingID = trainingId, PlayerID = playerId });
        await _db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> RemoveAsync(int trainingId, int playerId, CancellationToken ct = default)
    {
        var existing = await _db.TrainingParticipants.FirstOrDefaultAsync(tp => tp.TrainingID == trainingId && tp.PlayerID == playerId, ct);
        if (existing is null) return false;
        _db.TrainingParticipants.Remove(existing);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
