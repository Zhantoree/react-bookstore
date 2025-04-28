// src/pages/AuthorDetailPage.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuthorById, updateAuthor, deleteAuthor } from '../api/authorAPI';
import { Form, Input, DatePicker, Button, Spin, message } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import { Author } from '../types';

const AuthorDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: author, isLoading } = useQuery<Author, Error>(
        ['author', id],
        () => getAuthorById(Number(id))
    );

    const [form] = Form.useForm();

    useEffect(() => {
        if (author) {
            form.setFieldsValue({
                firstName: author.firstName,
                lastName: author.lastName,
                birthDate: author.birthDate ? moment(author.birthDate) : undefined,
                biography: author.biography,
            });
        }
    }, [author, form]);

    const onFinish = async (values: any) => {
        const updateData = {
            firstName: values.firstName,
            lastName: values.lastName,
            birthDate: values.birthDate ? values.birthDate.toISOString() : null,
            biography: values.biography,
            // books field is omitted here.
        };
        try {
            await updateAuthor(Number(id), updateData);
            message.success('Author updated successfully!');
            queryClient.invalidateQueries(['author', id]);
        } catch (error) {
            message.error('Error updating author.');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteAuthor(Number(id));
            message.success('Author deleted successfully!');
            navigate('/authors');
        } catch (error) {
            message.error('Error deleting author.');
        }
    };

    if (isLoading) return <Spin tip="Loading author..." />;

    return (
        <div>
            <h2>Author Detail</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: 'First name is required' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: 'Last name is required' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="birthDate" label="Birth Date" rules={[{ required: true, message: 'Birth date is required' }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="biography" label="Biography" rules={[{ required: true, message: 'Biography is required' }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Author
                    </Button>
                    <Button danger onClick={handleDelete} style={{ marginLeft: '1rem' }}>
                        Delete Author
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AuthorDetailPage;
