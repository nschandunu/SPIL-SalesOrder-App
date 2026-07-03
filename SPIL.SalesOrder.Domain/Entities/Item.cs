namespace SPIL.SalesOrder.Domain.Entities;

public class Item
{
    public int Id { get; set; }
    public string ItemCode { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal DefaultPrice { get; set; }
    public decimal DefaultTaxRate { get; set; }
}