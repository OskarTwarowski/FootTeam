using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FootTeam.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class UsersController(IUserService users) : ControllerBase
{
    private readonly IUserService _users = users;

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<UserResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync(CancellationToken ct)
        => Ok((await _users.ListAsync(ct)).Select(UserResponse.FromDomain));

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAsync(int id, CancellationToken ct)
    {
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId) || currentUserId != id)
                return Forbid();
        }
        var user = await _users.GetAsync(id, ct);
        return user is null ? NotFound() : Ok(UserResponse.FromDomain(user));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateUserRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await _users.CreateAsync(req.Email, req.Password, req.Role, ct);
        var resp = UserResponse.FromDomain(created);
        return Created($"/api/users/{resp.UserID}", resp);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(UserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateUserRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId) || currentUserId != id)
                return Forbid();
        }
        var updated = await _users.UpdateAsync(id, req.Email, req.Password, req.Role, ct);
        return updated is null ? NotFound() : Ok(UserResponse.FromDomain(updated));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId) || currentUserId != id)
                return Forbid();
        }
        await _users.DeleteAsync(id, ct);
        return NoContent();
    }
}

public sealed class CreateUserRequest
{
    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [StringLength(20)]
    public string Role { get; set; } = string.Empty;
}

public sealed class UpdateUserRequest
{
    [EmailAddress]
    [StringLength(100)]
    public string? Email { get; set; }

    [StringLength(100, MinimumLength = 6)]
    public string? Password { get; set; }

    [StringLength(20)]
    public string? Role { get; set; }
}

public sealed class UserResponse
{
    public int UserID { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    public PlayerResponse? PlayerProfile { get; set; }
    public IReadOnlyList<TrainingResponse>? CoachedTrainings { get; set; }
    public IReadOnlyList<NotificationResponse>? CreatedNotifications { get; set; }

    public static UserResponse FromDomain(User u) => new()
    {
        UserID = u.UserID,
        Email = u.Email,
        Role = u.Role,
        CreatedAt = u.CreatedAt,
        PlayerProfile = u.Player != null ? PlayerResponse.FromDomain(u.Player) : null,
        CoachedTrainings = u.CoachedTrainings?.Select(TrainingResponse.FromDomain).ToList(),
        CreatedNotifications = u.CreatedNotifications?.Select(NotificationResponse.FromDomain).ToList()
    };
}
