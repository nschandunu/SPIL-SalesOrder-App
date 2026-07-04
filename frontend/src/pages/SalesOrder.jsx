import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function SalesOrder() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Dropdown Data States
    const [clients, setClients] = useState([]);
    const [itemsList, setItemsList] = useState([]);

    const [formData, setFormData] = useState({
        clientId: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        referenceNo: '',
        note: '',
        orderItems: []
    });

    const [error, setError] = useState(null);

    // 1. Fetch Dropdown Data on Load
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const clientsRes = await api.get('/Clients');
                const itemsRes = await api.get('/Items');
                setClients(clientsRes.data);
                setItemsList(itemsRes.data);
            } catch (err) {
                console.error("Failed to load dropdowns", err);
            }
        };
        fetchDropdownData();
    }, []);

    // 2. Handle Basic Input Changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Dynamic Line Item Management
    const addLineItem = () => {
        setFormData({
            ...formData,
            orderItems: [
                ...formData.orderItems,
                { itemId: '', quantity: 1, price: 0, taxRate: 0, note: '' }
            ]
        });
    };

    const removeLineItem = (index) => {
        const newItems = [...formData.orderItems];
        newItems.splice(index, 1);
        setFormData({ ...formData, orderItems: newItems });
    };

    // 4. Handle Item Selection (Auto-fills price and tax)
    const handleLineItemChange = (index, field, value) => {
        const newItems = [...formData.orderItems];
        newItems[index][field] = value;

        if (field === 'itemId') {
            const selectedItem = itemsList.find(i => i.id === parseInt(value));
            if (selectedItem) {
                newItems[index].price = selectedItem.defaultPrice;
                newItems[index].taxRate = selectedItem.defaultTaxRate;
            }
        }
        
        setFormData({ ...formData, orderItems: newItems });
    };

    // 5. Submit to Backend
    const handleSave = async () => {
        setError(null);
        try {
            // Validate basic rules before sending
            if (!formData.clientId) return setError("Please select a customer.");
            if (!formData.invoiceNo) return setError("Invoice Number is required.");
            if (formData.orderItems.length === 0) return setError("Please add at least one line item.");

            // Format data for the backend DTO
            const payload = {
                ...formData,
                clientId: parseInt(formData.clientId),
                // Ensure the date is a valid DateTime string for .NET
                invoiceDate: new Date(formData.invoiceDate).toISOString(),
                orderItems: formData.orderItems.map(item => ({
                    ...item,
                    itemId: parseInt(item.itemId),
                    quantity: parseInt(item.quantity),
                    price: parseFloat(item.price),
                    taxRate: parseFloat(item.taxRate)
                }))
            };

            // Send it to secure backend API
            await api.post('/Orders', payload);
            
            // Trigger the popup!
            toast.success('Order successfully saved!', {
                style: {
                    border: '2px solid black',
                    boxShadow: '2px 2px 0px rgba(0,0,0,1)',
                    fontWeight: 'bold'
                }
            });
            
            // Navigate back to home
            navigate('/');
            
            navigate('/');
            
        } catch (err) {
            console.error(err);
            // Catch the 400 Bad Request validations from .NET API
            setError(err.response?.data?.title || "Failed to save order. Check your inputs.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
            <div className="w-full max-w-5xl bg-white border-2 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                
                {/* Header Actions */}
                <div className="border-b-2 border-black bg-gray-200 p-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold">Sales Order Form</h1>
                    <div className="space-x-4">
                        <button 
                            onClick={handleSave}
                            className="border-2 border-black bg-blue-400 text-white px-6 py-1 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-blue-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Save
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="border-2 border-black bg-white px-4 py-1 font-semibold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 font-bold rounded">{error}</div>}

                    {/* Order Header Info */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block font-bold text-sm mb-1">Customer <span className="text-red-500">*</span></label>
                            <select 
                                name="clientId" 
                                value={formData.clientId} 
                                onChange={handleInputChange}
                                className="w-full border-2 border-black p-2 bg-gray-50 focus:outline-none focus:bg-white"
                            >
                                <option value="">-- Select Customer --</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.customerName}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Invoice Number <span className="text-red-500">*</span></label>
                            <input 
                                type="text" name="invoiceNo" value={formData.invoiceNo} onChange={handleInputChange}
                                className="w-full border-2 border-black p-2 bg-gray-50 focus:outline-none focus:bg-white"
                                placeholder="e.g. INV-1005"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Date <span className="text-red-500">*</span></label>
                            <input 
                                type="date" name="invoiceDate" value={formData.invoiceDate} onChange={handleInputChange}
                                className="w-full border-2 border-black p-2 bg-gray-50 focus:outline-none focus:bg-white"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-sm mb-1">Reference No</label>
                            <input 
                                type="text" name="referenceNo" value={formData.referenceNo} onChange={handleInputChange}
                                className="w-full border-2 border-black p-2 bg-gray-50 focus:outline-none focus:bg-white"
                            />
                        </div>
                    </div>

                    {/* Line Items Section */}
                    <div className="border-t-2 border-black pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Order Lines</h2>
                            <button 
                                onClick={addLineItem}
                                className="border-2 border-black bg-green-400 font-bold px-3 py-1 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-green-500 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                + Add Line
                            </button>
                        </div>

                        {formData.orderItems.length === 0 ? (
                            <p className="text-gray-500 italic">No items added yet.</p>
                        ) : (
                            <table className="w-full border-collapse border-2 border-black text-left text-sm mb-6">
                                <thead className="bg-gray-300">
                                    <tr>
                                        <th className="border-2 border-black p-2">Item Code</th>
                                        <th className="border-2 border-black p-2">Quantity</th>
                                        <th className="border-2 border-black p-2">Unit Price</th>
                                        <th className="border-2 border-black p-2">Tax Rate %</th>
                                        <th className="border-2 border-black p-2 w-10 text-center">X</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.orderItems.map((line, index) => (
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
                                            <td className="border-2 border-black p-0">
                                                <input 
                                                    type="number" min="1" value={line.quantity} 
                                                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                                                    className="w-full p-2 bg-transparent focus:outline-none"
                                                />
                                            </td>
                                            <td className="border-2 border-black p-2 bg-gray-100">
                                                {line.price.toFixed(2)}
                                            </td>
                                            <td className="border-2 border-black p-2 bg-gray-100">
                                                {line.taxRate.toFixed(2)}%
                                            </td>
                                            <td className="border-2 border-black p-0 text-center">
                                                <button 
                                                    onClick={() => removeLineItem(index)}
                                                    className="w-full h-full py-2 bg-red-400 text-white font-bold hover:bg-red-500 transition-colors"
                                                >
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        <div className="mt-4">
                            <label className="block font-bold text-sm mb-1">Order Notes</label>
                            <textarea 
                                name="note" value={formData.note} onChange={handleInputChange}
                                className="w-full border-2 border-black p-2 bg-gray-50 focus:outline-none focus:bg-white"
                                rows="3"
                                placeholder="Internal notes or instructions..."
                            ></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}