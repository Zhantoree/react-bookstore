// src/pages/OrderCreatePage.tsx
import React, {useState} from 'react';
import {Form, Input, Button, message, Select, Spin, InputNumber} from 'antd';
import {createOrder} from '../api/orderAPI';
import {useLocation, useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {fetchBooks} from '../api/bookAPI';
import {Book} from '../types';
import {useAuth} from "../hooks/useAuth";

const {Option} = Select;

const OrderCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const {state} = useLocation();
    const { user } = useAuth();

    const [selectedBook, setSelectedBook] = useState<Book | undefined>(state?.book || undefined)

    console.log('state?.book', state?.book)
    console.log('selectedBook', selectedBook)

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
            customerName: user?.username,
            quantity: values.quantity,
            userId: user?.id
        };

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
            <Form onFinish={onFinish} layout="vertical" defaultValue={{
                bookId: '',
                customerName: user?.username,
                quantity: 1,
            }}>
                <Form.Item
                    name="bookId"
                    label="Select Book"
                    rules={[{required: true, message: 'Please select a book'}]}
                >
                    <Select defaultValue={selectedBook?.id} placeholder="Select a book" onSelect={(id) => setSelectedBook(books?.find(book => book?.id === id))}>
                        {books.map((book) => book.quantity > 0 && (
                            <Option key={book.id} value={book.id}>
                                {book.title} (ID: {book.id})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="customerName"
                    label="Customer Name"
                >
                    <Input disabled defaultValue={user?.username}/>
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
