using FootTeam.Domain.Entities;

namespace FootTeam.Application.Abstractions;

public interface IUserService
{
    Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default);
    Task<User?> GetAsync(int id, CancellationToken ct = default);
    Task<User> CreateAsync(string email, string password, string role, CancellationToken ct = default);
    Task<User?> UpdateAsync(int id, string? email, string? password, string? role, CancellationToken ct = default);
    Task<bool> DeleteAsync(int id, CancellationToken ct = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken ct = default);
}
