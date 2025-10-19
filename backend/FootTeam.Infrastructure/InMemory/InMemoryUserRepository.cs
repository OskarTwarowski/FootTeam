using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Infrastructure.InMemory;

public sealed class InMemoryUserRepository : IUserRepository
{
    private readonly Dictionary<int, User> _users = new();
    private int _seq = 1;
    private readonly object _lock = new();

    public Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult<IReadOnlyList<User>>(_users.Values
                .OrderBy(u => u.Username)
                .ThenBy(u => u.Email)
                .ToList());
        }
    }

    public Task<User?> GetAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            _users.TryGetValue(id, out var u);
            return Task.FromResult(u);
        }
    }

    public Task<User> CreateAsync(User user, CancellationToken ct = default)
    {
        lock (_lock)
        {
            user.UserID = _seq++;
            _users[user.UserID] = user;
            return Task.FromResult(user);
        }
    }

    public Task<User?> UpdateAsync(User user, CancellationToken ct = default)
    {
        lock (_lock)
        {
            if (!_users.ContainsKey(user.UserID)) return Task.FromResult<User?>(null);
            var cur = _users[user.UserID];
            cur.Username = user.Username;
            cur.Email = user.Email;
            cur.PasswordHash = user.PasswordHash;
            cur.Role = user.Role;
            cur.CreatedAt = user.CreatedAt;
            return Task.FromResult<User?>(cur);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_users.Remove(id));
        }
    }
}
