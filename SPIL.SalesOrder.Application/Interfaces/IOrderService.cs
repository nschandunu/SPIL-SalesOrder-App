using SPIL.SalesOrder.Application.DTOs;

namespace SPIL.SalesOrder.Application.Interfaces;

public interface IOrderService
{
    Task<IEnumerable<OrderDto>> GetAllAsync();
    Task<OrderDto?> GetByIdAsync(int id);
    Task<OrderDto> CreateAsync(OrderInputDto dto);
    Task<OrderDto?> UpdateAsync(int id, OrderInputDto dto);
}