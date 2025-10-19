using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FootTeam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PlayersController(IPlayerService playerService) : ControllerBase
{
    private readonly IPlayerService _playerService = playerService;

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PlayerResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync([FromQuery] string? team, CancellationToken ct)
    {
        var players = await _playerService.ListAsync(team, ct);
        return Ok(players.Select(PlayerResponse.FromDomain));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByIdAsync(int id, CancellationToken ct)
    {
        var player = await _playerService.GetAsync(id, ct);
        if (player is null) return NotFound();
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
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreatePlayerRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var player = await _playerService.CreateAsync(request.FirstName, request.LastName, request.BirthDate, request.Position, request.Team, request.UserID, ct);
        var response = PlayerResponse.FromDomain(player);
        return Created($"/api/players/{response.PlayerID}", response);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdatePlayerRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await _playerService.UpdateAsync(id, request.FirstName, request.LastName, request.BirthDate, request.Position, request.Team, request.UserID, ct);
        if (updated is null) return NotFound();
        return Ok(PlayerResponse.FromDomain(updated));
    }

    [HttpPut("user/{userId}")]
    [ProducesResponseType(typeof(PlayerResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateByUserIdAsync(int userId, [FromBody] UpdatePlayerRequest request, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await _playerService.UpdateByUserIdAsync(userId, request.FirstName, request.LastName, request.BirthDate, request.Position, request.Team, ct);
        if (updated is null) return NotFound();
        return Ok(PlayerResponse.FromDomain(updated));
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        await _playerService.DeleteAsync(id, ct);
        return NoContent();
    }

    [HttpDelete("user/{userId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteByUserIdAsync(int userId, CancellationToken ct)
    {
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
    public DateTime? BirthDate { get; set; }
    [StringLength(50)]
    public string? Position { get; set; }
    [StringLength(50)]
    public string? Team { get; set; }
    public int? UserID { get; set; }
}

public sealed class UpdatePlayerRequest
{
    [StringLength(100, MinimumLength = 2)]
    public string? FirstName { get; set; }
    [StringLength(100, MinimumLength = 2)]
    public string? LastName { get; set; }
    public DateTime? BirthDate { get; set; }
    [StringLength(50)]
    public string? Position { get; set; }
    [StringLength(50)]
    public string? Team { get; set; }
    public int? UserID { get; set; }
}

public sealed class PlayerResponse
{
    public int PlayerID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string? Position { get; set; }
    public string? Team { get; set; }
    public int? UserID { get; set; }

    public static PlayerResponse FromDomain(Player p) => new()
    {
        PlayerID = p.PlayerID,
        FirstName = p.FirstName,
        LastName = p.LastName,
        BirthDate = p.BirthDate,
        Position = p.Position,
        Team = p.Team,
        UserID = p.UserID
    };
}
