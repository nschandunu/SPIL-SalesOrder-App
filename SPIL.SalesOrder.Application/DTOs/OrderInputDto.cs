using System.ComponentModel.DataAnnotations;

namespace SPIL.SalesOrder.Application.DTOs;

public class OrderInputDto
{
    [Required(ErrorMessage = "Client ID is required.")]
    public int ClientId { get; set; }
    
    [Required(ErrorMessage = "Invoice Number is required.")]
    public string InvoiceNo { get; set; } = string.Empty;
    
    [Required]
    public DateTime InvoiceDate { get; set; }
    
    public string? ReferenceNo { get; set; }
    public string? Note { get; set; }

    [Required]
    [MinLength(1, ErrorMessage = "At least one Order Item is required.")]
    public List<OrderItemInputDto> OrderItems { get; set; } = new();
}