import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  }
});

export const producerApi = {
  getAll: () => api.get('/produtores'),
  getById: (id: number) => api.get(`/produtores/${id}`),
  create: (data: any) => api.post('/produtores', data),
  update: (id: number, data: any) => api.put(`/produtores/${id}`, data),
  delete: (id: number) => api.delete(`/produtores/${id}`),
  getDashboard: () => api.get('/dashboard'),
};

export default api;