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

    public async Task<User> CreateAsync(string email, string password, string role, CancellationToken ct = default)
    {
        // Check if user with this email already exists
        var existingUser = await _repository.GetByEmailAsync(email, ct);
        if (existingUser != null)
        {
            throw new InvalidOperationException("User with this email already exists.");
        }

        // In a real application, you would hash the password here
        // For example: var passwordHash = BCrypt.Net.BCrypt.HashPassword(password);
        var passwordHash = password; // This is just a placeholder

        var u = new User
        {
            Email = email.Trim().ToLower(),
            PasswordHash = passwordHash,
            Role = role,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(u, ct);

        // If the role is Player, create a player profile
        if (string.Equals(created.Role, "Player", StringComparison.OrdinalIgnoreCase))
        {
            var p = new Player
            {
                FirstName = email.Split('@')[0], // Use part of email as first name
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

    public async Task<User?> UpdateAsync(int id, string? email, string? password, string? role, CancellationToken ct = default)
    {
        var existing = await _repository.GetAsync(id, ct);
        if (existing is null) return null;
        
        if (!string.IsNullOrWhiteSpace(email))
        {
            // Check if the new email is already taken by another user
            var userWithSameEmail = await _repository.GetByEmailAsync(email, ct);
            if (userWithSameEmail != null && userWithSameEmail.UserID != id)
            {
                throw new InvalidOperationException("This email is already in use by another account.");
            }
            existing.Email = email.Trim().ToLower();
        }
        
        if (!string.IsNullOrWhiteSpace(password))
        {
            // In a real application, you would hash the password here
            // existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
            existing.PasswordHash = password; // This is just a placeholder
        }
        
        if (!string.IsNullOrWhiteSpace(role))
        {
            existing.Role = role;
        }
        
        return await _repository.UpdateAsync(existing, ct);
    }
    
    public Task<User?> GetByEmailAsync(string email, CancellationToken ct = default)
    {
        return _repository.GetByEmailAsync(email, ct);
    }
}
