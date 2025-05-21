namespace HelpdeskApp.HelpdeskApp.Application.DTOs
{
    public class RemarkDto
    {
        public int TicketId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int AuthorId { get; set; }
    }
}
