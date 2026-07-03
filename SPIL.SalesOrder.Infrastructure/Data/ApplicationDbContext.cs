using Microsoft.EntityFrameworkCore;
using SPIL.SalesOrder.Domain.Entities;

namespace SPIL.SalesOrder.Infrastructure.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }
    
    public DbSet<Client> Clients { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Define decimal precision (18 digits total, 2 decimal places)
        // This prevents data loss and warnings for currency and tax rates
        modelBuilder.Entity<Item>().Property(i => i.DefaultPrice).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Item>().Property(i => i.DefaultTaxRate).HasColumnType("decimal(18,2)");
        
        modelBuilder.Entity<Order>().Property(o => o.TotalExcl).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.TotalTax).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.TotalIncl).HasColumnType("decimal(18,2)");
        
        modelBuilder.Entity<OrderItem>().Property(oi => oi.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.TaxRate).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.ExclAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.TaxAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.InclAmount).HasColumnType("decimal(18,2)");
    }
}