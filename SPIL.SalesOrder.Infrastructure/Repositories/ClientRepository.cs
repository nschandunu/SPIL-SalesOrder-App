using Microsoft.EntityFrameworkCore;
using SPIL.SalesOrder.Application.Interfaces;
using SPIL.SalesOrder.Domain.Entities;
using SPIL.SalesOrder.Infrastructure.Data;

namespace SPIL.SalesOrder.Infrastructure.Repositories;

public class ClientRepository : IClientRepository
{
    private readonly ApplicationDbContext _context;

    public ClientRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Client>> GetAllAsync()
    {
        return await _context.Clients.ToListAsync();
    }
}