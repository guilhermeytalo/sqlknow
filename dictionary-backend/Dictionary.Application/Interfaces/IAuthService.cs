using Dictionary.Application.DTOs;
using Dictionary.Domain.Entities;

namespace Dictionary.Application.Interfaces;

public interface IAuthService
{
    Task<User>RegisterAsync(RegisterDto request);
    Task<LoginResponse> LoginAsync(LoginDto request);
}