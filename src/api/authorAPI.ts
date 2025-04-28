import axiosClient from './axiosClient';
import { Author } from '../types';

export const fetchAuthors = async (lastName?: string, firstName?: string): Promise<Author[]> => {
    const params: Record<string, string> = {};
    if (lastName) params.lastName = lastName;
    if (firstName) params.firstName = firstName;

    const response = await axiosClient.get<Author[]>('/author/', { params });
    return response.data;
};

export const createAuthor = async (author: Author): Promise<Author> => {
    const response = await axiosClient.post<Author>('/author/', author);
    return response.data;
};

export const getAuthorById = async (id: number): Promise<Author> => {
    const response = await axiosClient.get<Author>(`/author/${id}`);
    return response.data;
};

export const updateAuthor = async (id: number, updateData: Partial<Author>): Promise<Author> => {
    const response = await axiosClient.patch<Author>(`/author/${id}`, updateData);
    return response.data;
};

export const deleteAuthor = async (id: number): Promise<void> => {
    await axiosClient.delete(`/author/${id}`);
};
