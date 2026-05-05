import { client } from './client';
import { AuthResponse } from '../types';

export const authApi = {
  signup: async (data: { name: string; email: string; password: string }) => {
    const response = await client.post<AuthResponse>('/auth/signup', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await client.post<AuthResponse>('/auth/login', data);
    return response.data;
  },
};
