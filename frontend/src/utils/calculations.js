
// Calculates the exclusive, tax, and inclusive totals for an array of order items.

export const calculateOrderTotals = (orderItems) => {
    let totalExcl = 0, totalTax = 0, totalIncl = 0;
    
    orderItems.forEach(item => {
        const excl = (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0);
        const tax = excl * ((parseFloat(item.taxRate) || 0) / 100);
        totalExcl += excl;
        totalTax += tax;
        totalIncl += (excl + tax);
    });
    
    return { totalExcl, totalTax, totalIncl };
};