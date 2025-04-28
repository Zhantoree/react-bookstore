import axiosClient from './axiosClient';
import { Book } from '../types';

export const fetchBooks = async (minPrice?: number, maxPrice?: number): Promise<Book[]> => {
    const params: Record<string, string> = {};
    if (minPrice !== undefined) params.minPrice = String(minPrice);
    if (maxPrice !== undefined) params.maxPrice = String(maxPrice);

    const response = await axiosClient.get<Book[]>('/book/', { params });
    return response.data;
};

export const createBook = async (book: Book): Promise<Book> => {
    const response = await axiosClient.post<Book>('/book/', book);
    return response.data;
};

export const getBookById = async (id: number): Promise<Book> => {
    const response = await axiosClient.get<Book>(`/book/${id}`);
    return response.data;
};

export const updateBook = async (id: number, updateData: Partial<Book>): Promise<Book> => {
    const response = await axiosClient.patch<Book>(`/book/${id}`, updateData);
    return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
    await axiosClient.delete(`/book/${id}`);
};
