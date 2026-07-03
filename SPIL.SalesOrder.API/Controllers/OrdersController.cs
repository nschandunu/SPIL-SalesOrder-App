using Microsoft.AspNetCore.Mvc;
using SPIL.SalesOrder.Application.DTOs;
using SPIL.SalesOrder.Application.Interfaces;

namespace SPIL.SalesOrder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
    {
        var orders = await _orderService.GetAllAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OrderDto>> GetOrderById(int id)
    {
        var order = await _orderService.GetByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] OrderInputDto dto)
    {
        var createdOrder = await _orderService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, createdOrder);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<OrderDto>> UpdateOrder(int id, [FromBody] OrderInputDto dto)
    {
        var updatedOrder = await _orderService.UpdateAsync(id, dto);
        if (updatedOrder == null) return NotFound();
        
        return Ok(updatedOrder);
    }
}