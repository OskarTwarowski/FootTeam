using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using FootTeam.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FootTeam.Infrastructure.Repositories;

public sealed class EfUserRepository(AppDbContext db) : IUserRepository
{
    private readonly AppDbContext _db = db;

    public Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default)
        => _db.Users.AsNoTracking().OrderBy(u => u.Username).ThenBy(u => u.Email).ToListAsync(ct).ContinueWith(t => (IReadOnlyList<User>)t.Result, ct);

    public Task<User?> GetAsync(int id, CancellationToken ct = default)
        => _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserID == id, ct);

    public async Task<User> CreateAsync(User user, CancellationToken ct = default)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync(ct);
        return user;
    }

    public async Task<User?> UpdateAsync(User user, CancellationToken ct = default)
    {
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.UserID == user.UserID, ct);
        if (existing is null) return null;
        existing.Username = user.Username;
        existing.Email = user.Email;
        existing.PasswordHash = user.PasswordHash;
        existing.Role = user.Role;
        existing.CreatedAt = user.CreatedAt;
        await _db.SaveChangesAsync(ct);
        return existing;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _db.Users.FirstOrDefaultAsync(u => u.UserID == id, ct);
        if (existing is null) return false;
        _db.Users.Remove(existing);
        await _db.SaveChangesAsync(ct);
        return true;
    }
}
