import axios from 'axios';
import { getToken, removeToken } from '../storage/tokenStorage';
import * as SecureStore from 'expo-secure-store';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://tasktracker-backend-lrqi.onrender.com';

export const client = axios.create({
  baseURL: BASE_URL,
  // Render free tier has cold starts up to 60s — keep timeout generous
  timeout: 60000,
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

    // No response at all → pure network / timeout issue
    if (!error.response) {
      const isTimeout = error.code === 'ECONNABORTED';
      return Promise.reject(
        new Error(
          isTimeout
            ? 'Server is waking up, please try again in a moment ☕'
            : 'Network error — check your internet connection'
        )
      );
    }

    const errors = error.response?.data?.errors;
    let message =
      error.response?.data?.message || error.message || 'An error occurred';

    if (errors && Array.isArray(errors)) {
      message = errors
        .map((err: { msg?: string } | string) =>
          typeof err === 'string' ? err : err.msg
        )
        .join(', ');
    }

    return Promise.reject(new Error(message));
  }
);
