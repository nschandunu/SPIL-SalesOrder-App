using AutoMapper;
using SPIL.SalesOrder.Domain.Entities;
using SPIL.SalesOrder.Application.DTOs;

namespace SPIL.SalesOrder.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Client, ClientDto>().ReverseMap();
        CreateMap<Item, ItemDto>().ReverseMap();

        // Response Mappings
        CreateMap<OrderItem, OrderItemDto>().ReverseMap();
        CreateMap<Order, OrderDto>().ReverseMap();

        // Input Mappings (Frontend -> Entity)
        CreateMap<OrderItemInputDto, OrderItem>();
        CreateMap<OrderInputDto, Order>();
    }
}