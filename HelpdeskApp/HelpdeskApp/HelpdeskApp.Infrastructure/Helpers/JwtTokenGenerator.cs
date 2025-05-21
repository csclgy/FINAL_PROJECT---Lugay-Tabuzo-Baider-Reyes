using HelpdeskApp.HelpdeskApp.Domain.Models;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;

namespace HelpdeskApp.HelpdeskApp.Infrastructure.Helpers
{
    public class JwtTokenGenerator
    {
        private readonly IConfiguration _config;
        public JwtTokenGenerator(IConfiguration config) => _config = config;

       
        }
    
}
