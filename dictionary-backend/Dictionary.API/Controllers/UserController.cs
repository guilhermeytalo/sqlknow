using System.Security.Claims;
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

    [HttpGet("/history")]
    public async Task<IActionResult> GetHistory()
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID");

        var history = await _context.WordHistories
            .Where(h => h.UserId == userId)
            .OrderByDescending(h => h.ViewedAt)
            .Select(h => new { h.Word, h.ViewedAt })
            .ToListAsync();
        
        return Ok(history);
    }
}

