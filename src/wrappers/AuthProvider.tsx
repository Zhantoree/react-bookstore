import React, {ReactNode, useEffect, useState} from "react";
import {AuthState, User} from "../types/auth";
import axiosClient from "../api/axiosClient";
import {AuthContext} from "../context/AuthContext";


interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [authState, setAuthState] = useState<AuthState>(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        return {
            token,
            user: userStr ? JSON.parse(userStr) : null,
            isAuthenticated: !!token,
        };
    });

    useEffect(() => {
        // Set token in axios headers when it changes
        if (authState.token) {
            axiosClient.defaults.headers.common['Authorization'] = `Bearer ${authState.token}`;
        } else {
            delete axiosClient.defaults.headers.common['Authorization'];
        }
    }, [authState.token]);

    const login = (token: string, role: 'ADMIN' | 'USER') => {
        // Create a basic user object from the token and role
        const user: User = {
            username: 'user', // This would typically come from decoding the JWT
            email: 'user@example.com', // This would typically come from decoding the JWT
            role: role
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setAuthState({
            token,
            user,
            isAuthenticated: true,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
        });
    };

    const isAdmin = () => {
        return authState.user?.role === 'ADMIN';
    };

    return (
        <AuthContext.Provider value={{...authState, login, logout, isAdmin}}>
            {children}
        </AuthContext.Provider>
    );
};