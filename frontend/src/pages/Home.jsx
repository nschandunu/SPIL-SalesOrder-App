import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../redux/slices/orderSlice';

export default function Home() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { orderList, status, error } = useSelector((state) => state.orders);
    
    // NEW: Search state
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    const handleDoubleClick = (id) => {
        navigate(`/order/${id}`);
    };

    // NEW: Filter the orders before rendering them
    const filteredOrders = orderList.filter(order => 
        order.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toString().includes(searchTerm)
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
            <div className="w-full max-w-6xl bg-white border-2 border-black rounded shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                
                <div className="border-b-2 border-black bg-gray-200 p-4 flex justify-between items-center relative">
                    <h1 className="text-xl font-bold absolute left-1/2 transform -translate-x-1/2">
                        Home
                    </h1>
                    
                    {/* NEW: Search Input */}
                    <div className="flex gap-4 w-full justify-between">
                        <input 
                            type="text" 
                            placeholder="Search Invoice or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-2 border-black px-3 py-1 font-semibold focus:outline-none w-64 shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        />
                        <button 
                            onClick={() => navigate('/order')}
                            className="border-2 border-black bg-white px-4 py-1 font-semibold shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-gray-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                        >
                            Add New
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-x-auto">
                    {status === 'loading' && <p className="font-semibold text-gray-600">Loading orders...</p>}
                    {status === 'failed' && <p className="font-semibold text-red-600">Error: {error}</p>}
                    
                    {status === 'succeeded' && (
                        <table className="w-full border-collapse border-2 border-black text-left text-sm">
                            <thead className="bg-gray-300">
                                <tr>
                                    <th className="border-2 border-black p-2">▼ Order ID</th>
                                    <th className="border-2 border-black p-2">▼ Invoice No</th>
                                    <th className="border-2 border-black p-2">▼ Date</th>
                                    <th className="border-2 border-black p-2">▼ Note</th>
                                    <th className="border-2 border-black p-2">▼ Total Excl</th>
                                    <th className="border-2 border-black p-2">▼ Total Tax</th>
                                    <th className="border-2 border-black p-2">▼ Total Incl</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* NEW: Map over filteredOrders instead of orderList */}
                                {filteredOrders.map((order) => (
                                    <tr 
                                        key={order.id} 
                                        onDoubleClick={() => handleDoubleClick(order.id)}
                                        className="hover:bg-blue-100 cursor-pointer transition-colors"
                                        title="Double-click to edit"
                                    >
                                        <td className="border-2 border-black p-2">{order.id}</td>
                                        <td className="border-2 border-black p-2">{order.invoiceNo}</td>
                                        <td className="border-2 border-black p-2">
                                            {new Date(order.invoiceDate).toLocaleDateString()}
                                        </td>
                                        <td className="border-2 border-black p-2 truncate max-w-xs" title={order.note}>
                                            {order.note || '-'}
                                        </td>
                                        <td className="border-2 border-black p-2">{order.totalExcl.toFixed(2)}</td>
                                        <td className="border-2 border-black p-2">{order.totalTax.toFixed(2)}</td>
                                        <td className="border-2 border-black p-2 font-bold">{order.totalIncl.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {status === 'succeeded' && filteredOrders.length === 0 && (
                        <p className="text-center text-gray-500 mt-6 font-semibold">
                            No orders found matching your search.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}