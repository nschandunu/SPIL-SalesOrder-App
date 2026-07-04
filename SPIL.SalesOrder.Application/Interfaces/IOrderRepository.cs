using SPIL.SalesOrder.Domain.Entities;

namespace SPIL.SalesOrder.Application.Interfaces;

public interface IOrderRepository
{
    Task<IEnumerable<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<Order> CreateAsync(Order order);
    Task<Order> UpdateAsync(Order order);
}