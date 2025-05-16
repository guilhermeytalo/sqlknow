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
    
    private int? GetLoggedInUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier);
        return userIdClaim != null ? int.Parse(userIdClaim.Value) : (int?)null;
    }
}