using System;
using System.Security.Authentication;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using HelpdeskApp.HelpdeskApp.Application.DTOs;
using HelpdeskApp.HelpdeskApp.Application.Interfaces;
using HelpdeskApp.HelpdeskApp.Infrastructure.Data;

namespace HelpdeskApp.HelpdeskApp.Infrastructure.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtTokenGenerator _tokenGenerator;

        public AuthService(AppDbContext context, JwtTokenGenerator tokenGenerator)
        {
            _context = context;
            _tokenGenerator = tokenGenerator;
        }

        public string Authenticate(LoginDto loginDto)
        {
            Console.WriteLine($"Attempting login: {loginDto.Username}");

            var user = _context.Users.FirstOrDefault(u => u.Username == loginDto.Username);

            if (user == null)
            {
                Console.WriteLine("User not found.");
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            if (user.PasswordHash != loginDto.Password)
            {
                Console.WriteLine("Password does not match.");
                throw new UnauthorizedAccessException("Invalid credentials");
            }

            Console.WriteLine("Login successful");
            return _tokenGenerator.GenerateToken(user);
        }
    }
}
