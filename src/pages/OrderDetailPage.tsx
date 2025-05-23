// src/pages/OrderDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, updateOrder, deleteOrder } from '../api/orderAPI';
import { Form, Input, DatePicker, Select, Button, Spin, message } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { Order } from '../types';
import {useAuth} from "../hooks/useAuth";

const { Option } = Select;

const OrderDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: order, isLoading } = useQuery<Order, Error>(
        ['order', id],
        () => getOrderById(Number(id))
    );

    const [form] = Form.useForm();

    useEffect(() => {
        if (order) {
            form.setFieldsValue({
                customerName: order.customerName,
                orderDate: order.orderDate ? moment(order.orderDate) : undefined,
                status: order.status,
                // Assuming the order contains a book object with an id field.
                bookId: order.book ? order.book.id : undefined,
            });
        }
    }, [order, form]);

    const onFinish = async (values: any) => {
        const updateData = {
            book: { id: values.bookId },
            customerName: values.customerName,
            orderDate: values.orderDate ? values.orderDate.toISOString() : null,
            status: values.status,
        };
        try {
            await updateOrder(Number(id), updateData);
            message.success('Order updated successfully!');
            queryClient.invalidateQueries(['order', id]);
        } catch (error) {
            message.error('Error updating order.');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOrder(Number(id));
            message.success('Order deleted successfully!');
            navigate('/orders');
        } catch (error) {
            message.error('Error deleting order.');
        }
    };

    if (isLoading) return <Spin tip="Loading order..." />;

    return (
        <div>
            <h2>Order Detail</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="bookId"
                    label="Book ID"
                    rules={[{ required: true, type: 'number', message: 'Book ID is required' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    name="customerName"
                    label="Customer Name"
                    rules={[{ required: true, message: 'Customer name is required' }]}
                >
                    <Input disabled defaultValue={user?.username} />
                </Form.Item>
                <Form.Item
                    name="orderDate"
                    label="Order Date"
                    rules={[{ required: true, message: 'Order date is required' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Status is required' }]}
                >
                    <Select>
                        <Option value="NEW">NEW</Option>
                        <Option value="UPDATED">UPDATED</Option>
                        <Option value="CANCELLED">CANCELLED</Option>
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Order
                    </Button>
                    <Button danger onClick={handleDelete} style={{ marginLeft: '1rem' }}>
                        Delete Order
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default OrderDetailPage;
