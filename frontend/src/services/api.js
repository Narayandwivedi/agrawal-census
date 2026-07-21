import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const createFamily = (data) => api.post('/families', data);
export const getFamilies = () => api.get('/families');
export const getFamilyById = (id) => api.get(`/families/${id}`);
export const updateFamily = (id, data) => api.put(`/families/${id}`, data);
export const deleteFamily = (id) => api.delete(`/families/${id}`);

export const createSamaj = (data) => api.post('/samaj', data);
export const getAllSamaj = () => api.get('/samaj');
export const getSamajById = (id) => api.get(`/samaj/${id}`);
export const updateSamaj = (id, data) => api.put(`/samaj/${id}`, data);
export const deleteSamaj = (id) => api.delete(`/samaj/${id}`);

export default api;
