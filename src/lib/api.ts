import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const transactionService = {
    getAll: (filters) => api.get('/transactions', { params: filters }),
    create: (data) => api.post('/transactions', data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
};

export const accountService = {
    getAll: () => api.get('/accounts'),
    getStats: () => api.get('/accounts/stats'),
};
