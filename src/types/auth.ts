export interface User {
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
    id: number;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    username: string;
    password: string;
}

export interface AuthResponse extends User{
    token: string;
}
