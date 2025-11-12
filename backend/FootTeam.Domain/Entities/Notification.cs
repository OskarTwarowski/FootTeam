using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FootTeam.Domain.Entities;

[Table("Notifications")]
public class Notification
{
    [Key]
    public int NotificationID { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? CreatedBy { get; set; }
    public int? TeamID { get; set; }
    
    
    public virtual User? Creator { get; set; }
    public virtual Team? Team { get; set; }
}
