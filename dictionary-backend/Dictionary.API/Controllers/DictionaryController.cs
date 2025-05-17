using System.Security.Claims;
using Dictionary.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Dictionary.API.Controllers;

[ApiController]
[Route("entries")]
public class DictionaryController : ControllerBase
{
    private readonly IDictionaryService _dictionaryService;

    public DictionaryController(IDictionaryService dictionaryService)
    {
        _dictionaryService = dictionaryService;
    }
    [HttpGet("en/{word}")]
    public async Task<IActionResult> GetWordDefinition(
        string word
    )
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var entry = await _dictionaryService.GetwordDefinitionAsync(word, userId);
            return Ok(entry);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving entry", error = ex.Message });
        }
    }

    [HttpGet("en")]
    public async Task<IActionResult> GetWords(
        [FromQuery] string search = "",
        [FromQuery] int limit = 10,
        [FromQuery] int page = 1
    )
    {
        try
        {
            var entries = await _dictionaryService.SearchWordsAsync(search, limit, page);
            return Ok(entries);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving entries", error = ex.Message });
        }
    }
    
    [HttpPost("en/{word}/favorite")]
    public async Task<IActionResult> AddToFavorites(
        string word
    )
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _dictionaryService.AddToFavoritesAsync(word, userId);
            return Ok(new { message = "Word added to favorites" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error adding word to favorites", error = ex.Message });
        }
    }
    
    [HttpDelete("en/{word}/favorite")]
    public async Task<IActionResult> RemoveFromFavorites(
        string word
    )
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _dictionaryService.RemoveFromFavoritesAsync(word, userId);
            return Ok(new { message = "Word removed from favorites" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error removing word from favorites", error = ex.Message });
        }
    }
}