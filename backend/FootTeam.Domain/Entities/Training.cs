namespace FootTeam.Domain.Entities;

public class Training
{
    public int TrainingID { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Location { get; set; }
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public int? CoachID { get; set; }
    
    // Navigation properties
    public virtual User? Coach { get; set; }
    public virtual ICollection<TrainingParticipant> TrainingParticipants { get; set; } = new List<TrainingParticipant>();
    
    // Helper property to get all participants
    public IEnumerable<Player> Participants => TrainingParticipants?.Select(tp => tp.Player) ?? Enumerable.Empty<Player>();
}
