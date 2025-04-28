// src/pages/BookDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, updateBook, deleteBook } from '../api/bookAPI';
import { Form, Input, InputNumber, DatePicker, Button, Spin, message } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { Book } from '../types';

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: book, isLoading } = useQuery<Book, Error>(
        ['book', id],
        () => getBookById(Number(id))
    );

    const [form] = Form.useForm();

    useEffect(() => {
        if (book) {
            form.setFieldsValue({
                title: book.title,
                isbn: book.isbn,
                publicationDate: book.publicationDate ? moment(book.publicationDate) : undefined,
                price: book.price,
                genre: book.genre,
                description: book.description,
            });
        }
    }, [book, form]);

    const onFinish = async (values: any) => {
        const updateData = {
            title: values.title,
            isbn: values.isbn,
            publicationDate: values.publicationDate ? values.publicationDate.toISOString() : null,
            price: values.price,
            genre: values.genre,
            description: values.description,
        };
        try {
            await updateBook(Number(id), updateData);
            message.success('Book updated successfully!');
            queryClient.invalidateQueries(['book', id]);
        } catch (error) {
            message.error('Error updating book.');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBook(Number(id));
            message.success('Book deleted successfully!');
            navigate('/books');
        } catch (error) {
            message.error('Error deleting book.');
        }
    };

    if (isLoading) return <Spin tip="Loading book..." />;

    return (
        <div>
            <h2>Book Detail</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Title is required' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="isbn" label="ISBN" rules={[{ required: true, message: 'ISBN is required' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="publicationDate" label="Publication Date" rules={[{ required: true, message: 'Publication date is required' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true, type: 'number', message: 'Price is required' }]}>
                    <InputNumber />
                </Form.Item>
                <Form.Item name="genre" label="Genre" rules={[{ required: true, message: 'Genre is required' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Description is required' }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Book
                    </Button>
                    <Button danger onClick={handleDelete} style={{ marginLeft: '1rem' }}>
                        Delete Book
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BookDetailPage;
