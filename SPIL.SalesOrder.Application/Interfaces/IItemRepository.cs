using SPIL.SalesOrder.Domain.Entities;

namespace SPIL.SalesOrder.Application.Interfaces;

public interface IItemRepository
{
    Task<IEnumerable<Item>> GetAllAsync();
}