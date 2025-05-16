namespace Dictionary.Application.DTOs;

public class DictionarySearchResponseDto
{
    public List<string> Results { get; set; }
    public int TotalDocs { get; set; }
    public int Page { get; set; }
    public int TotalPages { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrev { get; set; }
}