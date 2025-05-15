using Dictionary.Application.DTOs;
using Dictionary.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Dictionary.API.Controllers;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("signup")]
    [AllowAnonymous]
    public async Task<IActionResult> SignUp([FromBody] RegisterDto request)
    {
        try
        {
            var user = await _authService.RegisterAsync(request);
            return CreatedAtAction(nameof(SignUp),
                new { message = "User Created", id = user.Id, name = user.Name, email = user.Email });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("signin")]
    [AllowAnonymous]
    public async Task<IActionResult> Signin([FromBody] LoginDto request)
    {
        try
        {
            var response = await _authService.LoginAsync(request);
            return Ok(new { response });
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { message = "usuario ou senha inválidos", error =  ex.Message});
        }
    }
}