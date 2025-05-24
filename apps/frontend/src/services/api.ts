import axios, { AxiosInstance, AxiosError } from "axios";

export interface APIError {
    message: string;
    statusCode?: number;
}

export class APIErrorException extends Error {
    statusCode?: number;
    constructor(error: APIError) {
        super(error.message);
        this.statusCode = error.statusCode;
        Object.setPrototypeOf(this, APIErrorException.prototype);
    }
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const apiError: APIError = { message: 'An unexpected error occurred.' };

        if (error.response) {
            const status = error.response.status;
            const data = error.response.data as { message: string };
            apiError.message = data?.message || `HTTP error ${status}`;
            apiError.statusCode = status;
            if (status === 401) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (error.request) {
            apiError.message = 'No response from server. Please check your network connection.';
        } else {
            apiError.message = error.message;
        }

        return Promise.reject(new APIErrorException(apiError));
    }
);

export function getErrorMessage(err: unknown): string {
    if (err instanceof APIErrorException) {
        return err.message;
    }
    if (err instanceof Error) {
        return err.message;
    }
    return String(err);
}

export interface LoginResponse {
    token: string;
}

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data;
}

export interface Product {
    id: string;
    name: string;
    price: number;
}

export async function searchProducts(
    query: string
): Promise<Product[]> {
    const response = await api.get<{ products: Product[] }>('/products', {
        params: { q: query },
    });
    return response.data.products;
}
