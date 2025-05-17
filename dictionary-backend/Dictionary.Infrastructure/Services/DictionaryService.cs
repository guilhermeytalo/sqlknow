using System.Security.Claims;
using Dictionary.Application.DTOs;
using Dictionary.Application.Interfaces;
using Dictionary.Domain.Entities;
using Dictionary.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace Dictionary.Infrastructure.Services;

public class DictionaryService : IDictionaryService
{
    private readonly HttpClient _httpClient;
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public DictionaryService(HttpClient httpClient, AppDbContext context, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://api.dictionaryapi.dev/");
        _httpClient.DefaultRequestHeaders.Add("User-Agent", "application/json");
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<List<DictionaryEntryDto>> GetwordDefinitionAsync(string word, Guid userId)
    {
        var response = await _httpClient.GetAsync($"api/v2/entries/en/{word}");

        if (!response.IsSuccessStatusCode)
            return new List<DictionaryEntryDto>();
        

        var content = await response.Content.ReadAsStringAsync();
        var definition = JsonConvert.DeserializeObject<List<DictionaryEntryDto>>(content);
        
        var alreadyViewed = await _context.WordHistories
            .AnyAsync(h => h.UserId == userId && h.Word == word);

        if (!alreadyViewed)
        {
            _context.WordHistories.Add(new WordHistory
            {
                Word = word,
                UserId = userId,
                ViewedAt = DateTime.UtcNow,
            });
            await _context.SaveChangesAsync();
        }

        return definition ?? new List<DictionaryEntryDto>();

    }
    public async Task<DictionarySearchResponseDto> SearchWordsAsync(string search, int limit, int page) {
        var query = _context.Words.AsQueryable();

        if (!string.IsNullOrEmpty(search))
            query = query.Where(w => w.Text.Contains(search));
        
        var totalDocs = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalDocs / (double)limit);
        var skip = (page - 1) * limit;
        
        var words = await query
            .OrderBy(w => w.Text)
            .Skip(skip)
            .Take(limit)
            .Select(w => w.Text)
            .ToListAsync();

        return new DictionarySearchResponseDto
        {
            Results = words,
            TotalDocs = totalDocs,
            Page = page,
            TotalPages = totalPages,
            HasNext = page < totalPages,
            HasPrev = page > 1
        };
    }
    
    public async Task AddToFavoritesAsync(string word, Guid userId)
    {
        var exists = await _context.Favorites.AnyAsync(f => f.UserId == userId && f.Word == word);

        if (!exists)
        {
            _context.Favorites.Add(new Favorite
            {
                Word = word,
                UserId = userId,
                AddedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
        }
    }
    
    public async Task RemoveFromFavoritesAsync(string word, Guid userId)
    {
        var favorite = await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.Word == word);
        
        if (favorite == null)
            throw new Exception("Word not in favorites");

        _context.Favorites.Remove(favorite);
        await _context.SaveChangesAsync();
    }
    
    public async Task<DictionarySearchResponseDto> GetFavoritesAsync(Guid userId, int page, int pageSize)
    {
        var query = _context.Favorites
            .Where(f => f.UserId == userId)
            .OrderByDescending(f => f.AddedAt);

        var totalDocs = await query.CountAsync();
        var totalPages = (int)Math.Ceiling(totalDocs / (double)pageSize);
        var skip = (page - 1) * pageSize;

        var favorites = await query
            .Skip(skip)
            .Take(pageSize)
            .Select(f => new 
            {
                word = f.Word,
                added = f.AddedAt
            })
            .ToListAsync();

        return new DictionarySearchResponseDto
        {
            Results = favorites.Select(f => f.word).ToList(),
            TotalDocs = totalDocs,
            Page = page,
            TotalPages = totalPages,
            HasNext = page < totalPages,
            HasPrev = page > 1
        };
    }
}