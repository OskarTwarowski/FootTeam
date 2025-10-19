using FootTeam.Domain.Entities;

namespace FootTeam.Domain.Repositories;

public interface IUserRepository
{
    Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default);
    Task<User?> GetAsync(int id, CancellationToken ct = default);
    Task<User> CreateAsync(User user, CancellationToken ct = default);
    Task<User?> UpdateAsync(User user, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
    Task<User?> GetByUsernameAsync(string username, CancellationToken ct = default);
}
