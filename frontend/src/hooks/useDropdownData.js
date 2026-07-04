import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetchClients, fetchItems } from '../services/orderService';


// Custom hook to fetch and manage the Clients and Items dropdown data

export default function useDropdownData() {
    const [clients, setClients] = useState([]);
    const [itemsList, setItemsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDropdowns = async () => {
            try {
                const [clientsRes, itemsRes] = await Promise.all([
                    fetchClients(),
                    fetchItems()
                ]);
                setClients(clientsRes.data);
                setItemsList(itemsRes.data);
            } catch (err) {
                console.error("Failed to load dropdowns", err);
                toast.error("Failed to load system data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDropdowns();
    }, []);

    return { clients, itemsList, isLoading };
}