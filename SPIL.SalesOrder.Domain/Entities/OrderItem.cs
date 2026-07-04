namespace SPIL.SalesOrder.Domain.Entities;

public class OrderItem
{
    public int Id { get; set; }

    // Foreign Key linking back to the Order
    public int OrderId { get; set; }
    // Foreign Key linking to the Item selected
    public int ItemId { get; set; }
    public virtual Item? Item { get; set; }

    public string? Note { get; set; }
    public int Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal TaxRate { get; set; }

    // The calculated fields
    public decimal ExclAmount { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal InclAmount { get; set; }
}