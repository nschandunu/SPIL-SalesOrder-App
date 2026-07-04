namespace SPIL.SalesOrder.Domain.Entities;

public class Order
{
    public int Id { get; set; }
    
    // Foreign Key to the Client
    public int ClientId { get; set; }
    public virtual Client? Client { get; set; } 

    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }

    // Totals at the bottom of Screen 1
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }

    // Relationship: One Order has many OrderItems
    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}