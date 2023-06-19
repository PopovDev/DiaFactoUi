import axios, { AxiosInstance } from 'axios'

const apiUrl = import.meta.env.VITE_API_URL as string;
import { useAuthStore } from '@/stores/auth';

export const api = function (): AxiosInstance {
    const authStore = useAuthStore();

    const instance = axios.create({
        baseURL: apiUrl,
        timeout: 120000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });
    
    instance.interceptors.response.use((r) => r, (error) => {
        if (error?.response?.status === 401) {
            if (authStore.isLoggedIn)
                authStore.logout();
        }
        return Promise.reject(error);
    });


    return instance;
}