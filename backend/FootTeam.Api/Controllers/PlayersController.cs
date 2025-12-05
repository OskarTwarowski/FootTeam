using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FootTeam.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public sealed class PlayersController(IPlayerService playerService, ITeamService teamService) : ControllerBase
{
    private readonly IPlayerService _playerService = playerService;
    private readonly ITeamService _teamService = teamService;

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PlayerResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync([FromQuery] int? teamId, CancellationToken ct)
    {
        var isAdmin = User.IsInRole("Admin");
        var isCoach = User.IsInRole("Coach");
        if (!isAdmin)
        {
            // Require team filter and check access
            if (!teamId.HasValue) return Forbid();
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            if (isCoach)
            {
                var teams = await _teamService.GetTeamsAsync(ct);
                var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
                if (coachTeam is null || coachTeam.TeamID != teamId.Value) return Forbid();
            }
            else
            {
                var me = await _playerService.GetByUserIdAsync(currentUserId, ct);
                if (me is null || me.TeamID != teamId) return Forbid();
            }
        }
        var players = await _playerService.ListAsync(teamId, ct);
        return Ok(players.Select(PlayerResponse.FromDomain));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken ct)
    {
        var player = await _playerService.GetAsync(id, ct);
        if (player is null) return NotFound();
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            if (User.IsInRole("Coach"))
            {
                var teams = await _teamService.GetTeamsAsync(ct);
                var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
                if (coachTeam is null || coachTeam.TeamID != player.TeamID) return Forbid();
            }
            else
            {
                var me = await _playerService.GetByUserIdAsync(currentUserId, ct);
                if (me is null || me.TeamID != player.TeamID) return Forbid();
            }
        }
        return Ok(PlayerResponse.FromDomain(player));
    }

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByUserIdAsync(int userId, CancellationToken ct)
    {
        var player = await _playerService.GetByUserIdAsync(userId, ct);
        if (player is null) return NotFound();
        return Ok(PlayerResponse.FromDomain(player));
    }

    [HttpPost]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePlayerRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            var teams = await _teamService.GetTeamsAsync(ct);
            var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
            if (coachTeam is null || (request.TeamID.HasValue && coachTeam.TeamID != request.TeamID)) return Forbid();
        }
        var player = await _playerService.CreateAsync(
            request.FirstName, 
            request.LastName, 
            request.TeamID, 
            request.UserID, 
            ct);
        var response = PlayerResponse.FromDomain(player);
        return Created($"/api/players/{response.PlayerID}", response);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdatePlayerRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            var teams = await _teamService.GetTeamsAsync(ct);
            var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
            if (coachTeam is null) return Forbid();
            if (request.TeamID.HasValue && coachTeam.TeamID != request.TeamID) return Forbid();
            var existing = await _playerService.GetAsync(id, ct);
            if (existing is null) return NotFound();
            if (existing.TeamID.HasValue && existing.TeamID != coachTeam.TeamID) return Forbid();
        }
        var updated = await _playerService.UpdateAsync(
            id, 
            request.FirstName, 
            request.LastName, 
            request.TeamID, 
            ct);
        return updated is null ? NotFound() : Ok(PlayerResponse.FromDomain(updated));
    }

    [HttpPut("user/{userId}")]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateByUserIdAsync(int userId, [FromBody] UpdatePlayerRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            var teams = await _teamService.GetTeamsAsync(ct);
            var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
            if (coachTeam is null) return Forbid();
            var existing = await _playerService.GetByUserIdAsync(userId, ct);
            if (existing is null) return NotFound();
            if (existing.TeamID.HasValue && existing.TeamID != coachTeam.TeamID) return Forbid();
            if (request.TeamID.HasValue && request.TeamID != coachTeam.TeamID) return Forbid();
        }
        var updated = await _playerService.UpdateByUserIdAsync(
            userId, 
            request.FirstName, 
            request.LastName, 
            request.TeamID, 
            ct);
        return updated is null ? NotFound() : Ok(PlayerResponse.FromDomain(updated));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            var teams = await _teamService.GetTeamsAsync(ct);
            var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
            if (coachTeam is null) return Forbid();
            var existing = await _playerService.GetAsync(id, ct);
            if (existing is null) return NoContent();
            if (existing.TeamID.HasValue && existing.TeamID != coachTeam.TeamID) return Forbid();
        }
        await _playerService.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("user/{userId}")]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteByUserIdAsync(int userId, CancellationToken ct)
    {
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            var teams = await _teamService.GetTeamsAsync(ct);
            var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
            if (coachTeam is null) return Forbid();
            var existing = await _playerService.GetByUserIdAsync(userId, ct);
            if (existing is null) return NotFound();
            if (existing.TeamID.HasValue && existing.TeamID != coachTeam.TeamID) return Forbid();
        }
        var deleted = await _playerService.DeleteByUserIdAsync(userId, ct);
        if (!deleted) return NotFound();
        return NoContent();
    }
}

public sealed class CreatePlayerRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string FirstName { get; set; } = string.Empty;
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string LastName { get; set; } = string.Empty;
    public int? TeamID { get; set; }
    public int? UserID { get; set; }
}

public sealed class UpdatePlayerRequest
{
    [StringLength(100, MinimumLength = 2)]
    public string? FirstName { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? LastName { get; set; }
    public int? TeamID { get; set; }
    public int? UserID { get; set; }
}

public sealed class PlayerResponse
{
    public int PlayerID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int? TeamID { get; set; }
    public string? TeamName { get; set; }
    public int? UserID { get; set; }
    public string? TeamCode { get; set; }

    public static PlayerResponse FromDomain(Player p) => new()
    {
        PlayerID = p.PlayerID,
        FirstName = p.FirstName,
        LastName = p.LastName,
        TeamID = p.TeamID,
        TeamName = p.Team?.Name,
        UserID = p.UserID,
        TeamCode = p.Team?.TeamCode
    };
}
