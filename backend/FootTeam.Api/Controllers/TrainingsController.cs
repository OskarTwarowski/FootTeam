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
public sealed class TrainingsController(ITrainingService trainings, ITeamService teamService) : ControllerBase
{
    private readonly ITrainingService _trainings = trainings;
    private readonly ITeamService _teamService = teamService;

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

    [HttpGet("team/{teamId:int}")]
    [ProducesResponseType(typeof(IReadOnlyList<TrainingResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListByTeamAsync(int teamId, CancellationToken ct)
    {
        var items = await _trainings.ListAsync(ct);
        items = items.Where(t => t.TeamID.HasValue && t.TeamID.Value == teamId).ToList();
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            if (User.IsInRole("Coach"))
            {
                var teams = await _teamService.GetTeamsAsync(ct);
                var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
                if (coachTeam is null || coachTeam.TeamID != teamId) return Forbid();
            }
            else
            {
                var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
                var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
                if (player?.TeamID != teamId) return Forbid();
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
        if (!req.TeamID.HasValue) return BadRequest("TeamID is required.");
        if (!req.StartTime.HasValue || !req.EndTime.HasValue) return BadRequest("StartTime and EndTime are required.");
        if (req.EndTime.Value < req.StartTime.Value) return BadRequest("EndTime cannot be earlier than StartTime.");
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            var teams = await _teamService.GetTeamsAsync(ct);
            var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
            if (!User.IsInRole("Coach"))
            {
                var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
                var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
                if (!(req.TeamID.HasValue && req.TeamID == player?.TeamID)) return Forbid();
            }
            else
            {
                if (coachTeam is null || coachTeam.TeamID != req.TeamID) return Forbid();
            }
        }
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
        var existing = await _trainings.GetAsync(id, ct);
        if (existing is null) return NotFound();
        var newStart = req.StartTime ?? existing.StartTime;
        var newEnd = req.EndTime ?? existing.EndTime;
        if (!newStart.HasValue || !newEnd.HasValue) return BadRequest("StartTime and EndTime are required.");
        if (newEnd.Value < newStart.Value) return BadRequest("EndTime cannot be earlier than StartTime.");
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            var teams = await _teamService.GetTeamsAsync(ct);
            var coachTeam = teams.FirstOrDefault(t => t.CoachID == currentUserId);
            if (User.IsInRole("Coach"))
            {
                var targetTeamId = req.TeamID ?? existing.TeamID;
                if (coachTeam is null || !(targetTeamId.HasValue && coachTeam.TeamID == targetTeamId)) return Forbid();
            }
            else
            {
                var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
                var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
                var targetTeamId = req.TeamID ?? existing.TeamID;
                if (!(targetTeamId.HasValue && targetTeamId == player?.TeamID)) return Forbid();
            }
        }
        var updated = await _trainings.UpdateAsync(id, req.Title, req.Description, req.Location, req.StartTime, req.EndTime, req.CoachID, req.TeamID, ct);
        return updated is null ? NotFound() : Ok(TrainingResponse.FromDomain(updated));
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Coach,Admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        var existing = await _trainings.GetAsync(id, ct);
        if (!User.IsInRole("Admin"))
        {
            var sub = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name);
            if (!int.TryParse(sub, out var currentUserId)) return Forbid();
            if (User.IsInRole("Coach"))
            {
                if (existing is null || !(existing.TeamID.HasValue && existing.CoachID == currentUserId)) return Forbid();
            }
            else
            {
                var me = HttpContext.RequestServices.GetService(typeof(IPlayerService)) as IPlayerService;
                var player = me is null ? null : await me.GetByUserIdAsync(currentUserId, ct);
                if (existing is null || !(existing.TeamID.HasValue && existing.TeamID == player?.TeamID)) return Forbid();
            }
        }
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
    public int? TeamID { get; set; }

    public static TrainingResponse FromDomain(Training t) => new()
    {
        TrainingID = t.TrainingID,
        Title = t.Title,
        Description = t.Description,
        Location = t.Location,
        StartTime = t.StartTime,
        EndTime = t.EndTime,
        CoachID = t.CoachID,
        TeamID = t.TeamID
    };
}

 
