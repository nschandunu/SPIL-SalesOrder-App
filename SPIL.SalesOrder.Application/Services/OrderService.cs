using AutoMapper;
using SPIL.SalesOrder.Application.DTOs;
using SPIL.SalesOrder.Application.Interfaces;
using SPIL.SalesOrder.Domain.Entities;

namespace SPIL.SalesOrder.Application.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public OrderService(IOrderRepository orderRepository, IMapper mapper)
    {
        _orderRepository = orderRepository;
        _mapper = mapper;
    }

    public async Task<IEnumerable<OrderDto>> GetAllAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return _mapper.Map<IEnumerable<OrderDto>>(orders);
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order == null ? null : _mapper.Map<OrderDto>(order);
    }

    public async Task<OrderDto> CreateAsync(OrderInputDto dto)
    {
        var order = _mapper.Map<Order>(dto);
        
        // Force math logic before saving
        CalculateOrderTotals(order); 
        
        var createdOrder = await _orderRepository.CreateAsync(order);
        return _mapper.Map<OrderDto>(createdOrder);
    }

    public async Task<OrderDto?> UpdateAsync(int id, OrderInputDto dto)
    {
        var existingOrder = await _orderRepository.GetByIdAsync(id);
        if (existingOrder == null) return null;

        existingOrder.ClientId = dto.ClientId;
        existingOrder.InvoiceNo = dto.InvoiceNo;
        existingOrder.InvoiceDate = dto.InvoiceDate;
        existingOrder.ReferenceNo = dto.ReferenceNo;
        existingOrder.Note = dto.Note;

        // Clear old items and attach new ones from DTO
        existingOrder.OrderItems.Clear();
        foreach (var itemDto in dto.OrderItems)
        {
            existingOrder.OrderItems.Add(_mapper.Map<OrderItem>(itemDto));
        }

        // Recalculate based on new inputs
        CalculateOrderTotals(existingOrder); 

        var updatedOrder = await _orderRepository.UpdateAsync(existingOrder);
        return _mapper.Map<OrderDto>(updatedOrder);
    }

    private void CalculateOrderTotals(Order order)
    {
        order.TotalExcl = 0;
        order.TotalTax = 0;
        order.TotalIncl = 0;

        foreach (var item in order.OrderItems)
        {
            item.ExclAmount = item.Quantity * item.Price;
            item.TaxAmount = item.ExclAmount * (item.TaxRate / 100);
            item.InclAmount = item.ExclAmount + item.TaxAmount;

            order.TotalExcl += item.ExclAmount;
            order.TotalTax += item.TaxAmount;
            order.TotalIncl += item.InclAmount;
        }
    }
}