using SPIL.SalesOrder.Domain.Entities;

namespace SPIL.SalesOrder.Application.Interfaces;

public interface IClientRepository
{
    Task<IEnumerable<Client>> GetAllAsync();
}