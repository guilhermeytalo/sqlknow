using Dictionary.Application.DTOs;

namespace Dictionary.Application.Interfaces;

public interface IDictionaryService
{
    Task<List<DictionaryEntryDto>> GetwordDefinitionAsync(string word, Guid userId);
    Task<DictionarySearchResponseDto> SearchWordsAsync(string search, int limit, int page);
}