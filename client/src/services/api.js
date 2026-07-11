import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const analyzeLoan = async (payload) => {
  const response = await api.post('/loans/analyze', payload);
  return response.data;
};

export const getLoanReport = async (id) => {
  const response = await api.get(`/loans/${id}`);
  return response.data;
};

export default api;
