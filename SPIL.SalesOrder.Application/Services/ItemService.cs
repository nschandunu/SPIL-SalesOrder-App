using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SPIL.SalesOrder.Application.DTOs;
using SPIL.SalesOrder.Application.Interfaces;
using SPIL.SalesOrder.Infrastructure.Data;

namespace SPIL.SalesOrder.Application.Services;

public class ItemService : IItemService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;

    public ItemService(ApplicationDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<IEnumerable<ItemDto>> GetAllItemsAsync()
    {
        var items = await _context.Items.ToListAsync();
        return _mapper.Map<IEnumerable<ItemDto>>(items);
    }
}