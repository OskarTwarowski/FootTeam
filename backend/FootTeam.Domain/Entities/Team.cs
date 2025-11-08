namespace FootTeam.Domain.Entities;

public class Team
{
    public int TeamID { get; set; }
    public string Name { get; set; } = string.Empty;
    public int? CoachID { get; set; }
    
    public virtual User? Coach { get; set; }
    public virtual ICollection<Player> Players { get; set; } = new List<Player>();
}
