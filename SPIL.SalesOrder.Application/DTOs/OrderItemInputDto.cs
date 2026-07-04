using System.ComponentModel.DataAnnotations;

namespace SPIL.SalesOrder.Application.DTOs;

public class OrderItemInputDto
{
    [Required]
    public int ItemId { get; set; }
    
    public string? Note { get; set; }
    
    [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
    public int Quantity { get; set; }
    
    [Range(0, double.MaxValue, ErrorMessage = "Price cannot be negative.")]
    public decimal Price { get; set; }
    
    [Range(0, 100, ErrorMessage = "Tax Rate must be between 0 and 100.")]
    public decimal TaxRate { get; set; }
}