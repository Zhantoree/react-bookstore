import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authAPI';
import { RegisterCredentials } from '../types/auth';
import {useAuth} from "../hooks/useAuth";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const onFinish = async (values: RegisterCredentials) => {
        try {
            const response = await register(values);
            authLogin(response.token, response.role);
            message.success('Registration successful!');
            navigate('/');
        } catch (error) {
            message.error('Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h2>Register</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="username"
                    label="Username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        { required: true, message: 'Please input your password!' },
                        { min: 8, message: 'Password must be at least 8 characters!' }
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Please confirm your password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The two passwords do not match!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Register
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                Already have an account? <Link to="/login">Login</Link>
            </div>
        </div>
    );
};

export default RegisterPage;
