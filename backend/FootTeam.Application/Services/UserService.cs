using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;

namespace FootTeam.Application.Services;

public sealed class UserService(IUserRepository repository, IPlayerRepository playerRepository) : IUserService
{
    private readonly IUserRepository _repository = repository;
    private readonly IPlayerRepository _players = playerRepository;

    public Task<IReadOnlyList<User>> ListAsync(CancellationToken ct = default)
        => _repository.ListAsync(ct);

    public Task<User?> GetAsync(int id, CancellationToken ct = default)
        => _repository.GetAsync(id, ct);

    public Task<bool> DeleteAsync(int id, CancellationToken ct = default)
        => _repository.DeleteAsync(id, ct);

    public async Task<User> CreateAsync(string username, string email, string passwordHash, string role, DateTime? createdAt, CancellationToken ct = default)
    {
        var u = new User
        {
            Username = username.Trim(),
            Email = email.Trim(),
            PasswordHash = passwordHash,
            Role = role,
            CreatedAt = createdAt
        };
        var created = await _repository.CreateAsync(u, ct);

        if (string.Equals(created.Role, "Player", StringComparison.OrdinalIgnoreCase))
        {
            var p = new Player
            {
                FirstName = created.Username, // placeholder, can be updated later
                LastName = string.Empty,
                BirthDate = null,
                Position = null,
                Team = null,
                UserID = created.UserID
            };
            await _players.CreateAsync(p, ct);
        }

        return created;
    }

    public async Task<User?> UpdateAsync(int id, string? username, string? email, string? passwordHash, string? role, DateTime? createdAt, CancellationToken ct = default)
    {
        var existing = await _repository.GetAsync(id, ct);
        if (existing is null) return null;
        if (!string.IsNullOrWhiteSpace(username)) existing.Username = username.Trim();
        if (!string.IsNullOrWhiteSpace(email)) existing.Email = email.Trim();
        if (!string.IsNullOrWhiteSpace(passwordHash)) existing.PasswordHash = passwordHash;
        if (!string.IsNullOrWhiteSpace(role)) existing.Role = role;
        existing.CreatedAt = createdAt ?? existing.CreatedAt;
        return await _repository.UpdateAsync(existing, ct);
    }
}
