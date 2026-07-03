using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SPIL.SalesOrder.Application.DTOs;
using SPIL.SalesOrder.Application.Interfaces;
using SPIL.SalesOrder.Infrastructure.Data;

namespace SPIL.SalesOrder.Application.Services;

public class ClientService : IClientService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    // Dependency Injection happens in the constructor
    public ClientService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ClientDto>> GetAllClientsAsync()
    {
        // 1. Fetch the raw Entities from SQL Server asynchronously
        var clients = await _context.Clients.ToListAsync();
        
        // 2. Map the raw Entities to DTOs and return them
        return _mapper.Map<IEnumerable<ClientDto>>(clients);
    }
}