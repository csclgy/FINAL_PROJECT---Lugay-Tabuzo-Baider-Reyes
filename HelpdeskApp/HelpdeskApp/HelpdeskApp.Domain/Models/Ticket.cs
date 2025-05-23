using HelpdeskApp.HelpdeskApp.Domain.Enums;  // <-- Use Domain enums here
using System.Collections.Generic;
using System;
namespace HelpdeskApp.HelpdeskApp.Domain.Models
{
    public class Ticket
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Severity { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public int CreatedByUserId { get; set; }
        public User CreatedBy { get; set; } = null!;
        public int? AssignedToUserId { get; set; }
        public User? AssignedTo { get; set; }
        public int DepartmentId { get; set; }
        public Department Department { get; set; } = null!;
        public ICollection<Remark> Remarks { get; set; } = new List<Remark>();
    }
}