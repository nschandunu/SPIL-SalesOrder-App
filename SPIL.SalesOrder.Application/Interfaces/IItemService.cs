using SPIL.SalesOrder.Application.DTOs;

namespace SPIL.SalesOrder.Application.Interfaces;

public interface IItemService
{
    Task<IEnumerable<ItemDto>> GetAllItemsAsync();
}