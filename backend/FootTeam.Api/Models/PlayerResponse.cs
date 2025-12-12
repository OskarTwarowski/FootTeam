namespace FootTeam.Api.Models;

public sealed class PlayerResponse
{
    public int PlayerID { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public DateTime? BirthDate { get; set; }
    public string? Position { get; set; }
    public int? TeamID { get; set; }
    public int? UserID { get; set; }
    public string? TeamCode { get; set; }
    
    public static PlayerResponse FromDomain(Domain.Entities.Player player)
    {
        return new PlayerResponse
        {
            PlayerID = player.PlayerID,
            FirstName = player.FirstName,
            LastName = player.LastName,
            BirthDate = player.BirthDate,
            Position = player.Position,
            TeamID = player.TeamID,
            UserID = player.UserID,
            TeamCode = player.Team?.TeamCode
        };
    }
}
