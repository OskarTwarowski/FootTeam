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
                .OrderBy(u => u.Email)
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
            var existing = _users[user.UserID];
            
            // Only update email if it's different
            if (existing.Email != user.Email)
            {
                existing.Email = user.Email;
            }
            
            // Only update password if it's not empty
            if (!string.IsNullOrEmpty(user.PasswordHash))
            {
                existing.PasswordHash = user.PasswordHash;
            }
            
            existing.Role = user.Role;
            existing.CreatedAt = user.CreatedAt;
            return Task.FromResult<User?>(existing);
        }
    }

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_users.Remove(id));
        }
    }

    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        lock (_lock)
        {
            return Task.FromResult(_users.Values.FirstOrDefault(u => u.Email == email));
        }
    }
}
