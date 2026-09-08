import api from './api';

export const getSegments = async () => {
  const { data } = await api.get('/segments');
  return data;
};

export const createSegment = async (segmentData) => {
  const { data } = await api.post('/segments', segmentData);
  return data;
};

export const updateSegment = async (id, segmentData) => {
  const { data } = await api.put(`/segments/${id}`, segmentData);
  return data;
};

export const deleteSegment = async (id) => {
  const { data } = await api.delete(`/segments/${id}`);
  return data;
};
