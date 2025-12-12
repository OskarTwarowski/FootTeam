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
public sealed class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TeamResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync(CancellationToken ct)
    {
        var teams = await _teamService.GetTeamsAsync(ct);
        if (User.IsInRole("Admin"))
            return Ok(teams.Select(TeamResponse.FromDomain));

        var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
        if (!int.TryParse(sub, out var currentUserId)) return Forbid();

        if (User.IsInRole("Coach"))
{
    // pobierz profil użytkownika
    var playerService = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
    var profile = await playerService.GetByUserIdAsync(currentUserId, ct);

    // drużyna przypisana do profilu coacha
    if (profile?.TeamID != null)
    {
        var team = teams.FirstOrDefault(t => t.TeamID == profile.TeamID);
        if (team != null)
            return Ok(new[] { TeamResponse.FromDomain(team) });
    }

    // fallback → jeśli jest CoachID w tabeli Teams
    var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
    if (coachTeam != null)
        return Ok(new[] { TeamResponse.FromDomain(coachTeam) });

    // nic nie znaleziono
    return Ok(Enumerable.Empty<TeamResponse>());
}
        else
        {
            // Regular user: return only their team if exists
            var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
            var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
            if (player?.TeamID is null) return Ok(Enumerable.Empty<TeamResponse>());
            var team = teams.FirstOrDefault(t => t.TeamID == player.TeamID);
            return team is null ? Ok(Enumerable.Empty<TeamResponse>()) : Ok(new[] { TeamResponse.FromDomain(team) });
        }
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TeamResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken ct)
    {
        var team = await _teamService.GetTeamByIdAsync(id, ct);
        if (team is null) return NotFound();
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            if (User.IsInRole("Coach"))
            {
                if (team.CoachID != currentUserId) return Forbid();
            }
            else
            {
                var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
                var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
                if (player?.TeamID != team.TeamID) return Forbid();
            }
        }
        return Ok(TeamResponse.FromDomain(team));
    }

    [HttpGet("players/{teamId}")]
    [ProducesResponseType(typeof(IEnumerable<PlayerResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTeamPlayersAsync(int teamId, CancellationToken ct)
    {
        var team = await _teamService.GetTeamByIdAsync(teamId, ct);
        if (team is null) return NotFound();
        
        var players = await _teamService.GetTeamPlayersAsync(teamId, ct);
        return Ok(players.Select(PlayerResponse.FromDomain));
    }

    [HttpPost]
    //[Authorize(Roles = "Admin")]
    [Authorize]
    [ProducesResponseType(typeof(TeamResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateTeamRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        
        var team = new Team
        {
            Name = request.Name,
            CoachID = request.CoachId <= 0 ? null : request.CoachId
        };
        
        var created = await _teamService.CreateTeamAsync(team, ct);
        var response = TeamResponse.FromDomain(created);
        
        return Created($"/api/teams/{response.TeamID}", response);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateTeamRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        
        var existingTeam = await _teamService.GetTeamByIdAsync(id, ct);
        if (existingTeam is null) return NotFound();
        
        existingTeam.Name = request.Name ?? existingTeam.Name;
        existingTeam.CoachID = request.CoachId ?? existingTeam.CoachID;
        
        var updated = await _teamService.UpdateTeamAsync(existingTeam, ct);
        if (!updated) return NotFound();
        
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        var deleted = await _teamService.DeleteTeamAsync(id, ct);
        if (!deleted) return NotFound();
        return NoContent();
    }
}

public sealed class CreateTeamRequest
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;
    
    public int? CoachId { get; set; }
}

public sealed class UpdateTeamRequest
{
    [StringLength(100, MinimumLength = 2)]
    public string? Name { get; set; }
    
    public int? CoachId { get; set; }
}

public sealed class TeamResponse
{
    public int TeamID { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? CoachId { get; set; }
    public string? CoachName { get; set; }
    public int PlayerCount { get; set; }
    public string TeamCode { get; set; } = string.Empty;

    public static TeamResponse FromDomain(Team team)
    {
        return new TeamResponse
        {
            TeamID = team.TeamID,
            Name = team.Name,
            CoachId = team.CoachID,
            CoachName = team.Coach?.Email,
            PlayerCount = team.Players?.Count ?? 0,
            TeamCode = team.TeamCode
        };
    }
}
