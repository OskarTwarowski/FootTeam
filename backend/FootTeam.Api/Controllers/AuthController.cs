using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BCrypt.Net;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace FootTeam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class AuthController(IUserService users, IUserRepository userRepo, IConfiguration config) : ControllerBase
{
    private readonly IUserService _users = users;
    private readonly IUserRepository _userRepo = userRepo;
    private readonly IConfiguration _config = config;

    [HttpPost("register")]
    [ProducesResponseType(typeof(AuthUserResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        // Hash plain password
        var hash = BCrypt.Net.BCrypt.HashPassword(req.Password);

        var created = await _users.CreateAsync(req.Username, req.Email, hash, req.Role, DateTime.UtcNow, ct);
        var resp = new AuthUserResponse
        {
            UserID = created.UserID,
            Username = created.Username,
            Email = created.Email,
            Role = created.Role
        };
        return Created($"/api/users/{resp.UserID}", resp);
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> LoginAsync([FromBody] LoginRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        var user = !string.IsNullOrWhiteSpace(req.Email)
            ? await _userRepo.GetByEmailAsync(req.Email.Trim(), ct)
            : (!string.IsNullOrWhiteSpace(req.Username)
                ? await _userRepo.GetByUsernameAsync(req.Username.Trim(), ct)
                : null);

        if (user is null) return Unauthorized();

        var ok = BCrypt.Net.BCrypt.Verify(req.Password, user.PasswordHash);
        if (!ok) return Unauthorized();

        var token = GenerateJwt(user.UserID.ToString(), user.Username, user.Email, user.Role);
        return Ok(new LoginResponse { Token = token });
    }

    private string GenerateJwt(string sub, string username, string email, string role)
    {
        var key = _config["Jwt:Key"] ?? throw new InvalidOperationException("Missing Jwt:Key");
        var issuer = _config["Jwt:Issuer"] ?? "FootTeam";
        var audience = _config["Jwt:Audience"] ?? "FootTeamClients";
        var expiresMinutes = int.TryParse(_config["Jwt:ExpiresMinutes"], out var m) ? m : 60;

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, sub),
            new(JwtRegisteredClaimNames.UniqueName, username),
            new(JwtRegisteredClaimNames.Email, email ?? string.Empty),
            new(ClaimTypes.Role, role ?? "User")
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public sealed class RegisterRequest
{
    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;
    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    [StringLength(100)]
    public string Password { get; set; } = string.Empty;
    [Required]
    [StringLength(20)]
    public string Role { get; set; } = "Player";
}

public sealed class LoginRequest
{
    [StringLength(100)]
    [EmailAddress]
    public string? Email { get; set; }
    [StringLength(50)]
    public string? Username { get; set; }
    [Required]
    [StringLength(100)]
    public string Password { get; set; } = string.Empty;
}

public sealed class LoginResponse
{
    public string Token { get; set; } = string.Empty;
}

public sealed class AuthUserResponse
{
    public int UserID { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
