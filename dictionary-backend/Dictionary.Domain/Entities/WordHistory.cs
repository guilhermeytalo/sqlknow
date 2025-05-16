namespace Dictionary.Domain.Entities;

public class WordHistory
{
    public int Id { get; set; }
    public string Word { get; set; }
    public DateTime ViewedAt { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }
}