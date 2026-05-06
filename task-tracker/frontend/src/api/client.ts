import axios from 'axios';
import { getToken, removeToken } from '../storage/tokenStorage';
import * as SecureStore from 'expo-secure-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

client.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await removeToken();
      await SecureStore.deleteItemAsync('auth_user');
    }
    
    const errors = error.response?.data?.errors;
    let message = error.response?.data?.message || error.message || 'An error occurred';

    if (errors && Array.isArray(errors)) {
      message = errors.map((err: { msg?: string } | string) => typeof err === 'string' ? err : err.msg).join(', ');
    }

    return Promise.reject(new Error(message));
  }
);
