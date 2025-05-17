using Dictionary.Application.DTOs;

namespace Dictionary.Application.Interfaces;

public interface IDictionaryService
{
    Task<List<DictionaryEntryDto>> GetwordDefinitionAsync(string word, Guid userId);
    Task<DictionarySearchResponseDto> SearchWordsAsync(string search, int limit, int page);
    Task AddToFavoritesAsync(string word, Guid userId);
    Task RemoveFromFavoritesAsync(string word, Guid userId);
    Task<DictionarySearchResponseDto> GetFavoritesAsync(Guid userId, int page, int pageSize);
}