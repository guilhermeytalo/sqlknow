namespace Dictionary.Domain.Entities;

public class Word
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Text { get; set; } = string.Empty;
}
