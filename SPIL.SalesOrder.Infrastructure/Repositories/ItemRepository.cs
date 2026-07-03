using Microsoft.EntityFrameworkCore;
using SPIL.SalesOrder.Application.Interfaces;
using SPIL.SalesOrder.Domain.Entities;
using SPIL.SalesOrder.Infrastructure.Data;

namespace SPIL.SalesOrder.Infrastructure.Repositories;

public class ItemRepository : IItemRepository
{
    private readonly ApplicationDbContext _context;

    public ItemRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Item>> GetAllAsync()
    {
        return await _context.Items.ToListAsync();
    }
}