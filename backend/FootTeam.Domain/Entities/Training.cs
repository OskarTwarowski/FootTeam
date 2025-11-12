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
    public int? TeamID { get; set; }
    
    
    public virtual User? Coach { get; set; }
    public virtual Team? Team { get; set; }
}
