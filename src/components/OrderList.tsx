// src/components/OrderList.tsx
import React from 'react';
import { List, Button, Spin, Alert, Space } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders, updateOrderStatus } from '../api/orderAPI';
import { Order, OrderEvent, OrderStatus } from '../types';
import styles from './OrderList.module.scss';
import { Link } from 'react-router-dom';

// Helper: Determine available events based on current order status.
const getAvailableEvents = (status: OrderStatus): OrderEvent[] => {
    switch (status) {
        case OrderStatus.NEW:
            return [OrderEvent.CONFIRM, OrderEvent.CANCEL];
        case OrderStatus.CONFIRMED:
            return [OrderEvent.PAY, OrderEvent.CANCEL];
        case OrderStatus.PAID:
            return [OrderEvent.SHIP, OrderEvent.CANCEL];
        case OrderStatus.SHIPPED:
            return [OrderEvent.DELIVER, OrderEvent.CANCEL];
        case OrderStatus.DELIVERED:
            // Depending on your business rule, maybe allow cancellation from delivered state.
            return [];
        default:
            return [];
    }
};

const OrderList: React.FC = () => {
    const { data, isLoading, error, refetch } = useQuery<Order[], Error>(
        ['orders'],
        () => fetchOrders(),
        { keepPreviousData: true, retry: false }
    );

    const handleStatusUpdate = async (orderId: number, event: OrderEvent) => {
        try {
            await updateOrderStatus(orderId, event);
            refetch();
        } catch (e) {
            console.error('Error updating order status:', e);
        }
    };

    if (isLoading) return <Spin tip="Loading orders..." />;
    if (error && error?.status !== 404) return <Alert message="Error fetching orders" type="error" />;

    return (
        <div className={styles.orderList}>
            <div style={{ marginBottom: '1rem' }}>
                <Link to="/orders/create">
                    <Button type="primary">Create Order</Button>
                </Link>
            </div>
            <List
                bordered
                dataSource={data || []}
                renderItem={(order) => {
                    const availableEvents = getAvailableEvents(order.status as OrderStatus);
                    return (
                        <List.Item key={order.id}>
                            <div>
                                <Link to={`/orders/${order.id}`}>
                                    Order #{order.id} - {order.orderDate} - Status: {order.status}
                                </Link>
                            </div>
                            <div>
                                <Space>
                                    {availableEvents.map((event) => (
                                        <Button
                                            key={event}
                                            type="primary"
                                            onClick={() => handleStatusUpdate(order.id!, event)}
                                        >
                                            {event}
                                        </Button>
                                    ))}
                                </Space>
                            </div>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default OrderList;
