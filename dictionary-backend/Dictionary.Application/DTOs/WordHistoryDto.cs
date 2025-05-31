namespace Dictionary.Application.DTOs;

public class WordHistoryDto
{
    public string Word { get; set; } = string.Empty;
    public DateTime ViewedAt { get; set; }
}

public class WordHistoryResponseDto
{
    public List<WordHistoryDto> Results { get; set; } = new();
    public int TotalDocs { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrev { get; set; }
} 