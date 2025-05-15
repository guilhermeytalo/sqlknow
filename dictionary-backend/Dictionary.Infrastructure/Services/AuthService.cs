using Dictionary.Application.DTOs;
using Dictionary.Application.Interfaces;
using Dictionary.Domain.Entities;
using Dictionary.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Dictionary.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<User> RegisterAsync(RegisterDto request)
    {
        var userExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email);
        if (userExists)
            throw new InvalidOperationException("User already exists");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Email = request.Email,
            Password = HashPassword(request.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return user;
    }

    public async Task<LoginResponse> LoginAsync(LoginDto request)
    {
        var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
        if (user == null || user.Password != HashPassword(request.Password))
            throw new UnauthorizedAccessException("Invalid credentials");

        var token = GenerateJwtToken(user);

        return new LoginResponse
        {
            Token = token,
            UserId = user.Id,
            UserName = user.Name
        };
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = System.Text.Encoding.UTF8.GetBytes(password);
        var hash = sha256.ComputeHash(bytes);
        return Convert.ToBase64String(hash);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ??
                     _configuration["Jwt:Key"];
        var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ??
                        _configuration["Jwt:Issuer"];
        var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ??
                          _configuration["Jwt:Audience"];

        if (string.IsNullOrEmpty(jwtKey))
        {
            throw new InvalidOperationException(
                "JWT Key is not configured. Please set the JWT_KEY environment variable or Jwt:Key in configuration.");
        }

        if (string.IsNullOrEmpty(jwtIssuer))
        {
            throw new InvalidOperationException(
                "JWT Issuer is not configured. Please set the JWT_ISSUER environment variable or Jwt:Issuer in configuration.");
        }

        if (string.IsNullOrEmpty(jwtAudience))
        {
            throw new InvalidOperationException(
                "JWT Audience is not configured. Please set the JWT_AUDIENCE environment variable or Jwt:Audience in configuration.");
        }

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(jwtKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = jwtIssuer,
            Audience = jwtAudience
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}