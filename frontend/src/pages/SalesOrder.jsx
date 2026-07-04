import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';
import toast from 'react-hot-toast';
import api from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import our new architectural primitives
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Table from '../components/Table';

export default function SalesOrder() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();

    const [clients, setClients] = useState([]);
    const [itemsList, setItemsList] = useState([]);

    const [formData, setFormData] = useState({
        clientId: '',
        address1: '', address2: '', address3: '',
        suburb: '', state: '', postCode: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        referenceNo: '',
        note: '',
        orderItems: []
    });

    const [error, setError] = useState(null);

    const selectedClient = clients.find(c => c.id === parseInt(formData.clientId)) || {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const clientsRes = await api.get('/Clients');
                const itemsRes = await api.get('/Items');
                setClients(clientsRes.data);
                setItemsList(itemsRes.data);

                if (id) {
                    const orderRes = await api.get(`/Orders/${id}`);
                    const order = orderRes.data;
                    
                    setFormData({
                        clientId: order.clientId,
                        address1: order.client?.address1 || '',
                        address2: order.client?.address2 || '',
                        address3: order.client?.address3 || '',
                        suburb: order.client?.suburb || '',
                        state: order.client?.state || '',
                        postCode: order.client?.postCode || '',
                        invoiceNo: order.invoiceNo,
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
                toast.error("Failed to load data.");
            }
        };
        fetchData();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
            setFormData({
                ...formData, clientId: selectedId,
                address1: '', address2: '', address3: '', suburb: '', state: '', postCode: ''
            });
        }
    };

    const addLineItem = () => {
        setFormData({
            ...formData,
            orderItems: [...formData.orderItems, { itemId: '', description: '', note: '', quantity: 1, price: 0, taxRate: 0 }]
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

    const calculateTotals = () => {
        let totalExcl = 0, totalTax = 0, totalIncl = 0;
        formData.orderItems.forEach(item => {
            const excl = (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0);
            const tax = excl * ((parseFloat(item.taxRate) || 0) / 100);
            totalExcl += excl;
            totalTax += tax;
            totalIncl += (excl + tax);
        });
        return { totalExcl, totalTax, totalIncl };
    };

    const totals = calculateTotals();

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

            if (id) {
                payload.id = parseInt(id);
                await api.put(`/Orders/${id}`, payload);
                await dispatch(fetchOrders());
                toast.success('Order successfully updated!');
            } else {
                await api.post('/Orders', payload);
                await dispatch(fetchOrders());
                toast.success('Order successfully saved!');
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.title || "Failed to save order.");
        }
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(33, 37, 41);
        doc.text("SPIL LABS", 14, 22);
        doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(100, 100, 100);
        doc.text("No 04, Pagoda Road,\nNugegoda, Sri Lanka\ninfo@spil.com", 14, 28);
        doc.setFont("helvetica", "bold"); doc.setFontSize(28); doc.setTextColor(0, 102, 204);
        doc.text("INVOICE", 195, 30, { align: "right" });
        doc.setDrawColor(220, 220, 220); doc.setLineWidth(0.5); doc.line(14, 40, 195, 40);
        doc.setFontSize(11); doc.setTextColor(33, 37, 41); doc.text("BILL TO:", 14, 50);
        
        const addressLines = [
            selectedClient?.customerName || 'Unknown Customer',
            formData.address1, formData.address2, formData.suburb,
            formData.state ? `${formData.state} ${formData.postCode}` : formData.postCode
        ].filter(Boolean);

        let currentY = 56;
        doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
        addressLines.forEach(line => { doc.text(line, 14, currentY); currentY += 5; });

        doc.setFont("helvetica", "bold"); doc.setTextColor(33, 37, 41); doc.setFontSize(10);
        doc.text("Invoice No:", 130, 50); doc.text("Date:", 130, 56); doc.text("Reference No:", 130, 62);
        doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
        doc.text(formData.invoiceNo || 'DRAFT', 195, 50, { align: "right" });
        doc.text(formData.invoiceDate, 195, 56, { align: "right" });
        doc.text(formData.referenceNo || '-', 195, 62, { align: "right" });

        const tableColumn = ["Item Code", "Description", "Qty", "Price", "Tax %", "Total"];
        const tableRows = formData.orderItems.map(item => {
            const excl = (parseInt(item.quantity) || 0) * (parseFloat(item.price) || 0);
            const foundItem = itemsList.find(i => i.id === parseInt(item.itemId));
            return [
                foundItem ? foundItem.itemCode : '-', item.description || '-',
                parseInt(item.quantity) || 0, parseFloat(item.price || 0).toFixed(2),
                parseFloat(item.taxRate || 0).toFixed(2), (excl + excl * (parseFloat(item.taxRate || 0) / 100)).toFixed(2)
            ];
        });

        autoTable(doc, {
            startY: Math.max(currentY + 5, 75), head: [tableColumn], body: tableRows, theme: 'striped',
            headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
            bodyStyles: { textColor: [50, 50, 50], halign: 'center' }, columnStyles: { 1: { halign: 'left' } },
            alternateRowStyles: { fillColor: [245, 247, 250] }, margin: { left: 14, right: 14 }
        });

        const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 75;
        if (formData.note) {
            doc.setFont("helvetica", "bold"); doc.setTextColor(33, 37, 41); doc.text("Order Notes:", 14, finalY + 12);
            doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80);
            doc.text(doc.splitTextToSize(formData.note, 100), 14, finalY + 18);
        }

        doc.text("Total Excl:", 140, finalY + 12); doc.text(totals.totalExcl.toFixed(2), 195, finalY + 12, { align: "right" });
        doc.text("Total Tax:", 140, finalY + 18); doc.text(totals.totalTax.toFixed(2), 195, finalY + 18, { align: "right" });
        doc.setDrawColor(200, 200, 200); doc.line(140, finalY + 22, 195, finalY + 22);
        doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(33, 37, 41);
        doc.text("Total Incl:", 140, finalY + 28); doc.text(totals.totalIncl.toFixed(2), 195, finalY + 28, { align: "right" });

        doc.save(`Invoice_${formData.invoiceNo || 'Draft'}.pdf`);
    };

    // Prepare dropdown options for our custom Select component
    const clientOptions = clients.map(c => ({ label: c.customerName, value: c.id }));
    const itemOptions = itemsList.map(i => ({ label: i.itemCode, value: i.id }));

    // Define table headers
    const tableHeaders = [
        { label: "Item Code", className: "w-32" }, { label: "Description" }, { label: "Note" },
        { label: "Quantity", className: "w-20" }, { label: "Price", className: "w-24" },
        { label: "Tax %", className: "w-20" }, { label: "Excl Amount", className: "w-24" },
        { label: "Tax Amount", className: "w-24" }, { label: "Total Amount", className: "w-24" },
        { label: "X", className: "print:hidden w-10 text-center" }
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center print:p-0 print:bg-white">
            <div className="w-full max-w-6xl bg-white border-2 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)] text-sm print:border-none print:shadow-none print:max-w-full print:w-full">
                
                <div className="border-b-2 border-black bg-gray-200 p-4 flex justify-between items-center print:hidden">
                    <h1 className="text-xl font-bold">Sales Order</h1>
                    <div className="flex gap-4">
                        {id && <Button variant="warning" onClick={generatePDF}>🖨️ Print</Button>}
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                        <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
                    </div>
                </div>

                <div className="p-6">
                    {error && <div className="mb-4 p-3 bg-red-100 border-2 border-black text-red-700 font-bold rounded">{error}</div>}

                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="space-y-3">
                            <Select label="Customer Name" name="clientId" value={formData.clientId} onChange={handleClientChange} options={clientOptions} required />
                            {['address1', 'address2', 'address3', 'suburb', 'state', 'postCode'].map((field, idx) => (
                                <Input key={idx} label={field.replace(/([A-Z])/g, ' $1').trim()} name={field} value={formData[field]} onChange={handleInputChange} className="capitalize" />
                            ))}
                        </div>

                        <div className="space-y-3">
                            <Input label="Invoice No." name="invoiceNo" value={formData.invoiceNo} onChange={handleInputChange} required />
                            <Input label="Invoice Date" name="invoiceDate" type="date" value={formData.invoiceDate} onChange={handleInputChange} required />
                            <Input label="Reference No" name="referenceNo" value={formData.referenceNo} onChange={handleInputChange} />
                            <div className="flex items-start mt-2 w-full">
                                <label className="w-32 font-bold text-sm pt-1">Note</label>
                                <textarea name="note" value={formData.note} onChange={handleInputChange} className="flex-1 border-2 border-black p-1 bg-white focus:outline-none min-h-[120px]"></textarea>
                            </div>
                        </div>
                    </div>

                    <Table headers={tableHeaders} className="mb-6">
                        {formData.orderItems.map((line, index) => {
                            const excl = (parseInt(line.quantity) || 0) * (parseFloat(line.price) || 0);
                            const tax = excl * ((parseFloat(line.taxRate) || 0) / 100);
                            return (
                                <tr key={index}>
                                    <td className="border-2 border-black p-0">
                                        <Select name="itemId" value={line.itemId} onChange={(e) => handleLineItemChange(index, 'itemId', e.target.value)} options={itemOptions} className="border-none w-full h-full" />
                                    </td>
                                    <td className="border-2 border-black p-2 bg-gray-100">{line.description}</td>
                                    <td className="border-2 border-black p-0">
                                        <Input name="note" value={line.note} onChange={(e) => handleLineItemChange(index, 'note', e.target.value)} className="border-none w-full h-full p-2" />
                                    </td>
                                    <td className="border-2 border-black p-0">
                                        <Input type="number" min="1" value={line.quantity} onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)} className="border-none w-full h-full text-center p-2" />
                                    </td>
                                    <td className="border-2 border-black p-2 bg-gray-100">{parseFloat(line.price || 0).toFixed(2)}</td>
                                    <td className="border-2 border-black p-2 bg-gray-100 print:hidden">{parseFloat(line.taxRate || 0).toFixed(2)}</td>
                                    <td className="border-2 border-black p-2 bg-gray-200 print:hidden">{excl.toFixed(2)}</td>
                                    <td className="border-2 border-black p-2 bg-gray-200 print:hidden">{tax.toFixed(2)}</td>
                                    <td className="border-2 border-black p-2 bg-gray-200 font-bold">{(excl + tax).toFixed(2)}</td>
                                    <td className="border-2 border-black p-0 print:hidden">
                                        <button onClick={() => removeLineItem(index)} className="w-full h-full py-2 bg-red-400 text-black font-bold hover:bg-red-500">X</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </Table>
                    
                    <div className="mt-2 flex justify-start print:hidden">
                        <Button variant="secondary" onClick={addLineItem}>+ Add Line Item</Button>
                    </div>

                    <div className="flex justify-end pr-10 mt-6">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between items-center"><label className="font-bold">Total Excl</label><div className="border-2 border-black bg-gray-200 w-32 px-2 py-1 text-right">{totals.totalExcl.toFixed(2)}</div></div>
                            <div className="flex justify-between items-center"><label className="font-bold">Total Tax</label><div className="border-2 border-black bg-gray-200 w-32 px-2 py-1 text-right">{totals.totalTax.toFixed(2)}</div></div>
                            <div className="flex justify-between items-center"><label className="font-bold">Total Incl</label><div className="border-2 border-black bg-gray-300 w-32 px-2 py-1 text-right font-bold">{totals.totalIncl.toFixed(2)}</div></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}