import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authAPI';
import { LoginCredentials } from '../types/auth';
import {useAuth} from "../hooks/useAuth";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const onFinish = async (values: LoginCredentials) => {
        try {
            const response = await login(values);
            authLogin(response.token, response.role);
            message.success('Login successful!');
            navigate('/');
        } catch (error) {
            message.error('Login failed. Please check your credentials.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h2>Login</h2>
            <Form layout="vertical" onFinish={onFinish}>
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
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Login
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                Don't have an account? <Link to="/register">Register now</Link>
            </div>
        </div>
    );
};

export default LoginPage;
