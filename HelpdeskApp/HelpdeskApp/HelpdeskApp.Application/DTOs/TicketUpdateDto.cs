using HelpdeskApp.HelpdeskApp.Application.Enums;

namespace HelpdeskApp.HelpdeskApp.Application.DTOs
{
    public class TicketUpdateDto
    {
        public TicketStatus Status { get; set; }
        public int? AssignedToUserId { get; set; }
    }
}
