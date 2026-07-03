import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await api.get('/Orders');
    return response.data;
});

const initialState = {
    orderList: [],
    activeOrder: null,
    status: 'idle',
    error: null
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        setActiveOrder: (state, action) => {
            state.activeOrder = action.payload;
        },
        clearActiveOrder: (state) => {
            state.activeOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orderList = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});

export const { setActiveOrder, clearActiveOrder } = orderSlice.actions;
export default orderSlice.reducer;