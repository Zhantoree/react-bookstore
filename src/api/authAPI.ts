import axiosClient from './axiosClient';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await axiosClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
};
