namespace Dictionary.Application.DTOs;

public class LoginDto
{
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
}

public class LoginResponse
{
    public string Token { get; set; }
    public Guid UserId { get; set; }
    public string UserName { get; set; }
}

