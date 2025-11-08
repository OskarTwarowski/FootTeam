namespace FootTeam.Domain.Entities;

public class TrainingParticipant
{
    public int TrainingID { get; set; }
    public int PlayerID { get; set; }
    
    // Navigation properties
    public virtual Training Training { get; set; } = null!;
    public virtual Player Player { get; set; } = null!;
}
