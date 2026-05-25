const API_URL = 'https://localhost:7168/api';

function getHeaders(): HeadersInit {
    const token = localStorage.getItem('token_catalogo');
    const headers: HeadersInit = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

export const apiService = {
    async request(endpoint: string, options?: RequestInit) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                ...getHeaders(),
                ...options?.headers
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('token_catalogo');
            window.location.reload();
            throw new Error("Sessão expirada. Faça login novamente.");
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Erro ao processar requisição.");
        }

        if (response.status === 204) return null;
        return response.json();
    }
};