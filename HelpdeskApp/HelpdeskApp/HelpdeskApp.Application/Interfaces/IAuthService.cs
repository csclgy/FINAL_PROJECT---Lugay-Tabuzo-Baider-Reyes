using HelpdeskApp.HelpdeskApp.Application.DTOs;

namespace HelpdeskApp.HelpdeskApp.Application.Interfaces
{
    public interface IAuthService
    {
        string Authenticate(LoginDto loginDto);
    }
}
