namespace Dictionary.Domain.Entities;

public class Favorite
{
    public int Id { get; set; }

    public string Word { get; set; } = string.Empty;

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }
    public User User { get; set; }
}