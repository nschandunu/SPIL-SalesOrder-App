namespace SPIL.SalesOrder.Application.DTOs;

public class OrderItemDto
{
    public int Id { get; set; }
    public int ItemId { get; set; }
    public string? Note { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }
    
    // Backend calculated fields
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}