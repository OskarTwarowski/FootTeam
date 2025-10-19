namespace FootTeam.Domain.Entities;

public sealed class Player
{
    public int PlayerID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string? Position { get; set; }
    public string? Team { get; set; }
    public int? UserID { get; set; }
}
