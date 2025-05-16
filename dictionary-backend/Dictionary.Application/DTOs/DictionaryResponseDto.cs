namespace Dictionary.Application.DTOs;

public class DictionaryResponseDto
{
    public List<string> Results { get; set; } = new();
    public int TotalDocs { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrev { get; set; }
}