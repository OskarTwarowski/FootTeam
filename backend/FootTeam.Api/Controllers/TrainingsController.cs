using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FootTeam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class TrainingsController(ITrainingService trainings) : ControllerBase
{
    private readonly ITrainingService _trainings = trainings;

    /// <summary>
    /// List trainings.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TrainingResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync(CancellationToken ct)
        => Ok((await _trainings.ListAsync(ct)).Select(TrainingResponse.FromDomain));

    /// <summary>
    /// Get training by id.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(TrainingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAsync(int id, CancellationToken ct)
    {
        var t = await _trainings.GetAsync(id, ct);
        return t is null ? NotFound() : Ok(TrainingResponse.FromDomain(t));
    }

    /// <summary>
    /// Create training.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(TrainingResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateTrainingRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await _trainings.CreateAsync(req.Title, req.Description, req.Location, req.StartTime, req.EndTime, req.CoachID, ct);
        var resp = TrainingResponse.FromDomain(created);
        return Created($"/api/trainings/{resp.TrainingID}", resp);
    }

    /// <summary>
    /// Update training.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(TrainingResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateTrainingRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await _trainings.UpdateAsync(id, req.Title, req.Description, req.Location, req.StartTime, req.EndTime, req.CoachID, ct);
        return updated is null ? NotFound() : Ok(TrainingResponse.FromDomain(updated));
    }

    /// <summary>
    /// Delete training.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        await _trainings.DeleteAsync(id, ct);
        return NoContent();
    }

    /// <summary>
    /// List participants for a training.
    /// </summary>
    [HttpGet("{id:int}/participants")]
    [ProducesResponseType(typeof(IReadOnlyList<TrainingParticipantResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListParticipantsAsync(int id, CancellationToken ct)
        => Ok((await _trainings.ListParticipantsAsync(id, ct)).Select(TrainingParticipantResponse.FromDomain));

    /// <summary>
    /// Add a participant to training.
    /// </summary>
    [HttpPost("{id:int}/participants/{playerId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> AddParticipantAsync(int id, int playerId, CancellationToken ct)
    {
        await _trainings.AddParticipantAsync(id, playerId, ct);
        return NoContent();
    }

    /// <summary>
    /// Remove a participant from training.
    /// </summary>
    [HttpDelete("{id:int}/participants/{playerId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> RemoveParticipantAsync(int id, int playerId, CancellationToken ct)
    {
        await _trainings.RemoveParticipantAsync(id, playerId, ct);
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

public sealed class TrainingParticipantResponse
{
    public int TrainingID { get; set; }
    public int PlayerID { get; set; }

    public static TrainingParticipantResponse FromDomain(TrainingParticipant tp) => new()
    {
        TrainingID = tp.TrainingID,
        PlayerID = tp.PlayerID
    };
}
