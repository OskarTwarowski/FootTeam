using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface IUserService
{
    Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default);
    Task<User?> GetAsync(int id, CancellationToken ct = default);
    Task<User> CreateAsync(string username, string email, string passwordHash, string role, DateTime? createdAt, CancellationToken ct = default);
    Task<User?> UpdateAsync(int id, string? username, string? email, string? passwordHash, string? role, DateTime? createdAt, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
}
