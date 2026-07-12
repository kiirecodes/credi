import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getDemoUser = async () => {
  const response = await api.get('/users/demo');
  return response.data;
};

export const analyzeLoan = async (payload) => {
  const response = await api.post('/loans/analyze', payload);
  return response.data;
};

export const getLoanReport = async (id) => {
  const response = await api.get(`/loans/${id}`);
  return response.data;
};

export const getUserHistory = async (userId) => {
  const response = await api.get(`/users/${userId}/history`);
  return response.data;
};

export const getLenders = async () => {
  const response = await api.get('/lenders');
  return response.data.lenders;
};

export default api;
