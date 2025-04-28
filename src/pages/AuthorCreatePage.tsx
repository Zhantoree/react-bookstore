// src/pages/AuthorCreatePage.tsx
import React from 'react';
import { Form, Input, DatePicker, Button, message } from 'antd';
import { createAuthor } from '../api/authorAPI';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const AuthorCreatePage: React.FC = () => {
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        // Build payload including an empty books list to avoid null issues.
        const authorData = {
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate: values.birthDate ? values.birthDate.toISOString() : null,
            biography: values.biography,
            books: []  // Send an empty list for books.
        };

        try {
            await createAuthor(authorData);
            message.success('Author created successfully!');
            navigate('/authors');
        } catch (error) {
            message.error('Error creating author.');
        }
    };

    return (
        <div>
            <h2>Create Author</h2>
            <Form onFinish={onFinish} layout="vertical">
                <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[{ required: true, message: 'First name is required' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[{ required: true, message: 'Last name is required' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="birthDate"
                    label="Birth Date"
                    rules={[{ required: true, message: 'Birth date is required' }]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    name="biography"
                    label="Biography"
                    rules={[{ required: true, message: 'Biography is required' }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Create Author
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AuthorCreatePage;
