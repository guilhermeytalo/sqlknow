namespace Dictionary.Application.DTOs;

public class WordDto
{
    public int Id { get; set; }
    public string LanguageCode { get; set; } = "en";
    public string Text { get; set; } = null!;
}