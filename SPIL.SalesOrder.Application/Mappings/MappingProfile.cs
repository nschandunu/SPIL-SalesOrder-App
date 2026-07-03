using AutoMapper;
using SPIL.SalesOrder.Domain.Entities;
using SPIL.SalesOrder.Application.DTOs;

namespace SPIL.SalesOrder.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // This tells AutoMapper that it is safe to convert a Client entity into a ClientDto
        CreateMap<Client, ClientDto>().ReverseMap();
        CreateMap<Item, ItemDto>().ReverseMap();
    }
}