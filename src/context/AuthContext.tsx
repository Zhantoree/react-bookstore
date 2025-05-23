import {createContext} from 'react';
import {AuthState} from '../types/auth';

interface AuthContextType extends AuthState {
    login: (token: string, role: 'ADMIN' | 'USER') => void;
    logout: () => void;
    isAdmin: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);