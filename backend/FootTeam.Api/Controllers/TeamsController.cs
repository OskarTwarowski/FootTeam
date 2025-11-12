using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FootTeam.Api.Controllers;

[ApiController]
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
        return Ok(teams.Select(TeamResponse.FromDomain));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TeamResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken ct)
    {
        var team = await _teamService.GetTeamByIdAsync(id, ct);
        if (team is null) return NotFound();
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

    public static TeamResponse FromDomain(Team team)
    {
        return new TeamResponse
        {
            TeamID = team.TeamID,
            Name = team.Name,
            CoachId = team.CoachID,
            CoachName = team.Coach?.Email,
            PlayerCount = team.Players?.Count ?? 0
        };
    }
}
