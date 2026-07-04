using Microsoft.AspNetCore.Mvc;
using SPIL.SalesOrder.Application.DTOs;
using SPIL.SalesOrder.Application.Interfaces;

namespace SPIL.SalesOrder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IItemService _itemService;

    public ItemsController(IItemService itemService)
    {
        _itemService = itemService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
    {
        var items = await _itemService.GetAllItemsAsync();
        return Ok(items);
    }
}