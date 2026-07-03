namespace SPIL.SalesOrder.Application.DTOs;

public class OrderDto
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string InvoiceNo { get; set; } = string.Empty;
    public DateTime InvoiceDate { get; set; }
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }
    
    // Backend calculated totals
    public decimal TotalExcl { get; set; }
    public decimal TotalTax { get; set; }
    public decimal TotalIncl { get; set; }

    public List<OrderItemDto> OrderItems { get; set; } = new();
}