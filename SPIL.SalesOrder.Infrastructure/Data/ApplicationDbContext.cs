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

        // Explicit decimal configuration
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

        // --- Database Seeding ---
        modelBuilder.Entity<Client>().HasData(
            new Client
            {
                Id = 1, CustomerName = "Kasun Sampath", Address1 = "No 15, loka mawatha", Suburb = "Colombo", State = "WP",
                PostCode = "00100"
            },
            new Client
            {
                Id = 2, CustomerName = "Nimal Perera", Address1 = "No 13, bank's road", Suburb = "Kirulapana",
                State = "WP", PostCode = "10200"
            },
            new Client
            {
                Id = 3, CustomerName = "Tim Cook", Address1 = "No 37/2, water park", Suburb = "Nugegoda",
                State = "WP", PostCode = "20000"
            }
        );

        // Note: The 'm' suffix in C# tells the compiler these numbers are specifically 'decimals', not standard floats.
        modelBuilder.Entity<Item>().HasData(
            new Item
            {
                Id = 1, ItemCode = "ITM-001", Description = "Enterprise Server Rack", DefaultPrice = 150000.00m,
                DefaultTaxRate = 15.00m
            },
            new Item
            {
                Id = 2, ItemCode = "ITM-002", Description = "Mechanical Keyboard", DefaultPrice = 12000.00m,
                DefaultTaxRate = 10.00m
            },
            new Item
            {
                Id = 3, ItemCode = "ITM-003", Description = "Wireless Mouse", DefaultPrice = 4500.00m,
                DefaultTaxRate = 10.00m
            }
        );
    }
}