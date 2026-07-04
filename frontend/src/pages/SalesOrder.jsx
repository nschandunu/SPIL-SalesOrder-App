import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function SalesOrder() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [clients, setClients] = useState([]);
    const [itemsList, setItemsList] = useState([]);

    const [formData, setFormData] = useState({
        clientId: '',
        address1: '',
        address2: '',
        address3: '',
        suburb: '',
        state: '',
        postCode: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        referenceNo: '',
        note: '',
        orderItems: []
    });

    const [error, setError] = useState(null);

    // Derived state for the selected client to display addresses
    const selectedClient = clients.find(c => c.id === parseInt(formData.clientId)) || {};

useEffect(() => {
    const fetchData = async () => {
        try {
            // 1. Fetch dropdown data first
            const clientsRes = await api.get('/Clients');
            const itemsRes = await api.get('/Items');
            setClients(clientsRes.data);
            setItemsList(itemsRes.data);

            if (id) {
                const orderRes = await api.get(`/Orders/${id}`);
                const order = orderRes.data;

                // 2. Inject the database data into our React form state
                setFormData({
                    clientId: order.clientId,
                    invoiceNo: order.invoiceNo,
                    // Format DateTime for the HTML date input
                    invoiceDate: order.invoiceDate.split('T')[0],
                    referenceNo: order.referenceNo || '',
                    note: order.note || '',
                    orderItems: order.orderItems.map(item => {
                        const foundItem = itemsRes.data.find(i => i.id === item.itemId);
                        return {
                            itemId: item.itemId,
                            description: foundItem ? foundItem.description : '',
                            note: item.note || '',
                            quantity: item.quantity,
                            price: item.price,
                            taxRate: item.taxRate
                        };
                    })
                });
            }
        } catch (err) {
            console.error("Failed to load data", err);
            toast.error("Failed to load order data.");
        }
    };
    fetchData();
}, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handles auto-filling the address when a customer is selected
    const handleClientChange = (e) => {
        const selectedId = e.target.value;
        const client = clients.find(c => c.id === parseInt(selectedId));

        if (client) {
            setFormData({
                ...formData,
                clientId: selectedId,
                address1: client.address1 || '',
                address2: client.address2 || '',
                address3: client.address3 || '',
                suburb: client.suburb || '',
                state: client.state || '',
                postCode: client.postCode || ''
            });
        } else {
            // Clear fields if they deselect the customer
            setFormData({
                ...formData,
                clientId: selectedId,
                address1: '',
                address2: '',
                address3: '',
                suburb: '',
                state: '',
                postCode: ''
            });
        }
    };

    const addLineItem = () => {
        setFormData({
            ...formData,
            orderItems: [
                ...formData.orderItems,
                { itemId: '', description: '', note: '', quantity: 1, price: 0, taxRate: 0 }
            ]
        });
    };

    const removeLineItem = (index) => {
        const newItems = [...formData.orderItems];
        newItems.splice(index, 1);
        setFormData({ ...formData, orderItems: newItems });
    };

    const handleLineItemChange = (index, field, value) => {
        const newItems = [...formData.orderItems];
        newItems[index][field] = value;

        if (field === 'itemId') {
            const selectedItem = itemsList.find(i => i.id === parseInt(value));
            if (selectedItem) {
                newItems[index].description = selectedItem.description;
                newItems[index].price = selectedItem.defaultPrice;
                newItems[index].taxRate = selectedItem.defaultTaxRate;
            } else {
                newItems[index].description = '';
            }
        }
        
        setFormData({ ...formData, orderItems: newItems });
    };

    // Calculate totals dynamically for the UI display
    const calculateTotals = () => {
        let totalExcl = 0, totalTax = 0, totalIncl = 0;
        
        formData.orderItems.forEach(item => {
            const qty = parseInt(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            const taxRate = parseFloat(item.taxRate) || 0;
            
            const excl = qty * price;
            const tax = excl * (taxRate / 100);
            totalExcl += excl;
            totalTax += tax;
            totalIncl += (excl + tax);
        });

        return { totalExcl, totalTax, totalIncl };
    };

    const totals = calculateTotals();

    // Generate PDF Report
    const generatePDF = () => {
        const doc = new jsPDF();

        // 1. Report Header
        doc.setFontSize(20);
        doc.text("Sales Order Invoice", 14, 22);

        // 2. Customer & Invoice Info
        doc.setFontSize(11);
        doc.setTextColor(100);

        // Safely grab the customer name for the report
        const custName = selectedClient?.customerName || 'Unknown Customer';
        doc.text(`Customer: ${custName}`, 14, 32);
        doc.text(`Invoice No: ${formData.invoiceNo || 'N/A'}`, 140, 32);
        doc.text(`Date: ${formData.invoiceDate}`, 140, 40);
        if (formData.referenceNo) {
            doc.text(`Ref No: ${formData.referenceNo}`, 140, 48);
        }

        // 3. Prepare Table Data
        const tableColumn = ["Item Code", "Description", "Qty", "Price", "Tax %", "Total"];
        const tableRows = [];

        formData.orderItems.forEach(item => {
            const qty = parseInt(item.quantity) || 0;
            const price = parseFloat(item.price) || 0;
            const taxRate = parseFloat(item.taxRate) || 0;
            const excl = qty * price;
            const tax = excl * (taxRate / 100);
            const incl = excl + tax;

            // Find the item code
            const foundItem = itemsList.find(i => i.id === parseInt(item.itemId));

            const itemData = [
                foundItem ? foundItem.itemCode : 'N/A',
                item.description || '-',
                qty,
                price.toFixed(2),
                taxRate.toFixed(2),
                incl.toFixed(2)
            ];
            tableRows.push(itemData);
        });

        // 4. Generate AutoTable (The Vite / ES Module way)
        autoTable(doc, {
            startY: 55,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
            alternateRowStyles: { fillColor: [240, 240, 240] },
        });

        // 5. Add Totals at the bottom right
        // Safely check for finalY in case the table is empty
        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 55;

        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`Total Excl: ${totals.totalExcl.toFixed(2)}`, 140, finalY + 10);
        doc.text(`Total Tax: ${totals.totalTax.toFixed(2)}`, 140, finalY + 18);

        doc.setFont("helvetica", "bold");
        doc.text(`Total Incl: ${totals.totalIncl.toFixed(2)}`, 140, finalY + 26);

        // 6. Trigger the download
        doc.save(`Invoice_${formData.invoiceNo || 'Draft'}.pdf`);
    };

    const handleSave = async () => {
        setError(null);
        try {
            if (!formData.clientId) return setError("Please select a customer.");
            if (!formData.invoiceNo) return setError("Invoice Number is required.");
            if (formData.orderItems.length === 0) return setError("Please add at least one line item.");

            const payload = {
                clientId: parseInt(formData.clientId),
                invoiceNo: formData.invoiceNo,
                invoiceDate: new Date(formData.invoiceDate).toISOString(),
                referenceNo: formData.referenceNo,
                note: formData.note,
                orderItems: formData.orderItems.map(item => ({
                    itemId: parseInt(item.itemId),
                    note: item.note,
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price),
                    taxRate: parseFloat(item.taxRate)
                }))
            };

            // If have an ID, update the existing order (PUT)
            if (id) {
                payload.id = parseInt(id); // Backend requires ID in payload for PUT
                await api.put(`/Orders/${id}`, payload);
                toast.success('Order successfully updated!', {
                    style: { border: '2px solid black', boxShadow: '2px 2px 0px rgba(0,0,0,1)', fontWeight: 'bold' }
                });
            } else {
                // Otherwise, create a new order (POST)
                await api.post('/Orders', payload);
                toast.success('Order successfully saved!', {
                    style: { border: '2px solid black', boxShadow: '2px 2px 0px rgba(0,0,0,1)', fontWeight: 'bold' }
                });
            }

            navigate('/');

        } catch (err) {
            setError(err.response?.data?.title || "Failed to save order. Check your inputs.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
            <div className="w-full max-w-6xl bg-white border-2 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] text-sm">
                
                {/* Header Actions */}
                <div className="border-b-2 border-black bg-gray-200 p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Sales Order Form</h1>
                    <div className="flex gap-4">
                        {/* ONLY show PDF Export if the order is already saved (has an ID) */}
                        {id && (
                            <button
                                onClick={generatePDF}
                                type="button"
                                className="border-2 border-black bg-yellow-400 text-black px-6 py-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-yellow-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
                            >
                                🖨️ Print
                            </button>
                        )}
                        <button
                            onClick={handleSave}
                            className="border-2 border-black bg-blue-500 text-white px-8 py-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-blue-600 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="border-2 border-black bg-white px-6 py-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 border-2 border-black text-red-700 font-bold rounded">{error}</div>}

                    {/* Top Section: Matches Mockup Grid */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        {/* Left Column: Customer & Address */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <label className="w-32 font-bold">Customer Name</label>
                                <select
                                    name="clientId"
                                    value={formData.clientId}
                                    onChange={handleClientChange}
                                    className="flex-1 border-2 border-black p-1 bg-white focus:outline-none"
                                >
                                    <option value="">-- Select Customer --</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.customerName}</option>)}
                                </select>
                            </div>

                            {/* Editable Address Fields */}
                            {['address1', 'address2', 'address3', 'suburb', 'state', 'postCode'].map((field, idx) => (
                                <div key={idx} className="flex items-center">
                                    <label className="w-32 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                        className="flex-1 border-2 border-black p-1 bg-white focus:outline-none"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Right Column: Invoice Details & Notes */}
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <label className="w-28 font-bold">Invoice No.</label>
                                <input 
                                    type="text" name="invoiceNo" value={formData.invoiceNo} onChange={handleInputChange}
                                    className="flex-1 border-2 border-black p-1 bg-white focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="w-28 font-bold">Invoice Date</label>
                                <input 
                                    type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleInputChange}
                                    className="flex-1 border-2 border-black p-1 bg-white focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center">
                                <label className="w-28 font-bold">Reference no</label>
                                <input 
                                    type="text" name="referenceNo" value={formData.referenceNo} onChange={handleInputChange}
                                    className="flex-1 border-2 border-black p-1 bg-white focus:outline-none"
                                />
                            </div>
                            <div className="flex items-start mt-2">
                                <label className="w-28 font-bold pt-1">Note</label>
                                <textarea 
                                    name="note" value={formData.note} onChange={handleInputChange}
                                    className="flex-1 border-2 border-black p-1 bg-white focus:outline-none min-h-[120px]"
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="mb-6 overflow-x-auto">
                        <table className="w-full border-collapse border-2 border-black text-center text-sm">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="border-2 border-black p-2 w-32">Item Code</th>
                                    <th className="border-2 border-black p-2">Description</th>
                                    <th className="border-2 border-black p-2">Note</th>
                                    <th className="border-2 border-black p-2 w-20">Quantity</th>
                                    <th className="border-2 border-black p-2 w-24">Price</th>
                                    <th className="border-2 border-black p-2 w-20">Tax %</th>
                                    <th className="border-2 border-black p-2 w-24">Excl Amount</th>
                                    <th className="border-2 border-black p-2 w-24">Tax Amount</th>
                                    <th className="border-2 border-black p-2 w-24">Incl Amount</th>
                                    <th className="border-2 border-black p-2 w-10">X</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.orderItems.map((line, index) => {
                                    // Calculate line totals for display
                                    const qty = parseInt(line.quantity) || 0;
                                    const price = parseFloat(line.price) || 0;
                                    const taxRate = parseFloat(line.taxRate) || 0;
                                    const excl = qty * price;
                                    const tax = excl * (taxRate / 100);
                                    const incl = excl + tax;

                                    return (
                                        <tr key={index}>
                                            <td className="border-2 border-black p-0">
                                                <select 
                                                    value={line.itemId} 
                                                    onChange={(e) => handleLineItemChange(index, 'itemId', e.target.value)}
                                                    className="w-full h-full p-2 bg-transparent focus:outline-none"
                                                >
                                                    <option value="">Select...</option>
                                                    {itemsList.map(item => (
                                                        <option key={item.id} value={item.id}>{item.itemCode}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="border-2 border-black p-2 bg-gray-100">{line.description}</td>
                                            <td className="border-2 border-black p-0">
                                                <input 
                                                    type="text" value={line.note} 
                                                    onChange={(e) => handleLineItemChange(index, 'note', e.target.value)}
                                                    className="w-full h-full p-2 bg-transparent focus:outline-none"
                                                />
                                            </td>
                                            <td className="border-2 border-black p-0">
                                                <input 
                                                    type="number" min="1" value={line.quantity} 
                                                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                                                    className="w-full h-full p-2 bg-transparent text-center focus:outline-none"
                                                />
                                            </td>
                                            <td className="border-2 border-black p-2 bg-gray-100">{price.toFixed(2)}</td>
                                            <td className="border-2 border-black p-2 bg-gray-100">{taxRate.toFixed(2)}</td>
                                            <td className="border-2 border-black p-2 bg-gray-200">{excl.toFixed(2)}</td>
                                            <td className="border-2 border-black p-2 bg-gray-200">{tax.toFixed(2)}</td>
                                            <td className="border-2 border-black p-2 bg-gray-200 font-bold">{incl.toFixed(2)}</td>
                                            <td className="border-2 border-black p-0">
                                                <button 
                                                    onClick={() => removeLineItem(index)}
                                                    className="w-full h-full py-2 bg-red-400 text-black font-bold hover:bg-red-500"
                                                >
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        
                        <div className="mt-2 flex justify-start">
                             <button 
                                onClick={addLineItem}
                                className="border-2 border-black bg-white font-bold px-4 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                + Add Line Item
                            </button>
                        </div>
                    </div>

                    {/* Footer Totals Section */}
                    <div className="flex justify-end pr-10">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="font-bold">Total Excl</label>
                                <div className="border-2 border-black bg-gray-200 w-32 px-2 py-1 text-right">
                                    {totals.totalExcl.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="font-bold">Total Tax</label>
                                <div className="border-2 border-black bg-gray-200 w-32 px-2 py-1 text-right">
                                    {totals.totalTax.toFixed(2)}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <label className="font-bold">Total Incl</label>
                                <div className="border-2 border-black bg-gray-300 w-32 px-2 py-1 text-right font-bold">
                                    {totals.totalIncl.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}