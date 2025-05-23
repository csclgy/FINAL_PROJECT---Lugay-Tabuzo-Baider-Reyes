using System.Text;
using HelpdeskApp.HelpdeskApp.API.Middleware;
using Microsoft.EntityFrameworkCore;
using HelpdeskApp.HelpdeskApp.Application.Interfaces;
using HelpdeskApp.HelpdeskApp.Infrastructure.Data;
// using HelpdeskApp.HelpdeskApp.Infrastructure.Helpers;
using HelpdeskApp.HelpdeskApp.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddSingleton<JwtTokenGenerator>();

var jwtKey = builder.Configuration["Jwt:Key"];
Console.WriteLine("JWT KEY: " + jwtKey); // Add this for debugging
if (string.IsNullOrEmpty(jwtKey))
{
    throw new Exception("JWT key is missing from configuration.");
}

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)) // <-- use the config value
        };
    });


var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<RoleAuthorizationMiddleware>();
app.MapControllers();

app.Run();