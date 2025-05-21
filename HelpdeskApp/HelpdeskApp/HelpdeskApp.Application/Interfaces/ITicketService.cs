using HelpdeskApp.HelpdeskApp.Application.DTOs;
using HelpdeskApp.HelpdeskApp.Domain.Models;

namespace HelpdeskApp.HelpdeskApp.Application.Interfaces
{
    public interface ITicketService
    {
        Task<IEnumerable<Ticket>> GetAllAsync();
        Task<Ticket?> GetByIdAsync(int id);
        Task<Ticket> CreateAsync(TicketCreateDto dto, int userId);
        Task UpdateAsync(int id, TicketUpdateDto dto);
        Task AddRemarkAsync(RemarkDto dto);
    }
}
