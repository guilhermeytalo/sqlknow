using System.Security.Claims;
using Dictionary.Application.Interfaces;
using Dictionary.Infrastructure.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Dictionary.API.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IDictionaryService _dictionaryService;
    public UserController(AppDbContext context)
    {
        _context = context;
    }
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = User.Identity?.Name;
        
        return Ok(new
            {
                message = "User retrieved successfully",
                userId,
                userName
            }
        );
    }

    [HttpGet("me/history")]
    public async Task<IActionResult> GetHistory([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId))
                return Unauthorized("Invalid user ID");

            var query = _context.WordHistories
                .Where(h => h.UserId == userId)
                .OrderByDescending(h => h.ViewedAt);

            var totalDocs = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalDocs / (double)pageSize);
            var hasNext = page < totalPages;
            var hasPrev = page > 1;

            var history = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(h => new { word = h.Word, viewedAt = h.ViewedAt })
                .ToListAsync();

            return Ok(new
            {
                results = history,
                totalDocs,
                page,
                totalPages,
                hasNext,
                hasPrev
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving history", error = ex.Message });
        }
    }
    
        
    [HttpGet("me/favorites")]
    public async Task<IActionResult> GetFavorites([FromQuery] int page = 1, [FromQuery] int pageSize = 4)
    {
        try
        {
            var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        
            var query = _context.Favorites
                .Where(f => f.UserId == userId)
                .OrderByDescending(f => f.AddedAt);
        
            var totalDocs = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalDocs / (double)pageSize);
            var hasNext = page < totalPages;
            var hasPrev = page > 1;
        
            var favorites = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(f => new 
                {
                    word = f.Word,
                    added = f.AddedAt
                })
                .ToListAsync();
        
            return Ok(new
            {
                results = favorites,
                totalDocs,
                page,
                totalPages,
                hasNext,
                hasPrev
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = "Error retrieving favorites", error = ex.Message });
        }
    }
}

