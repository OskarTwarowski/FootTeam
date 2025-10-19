namespace FootTeam.Domain.Entities;

public sealed class Event
{
    public int EventID { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? EventDate { get; set; }
    public string? Location { get; set; }
    public int? CreatedBy { get; set; }
}
