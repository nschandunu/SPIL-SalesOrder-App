namespace SPIL.SalesOrder.Application.DTOs;

public class ClientDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string? Address1 { get; set; }
    public string? Address2 { get; set; }
    public string? Address3 { get; set; }
    public string? Suburb { get; set; }
    public string? State { get; set; }
    public string? PostCode { get; set; }
}