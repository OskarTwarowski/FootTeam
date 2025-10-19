using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FootTeam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class EventsController(IEventService events) : ControllerBase
{
    private readonly IEventService _events = events;

    /// <summary>
    /// List events.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<EventResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync(CancellationToken ct)
        => Ok((await _events.ListAsync(ct)).Select(EventResponse.FromDomain));

    /// <summary>
    /// Get event by id.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAsync(int id, CancellationToken ct)
    {
        var ev = await _events.GetAsync(id, ct);
        return ev is null ? NotFound() : Ok(EventResponse.FromDomain(ev));
    }

    /// <summary>
    /// Create event.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateEventRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await _events.CreateAsync(req.Title, req.Description, req.EventDate, req.Location, req.CreatedBy, ct);
        var resp = EventResponse.FromDomain(created);
        return Created($"/api/events/{resp.EventID}", resp);
    }

    /// <summary>
    /// Update event.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(EventResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateEventRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var updated = await _events.UpdateAsync(id, req.Title, req.Description, req.EventDate, req.Location, req.CreatedBy, ct);
        return updated is null ? NotFound() : Ok(EventResponse.FromDomain(updated));
    }

    /// <summary>
    /// Delete event.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        await _events.DeleteAsync(id, ct);
        return NoContent();
    }
}

public sealed class CreateEventRequest
{
    [StringLength(100)]
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? EventDate { get; set; }
    [StringLength(100)]
    public string? Location { get; set; }
    public int? CreatedBy { get; set; }
}

public sealed class UpdateEventRequest
{
    [StringLength(100)]
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? EventDate { get; set; }
    [StringLength(100)]
    public string? Location { get; set; }
    public int? CreatedBy { get; set; }
}

public sealed class EventResponse
{
    public int EventID { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? EventDate { get; set; }
    public string? Location { get; set; }
    public int? CreatedBy { get; set; }

    public static EventResponse FromDomain(Event e) => new()
    {
        EventID = e.EventID,
        Title = e.Title,
        Description = e.Description,
        EventDate = e.EventDate,
        Location = e.Location,
        CreatedBy = e.CreatedBy
    };
}
