using Dictionary.Domain.Entities;
using Dictionary.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Dictionary.Infrastructure.Services;

public class WordImporterService
{
    private readonly AppDbContext _context;
    private readonly HttpClient _httpClient;

    public WordImporterService(AppDbContext context)
    {
        _context = context;
        _httpClient = new HttpClient();
    }
    
    public async Task ImportWordsAsync()
    {
        var wordListUrl = "https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt";
        var content = await _httpClient.GetStringAsync(wordListUrl);

        var words = content
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(w => w.Trim().ToLower())
            .Where(w => !string.IsNullOrWhiteSpace(w))
            .Distinct();

        var existingWords = await _context.Words
            .Select(w => w.Text)
            .ToListAsync();

        var newWords = words
            .Except(existingWords)
            .Select(w => new Word { Text = w });

        await _context.Words.AddRangeAsync(newWords);
        await _context.SaveChangesAsync();

        Console.WriteLine("Importação concluída.");
    }
}