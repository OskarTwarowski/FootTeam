using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Repositories;

public sealed class EfPlayerRepository(AppDbContext db) : IPlayerRepository
{
    private readonly AppDbContext _db = db;

    public async Task<IReadOnlyList<Player>> ListAsync(string? team = null, CancellationToken ct = default)
    {
        IQueryable<Player> query = _db.Players.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(team))
        {
            var t = team.Trim();
            query = query.Where(p => p.Team == t);
        }
        return await query.OrderBy(p => p.LastName).ThenBy(p => p.FirstName).ToListAsync(ct);
    }

    public Task<Player?> GetAsync(int id, CancellationToken ct = default)
        => _db.Players.AsNoTracking().FirstOrDefaultAsync(p => p.PlayerID == id, ct);

    public async Task<Player> CreateAsync(Player player, CancellationToken ct = default)
    {
        _db.Players.Add(player);
        await _db.SaveChangesAsync(ct);
        return player;
    }

    public async Task<Player?> UpdateAsync(Player player, CancellationToken ct = default)
    {
        var existing = await _db.Players.FirstOrDefaultAsync(p => p.PlayerID == player.PlayerID, ct);
        if (existing is null) return null;
        existing.FirstName = player.FirstName;
        existing.LastName = player.LastName;
        existing.BirthDate = player.BirthDate;
        existing.Position = player.Position;
        existing.Team = player.Team;
        existing.UserID = player.UserID;
        await _db.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _db.Players.FirstOrDefaultAsync(p => p.PlayerID == id, ct);
        if (existing is null) return false;
        _db.Players.Remove(existing);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
