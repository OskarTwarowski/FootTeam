namespace FootTeam.Domain.Entities;

public enum PlayerRole
{
    Player = 0,
    Coach = 1,
    Parent = 2
}

public class Player
{
    public int PlayerID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string? Position { get; set; }
    public string? PhoneNumber { get; set; }
    public int? TeamID { get; set; }
    public int? UserID { get; set; }
    
    public virtual User? User { get; set; }
    public virtual Team? Team { get; set; }
    public PlayerRole Role { get; set; } = PlayerRole.Player;

}
