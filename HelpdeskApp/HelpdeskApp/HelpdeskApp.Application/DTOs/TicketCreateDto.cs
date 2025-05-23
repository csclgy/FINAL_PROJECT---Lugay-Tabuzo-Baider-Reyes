using HelpdeskApp.HelpdeskApp.Application.Enums;
namespace HelpdeskApp.HelpdeskApp.Application.DTOs
{
    public class TicketCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public int DepartmentId { get; set; }
        public string Status { get; set; } = string.Empty;
    }
}
