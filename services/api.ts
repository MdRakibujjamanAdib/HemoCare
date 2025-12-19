import { getAuth } from 'firebase/auth';

const getHeaders = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (user) {
        const token = await user.getIdToken();
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    get: async (url: string) => {
        const headers = await getHeaders();
        const response = await fetch(`/api${url}`, { method: 'GET', headers });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },
    post: async (url: string, data: any) => {
        const headers = await getHeaders();
        const response = await fetch(`/api${url}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },
    put: async (url: string, data: any) => {
        const headers = await getHeaders();
        const response = await fetch(`/api${url}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },
    delete: async (url: string) => {
        const headers = await getHeaders();
        const response = await fetch(`/api${url}`, { method: 'DELETE', headers });
        if (!response.ok) throw new Error('API request failed');
        return response.json();
    },
};
