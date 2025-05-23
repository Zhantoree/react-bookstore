import {createContext} from 'react';
import {AuthState, User} from '../types/auth';

interface AuthContextType extends AuthState {
    login: (token: string, user: User) => void;
    logout: () => void;
    isAdmin: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);