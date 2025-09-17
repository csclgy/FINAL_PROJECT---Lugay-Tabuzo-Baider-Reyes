using HelpdeskApp.HelpdeskApp.Application.Enums;
namespace HelpdeskApp.HelpdeskApp.Application.DTOs
{
    public class TicketUpdateDto
    {
        public string Status { get; set; } = string.Empty;
        public int? AssignedToUserId { get; set; }
    }
}
