using HelpdeskApp.HelpdeskApp.Application.Enums;

namespace HelpdeskApp.HelpdeskApp.Application.DTOs
{
    public class TicketCreateDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public SeverityLevel Severity { get; set; }
        public int DepartmentId { get; set; }
    }
}
