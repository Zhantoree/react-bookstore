// src/pages/OrderCreatePage.tsx
import React, {useState} from 'react';
import {Form, Input, Button, message, Select, Spin, InputNumber} from 'antd';
import {createOrder} from '../api/orderAPI';
import {useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {fetchBooks} from '../api/bookAPI';
import {Book} from '../types';

const {Option} = Select;

const OrderCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined)

    // Fetch existing books so the user can select from valid options.
    const {data: books, isLoading: booksLoading, error: booksError} = useQuery<Book[], Error>(
        ['books'],
        () => fetchBooks(),
        {
            retry: false,
        }
    );

    const onFinish = async (values: any) => {
        // Build order payload with the selected valid book ID.
        const orderData = {
            book: {id: values.bookId},
            customerName: values.customerName,
            quantity: values.quantity,
        };
        console.log('values', values);

        try {
            await createOrder(orderData);
            message.success('Order created successfully!');
            navigate('/orders');
        } catch (error) {
            message.error('Error creating order.');
        }
    };

    if (booksLoading) return <Spin tip="Loading books..."/>;
    if (booksError) return <div>Error loading books: {booksError.message}</div>;

    return (
        <div>
            <h2>Create Order</h2>
            <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="bookId"
                    label="Select Book"
                    rules={[{required: true, message: 'Please select a book'}]}
                >
                    <Select placeholder="Select a book" onSelect={(id) => setSelectedBook(books?.find(book => book?.id === id))}>
                        {books.map((book) => (
                            <Option key={book.id} value={book.id}>
                                {book.title} (ID: {book.id})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="customerName"
                    label="Customer Name"
                    rules={[{required: true, message: 'Customer name is required'}]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{required: true, message: 'Quantity required'}]}
                >
                    <InputNumber min={1} disabled={!selectedBook} max={selectedBook?.quantity || 1000}/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Order
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default OrderCreatePage;
