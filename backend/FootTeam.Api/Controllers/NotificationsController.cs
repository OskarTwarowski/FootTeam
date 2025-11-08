using System.ComponentModel.DataAnnotations;
using FootTeam.Application.Abstractions;
using FootTeam.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace FootTeam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class NotificationsController(INotificationService notifications) : ControllerBase
{
    private readonly INotificationService _notifications = notifications;

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<NotificationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListAsync([FromQuery] int? teamId, CancellationToken ct)
        => Ok((await _notifications.ListAsync(teamId, ct)).Select(NotificationResponse.FromDomain));

    [HttpGet("user/{userId}")]
    [ProducesResponseType(typeof(IReadOnlyList<NotificationResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCreatorAsync(int userId, CancellationToken ct)
        => Ok((await _notifications.GetByCreatorAsync(userId, ct)).Select(NotificationResponse.FromDomain));

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(NotificationResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAsync(int id, CancellationToken ct)
    {
        var notification = await _notifications.GetAsync(id, ct);
        return notification is null ? NotFound() : Ok(NotificationResponse.FromDomain(notification));
    }

    [HttpPost]
    [ProducesResponseType(typeof(NotificationResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateAsync([FromBody] CreateNotificationRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        if (!req.CreatedBy.HasValue || req.CreatedBy <= 0)
        {
            ModelState.AddModelError(nameof(req.CreatedBy), "Valid CreatedBy is required");
            return ValidationProblem(ModelState);
        }

        var created = await _notifications.CreateAsync(
            req.Title, 
            req.Description, 
            req.StartTime, 
            req.EndTime, 
            req.CreatedBy.Value, 
            req.TeamId <= 0 ? null : req.TeamId, 
            ct);
            
        var resp = NotificationResponse.FromDomain(created);
        return Created($"/api/notifications/{resp.NotificationID}", resp);
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateNotificationRequest req, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        
        var updated = await _notifications.UpdateAsync(
            id, 
            req.Title, 
            req.Description, 
            req.StartTime, 
            req.EndTime, 
            req.TeamId, 
            ct);
            
        if (updated is null) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAsync(int id, CancellationToken ct)
    {
        var deleted = await _notifications.DeleteAsync(id, ct);
        if (!deleted) return NotFound();
        return NoContent();
    }
}

public sealed class CreateNotificationRequest
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;
    
    public string? Description { get; set; }
    
    [Required]
    public DateTime? StartTime { get; set; }
    
    public DateTime? EndTime { get; set; }
    
    [Required]
    public int? CreatedBy { get; set; }
    
    public int? TeamId { get; set; }
}

public sealed class UpdateNotificationRequest
{
    [StringLength(100)]
    public string? Title { get; set; }
    
    public string? Description { get; set; }
    
    public DateTime? StartTime { get; set; }
    
    public DateTime? EndTime { get; set; }
    
    public int? TeamId { get; set; }
}

public sealed class NotificationResponse
{
    public int NotificationID { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? CreatedBy { get; set; }
    public int? TeamId { get; set; }
    public string? TeamName { get; set; }
    public UserResponse? Creator { get; set; }

    public static NotificationResponse FromDomain(Notification n) => new()
    {
        NotificationID = n.NotificationID,
        Title = n.Title,
        Description = n.Description,
        StartTime = n.StartTime,
        EndTime = n.EndTime,
        CreatedBy = n.CreatedBy,
        TeamId = n.TeamID,
        TeamName = n.Team?.Name,
        Creator = n.Creator != null ? new UserResponse 
        { 
            UserID = n.Creator.UserID, 
            Email = n.Creator.Email
        } : null
    };
}
