using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using FootTeam.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace FootTeam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TeamsController : ControllerBase
{
    private readonly ITeamRepository _teamRepository;

    public TeamsController(ITeamRepository teamRepository)
    {
        _teamRepository = teamRepository;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<TeamResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllAsync(CancellationToken ct)
    {
        var teams = await _teamRepository.ListAsync(ct);
        return Ok(teams.Select(TeamResponse.FromDomain));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(TeamResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken ct)
    {
        var team = await _teamRepository.GetAsync(id, ct);
        if (team is null) return NotFound();
        return Ok(TeamResponse.FromDomain(team));
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
        
        var created = await _teamRepository.CreateAsync(team, ct);
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
        
        var existingTeam = await _teamRepository.GetAsync(id, ct);
        if (existingTeam is null) return NotFound();
        
        existingTeam.Name = request.Name ?? existingTeam.Name;
        existingTeam.CoachID = request.CoachId ?? existingTeam.CoachID;
        
        await _teamRepository.UpdateAsync(existingTeam, ct);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        var deleted = await _teamRepository.DeleteAsync(id, ct);
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
