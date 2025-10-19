using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FootTeam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class UsersController(IUserService users) : ControllerBase
{
    private readonly IUserService _users = users;

    /// <summary>
    /// List all users.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<UserResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync(CancellationToken ct)
        => Ok((await _users.ListAsync(ct)).Select(UserResponse.FromDomain));

    /// <summary>
    /// Get user by id.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAsync(int id, CancellationToken ct)
    {
        var user = await _users.GetAsync(id, ct);
        return user is null ? NotFound() : Ok(UserResponse.FromDomain(user));
    }

    /// <summary>
    /// Create a new user.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await _users.CreateAsync(req.Username, req.Email, req.PasswordHash, req.Role, req.CreatedAt, ct);
        var resp = UserResponse.FromDomain(created);
        return Created($"/api/users/{resp.UserID}", resp);
    }

    /// <summary>
    /// Update user.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateUserRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await _users.UpdateAsync(id, req.Username, req.Email, req.PasswordHash, req.Role, req.CreatedAt, ct);
        return updated is null ? NotFound() : Ok(UserResponse.FromDomain(updated));
    }

    /// <summary>
    /// Delete user.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        await _users.DeleteAsync(id, ct);
        return NoContent();
    }
}

public sealed class CreateUserRequest
{
    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;
    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    [StringLength(255)]
    public string PasswordHash { get; set; } = string.Empty;
    [Required]
    [StringLength(20)]
    public string Role { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
}

public sealed class UpdateUserRequest
{
    [StringLength(50)]
    public string? Username { get; set; }
    [StringLength(100)]
    [EmailAddress]
    public string? Email { get; set; }
    [StringLength(255)]
    public string? PasswordHash { get; set; }
    [StringLength(20)]
    public string? Role { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public sealed class UserResponse
{
    public int UserID { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }

    public static UserResponse FromDomain(User u) => new()
    {
        UserID = u.UserID,
        Username = u.Username,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = u.CreatedAt
    };
}
