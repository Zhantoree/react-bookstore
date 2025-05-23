import React from 'react';
import {List, Button, Spin, Alert, Space, Typography} from 'antd';
import { useQuery } from '@tanstack/react-query';
import {fetchOrders, fetchOrdersByUserId, updateOrderStatus} from '../api/orderAPI';
import { Order, OrderEvent, OrderStatus } from '../types';
import styles from './OrderList.module.scss';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../hooks/useAuth";

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
    const { isAdmin, user } = useAuth()
    const { data, isLoading, error, refetch } = useQuery<Order[], Error>(
        ['orders'],
        () => isAdmin() ? fetchOrders() : fetchOrdersByUserId(user?.id),
        {  retry: false }
    );


    const handleStatusUpdate = async (orderId: number, event: OrderEvent, order: Order) => {
        try {
            const updateStatusData = {
                bookId: order.book?.id,
                orderId: orderId,
                event: event,
                executorId: null,
                description: null,
            }

            await updateOrderStatus(updateStatusData);
            refetch();
        } catch (e) {
            console.error('Error updating order status:', e);
        }
    };

    if (isLoading) return <Spin tip="Loading orders..." />;
    if (error && error?.status !== 404) return <Alert message="Error fetching orders" type="error" />;
    console.log('data', data)
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
                                {
                                    isAdmin() ? (
                                        <Link to={`/orders/${order.id}`}>
                                            Order #{order.id} - {order.orderDate} - Status: {order.status}
                                        </Link>
                                    ) : (
                                        <>
                                            Order #{order.id} - {order.orderDate} - <Typography.Text style={{color: '#1677ff'}}>Status: {order.status}</Typography.Text>
                                        </>
                                    )
                                }
                            </div>
                            {
                                isAdmin() && (
                                    <div>
                                        <Space>
                                            {availableEvents.map((event) => (
                                                <Button
                                                    key={event}
                                                    type="primary"
                                                    onClick={() => handleStatusUpdate(order.id!, event, order)}
                                                >
                                                    {event}
                                                </Button>
                                            ))}
                                        </Space>
                                    </div>
                                )
                            }
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default OrderList;
