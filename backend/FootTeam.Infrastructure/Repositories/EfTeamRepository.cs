using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Repositories;

public sealed class EfTeamRepository(AppDbContext db) : ITeamRepository
{
    private readonly AppDbContext _db = db;

    public async Task<IReadOnlyList<Team>> ListAsync(CancellationToken ct = default)
    {
        return await _db.Teams
            .AsNoTracking()
            .Include(t => t.Coach)
            .OrderBy(t => t.Name)
            .ToListAsync(ct);
    }

    public Task<Team?> GetAsync(int id, CancellationToken ct = default)
    {
        return _db.Teams
            .AsNoTracking()
            .Include(t => t.Coach)
            .FirstOrDefaultAsync(t => t.TeamID == id, ct);
    }

    public async Task<Team> CreateAsync(Team team, CancellationToken ct = default)
    {
        _db.Teams.Add(team);
        await _db.SaveChangesAsync(ct);
        return team;
    }

    public async Task<Team?> UpdateAsync(Team team, CancellationToken ct = default)
    {
        var existing = await _db.Teams.FindAsync([team.TeamID], ct);
        if (existing is null) return null;

        _db.Entry(existing).CurrentValues.SetValues(team);
        await _db.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var rowsAffected = await _db.Teams
            .Where(t => t.TeamID == id)
            .ExecuteDeleteAsync(ct);
        
        return rowsAffected > 0;
    }
}
