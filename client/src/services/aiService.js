import api from './api';

export const generateContent = async (payload) => {
  const { data } = await api.post('/ai/generate', payload);
  return data;
};
