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
public sealed class TrainingsController(ITrainingService trainings) : ControllerBase
{
    private readonly ITrainingService _trainings = trainings;

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TrainingResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync(CancellationToken ct)
    {
        var items = await _trainings.ListAsync(ct);
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            if (User.IsInRole("Coach"))
            {
                items = items.Where(t => t.TeamID.HasValue && t.CoachID == currentUserId).ToList();
            }
            else
            {
                var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
                var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
                items = items.Where(t => t.TeamID.HasValue && t.TeamID == player?.TeamID).ToList();
            }
        }
        return Ok(items.Select(TrainingResponse.FromDomain));
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TrainingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAsync(int id, CancellationToken ct)
    {
        var t = await _trainings.GetAsync(id, ct);
        if (t is null) return NotFound();
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            if (User.IsInRole("Coach"))
            {
                if (!(t.TeamID.HasValue && t.CoachID == currentUserId)) return Forbid();
            }
            else
            {
                var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
                var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
                if (!(t.TeamID.HasValue && t.TeamID == player?.TeamID)) return Forbid();
            }
        }
        return Ok(TrainingResponse.FromDomain(t));
    }

    [HttpPost]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(typeof(TrainingResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateTrainingRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await _trainings.CreateAsync(req.Title, req.Description, req.Location, req.StartTime, req.EndTime, req.CoachID, req.TeamID, ct);
        var resp = TrainingResponse.FromDomain(created);
        return Created($"/api/trainings/{resp.TrainingID}", resp);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(typeof(TrainingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateTrainingRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await _trainings.UpdateAsync(id, req.Title, req.Description, req.Location, req.StartTime, req.EndTime, req.CoachID, req.TeamID, ct);
        return updated is null ? NotFound() : Ok(TrainingResponse.FromDomain(updated));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        await _trainings.DeleteAsync(id, ct);
        return NoContent();
    }

}

public sealed class CreateTrainingRequest
{
    [StringLength(100)]
    public string? Title { get; set; }
    public string? Description { get; set; }
    [StringLength(100)]
    public string? Location { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? CoachID { get; set; }
    public int? TeamID { get; set; }
}

public sealed class UpdateTrainingRequest
{
    [StringLength(100)]
    public string? Title { get; set; }
    public string? Description { get; set; }
    [StringLength(100)]
    public string? Location { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? CoachID { get; set; }
    public int? TeamID { get; set; }
}

public sealed class TrainingResponse
{
    public int TrainingID { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? CoachID { get; set; }

    public static TrainingResponse FromDomain(Training t) => new()
    {
        TrainingID = t.TrainingID,
        Title = t.Title,
        Description = t.Description,
        Location = t.Location,
        StartTime = t.StartTime,
        EndTime = t.EndTime,
        CoachID = t.CoachID
    };
}

 
