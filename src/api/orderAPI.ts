import axiosClient from './axiosClient';
import { Order, OrderEvent } from '../types';

export const fetchOrders = async (): Promise<Order[]> => {
    const response = await axiosClient.get<Order[]>('/order/');
    return response.data;
};

export const createOrder = async (order: Order): Promise<Order> => {
    const response = await axiosClient.post<Order>('/order/', order);
    return response.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
    const response = await axiosClient.get<Order>(`/order/${id}`);
    return response.data;
};

export const updateOrder = async (id: number, updateData: Partial<Order>): Promise<Order> => {
    const response = await axiosClient.patch<Order>(`/order/${id}`, updateData);
    return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
    await axiosClient.delete(`/order/${id}`);
};

export const updateOrderStatus = async (
    orderId: number,
    event: OrderEvent
): Promise<Order> => {
    const response = await axiosClient.put<Order>(`/order/${orderId}/status`, null, {
        params: { event }
    });
    return response.data;
};
