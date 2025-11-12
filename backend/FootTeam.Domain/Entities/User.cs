namespace FootTeam.Domain.Entities;

public class User
{
    public int UserID { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime? CreatedAt { get; set; }
    
    
    public virtual Player? Player { get; set; }
    public virtual ICollection<Training> CoachedTrainings { get; set; } = new List<Training>();
    public virtual ICollection<Team> CoachedTeams { get; set; } = new List<Team>();
    public virtual ICollection<Notification> CreatedNotifications { get; set; } = new List<Notification>();
}
