export interface Author {
    id?: number;
    firstName: string;
    lastName: string;
    // Add additional properties if needed
}

export interface Book {
    id?: number;
    title: string;
    price: number;
    // Add additional properties if needed
}

export interface Order {
    id?: number;
    orderDate: string;
    status: string;
    // Add additional fields as needed
}


// src/types/index.ts
export enum OrderStatus {
    NEW = 'NEW',
    CONFIRMED = 'CONFIRMED',
    PAID = 'PAID',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum OrderEvent {
    CONFIRM = 'CONFIRM',
    PAY = 'PAY',
    SHIP = 'SHIP',
    DELIVER = 'DELIVER',
    CANCEL = 'CANCEL'
}

export interface Order {
    id?: number;
    book?: { id: number; title?: string }; // adjust if needed
    customerName: string;
    status: OrderStatus;
    orderDate: string; // or Date, if you convert it accordingly
}
