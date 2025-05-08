// src/pages/BookCreatePage.tsx
import React from 'react';
import { Form, Input, InputNumber, DatePicker, Button, message, Select, Spin, Alert } from 'antd';
import { createBook } from '../api/bookAPI';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAuthors } from '../api/authorAPI';
import moment from 'moment';

const { Option } = Select;

const BookCreatePage: React.FC = () => {
    const navigate = useNavigate();

    // Fetch authors to populate the author select dropdown.
    const { data: authors, isLoading: loadingAuthors, error: authorsError } = useQuery(
        ['authors'],
        () => fetchAuthors()
    );

    const onFinish = async (values: any) => {
        // Build the payload for Book creation. Note that we now include an "author" field:
        const bookData = {
            title: values.title,
            isbn: values.isbn,
            publicationDate: values.publicationDate ? values.publicationDate.toISOString() : null,
            price: values.price,
            quantity: values.quantity,
            genre: values.genre,
            description: values.description,
            author: { id: values.authorId }
        };

        try {
            await createBook(bookData);
            message.success('Book created successfully!');
            navigate('/books');
        } catch (error) {
            message.error('Error creating book.');
        }
    };

    if (loadingAuthors) return <Spin tip="Loading authors..." />;
    if (authorsError) return <Alert message={`Error fetching authors: ${authorsError.message}`} type="error" />;

    return (
        <div>
            <h2>Create Book</h2>
            <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="title"
                    label="Title"
                    rules={[{ required: true, message: 'Title is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="isbn"
                    label="ISBN"
                    rules={[{ required: true, message: 'ISBN is required' }]}
                >
                    <Input />
                </Form.Item>


                <div style={{ display: 'flex', justifyContent: 'space-between', width: '500px'}}>
                    <Form.Item
                        name="price"
                        label="Price"
                        rules={[{ required: true, type: 'number', message: 'Price is required' }]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{required: true, message: 'Quantity required'}]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                        name="publicationDate"
                        label="Publication Date"
                        rules={[{ required: true, message: 'Publication date is required' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                </div>


                <Form.Item
                    name="genre"
                    label="Genre"
                    rules={[{ required: true, message: 'Genre is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Description is required' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="authorId"
                    label="Author"
                    rules={[{ required: true, message: 'Author is required' }]}
                >
                    <Select placeholder="Select an author">
                        {authors?.map((author) => (
                            <Option key={author.id} value={author.id}>
                                {author.firstName} {author.lastName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Book
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default BookCreatePage;
