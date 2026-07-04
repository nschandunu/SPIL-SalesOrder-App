using SPIL.SalesOrder.Application.DTOs;

namespace SPIL.SalesOrder.Application.Interfaces;

public interface IClientService
{
    Task<IEnumerable<ClientDto>> GetAllClientsAsync();
}