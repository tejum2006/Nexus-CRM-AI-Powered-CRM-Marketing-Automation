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

export const exportSegments = async () => {
  const response = await api.get('/segments/export', { 
    responseType: 'blob' 
  });
  
  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'segments_export.csv';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename=(.+)/);
    if (filenameMatch && filenameMatch.length === 2) {
      filename = filenameMatch[1];
    }
  }
  
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};
