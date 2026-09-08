import api from './api';

export const getCustomers = async (params) => {
  const { data } = await api.get('/customers', { params });
  return data;
};

export const getCustomerById = async (id) => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

export const createCustomer = async (customerData) => {
  const { data } = await api.post('/customers', customerData);
  return data;
};

export const updateCustomer = async (id, customerData) => {
  const { data } = await api.put(`/customers/${id}`, customerData);
  return data;
};

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customers/${id}`);
  return data;
};

export const addCustomerNote = async (id, content) => {
  const { data } = await api.post(`/customers/${id}/notes`, { content });
  return data;
};

export const getAllTags = async () => {
  const { data } = await api.get('/customers/tags/all');
  return data;
};

export const exportCustomers = async (params) => {
  // Use responseType: blob for file downloads
  const response = await api.get('/customers/export', { 
    params, 
    responseType: 'blob' 
  });
  
  // Create a blob from the response data
  const blob = new Blob([response.data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  
  // Get filename from header if possible, else default
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'customers_export.csv';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename=(.+)/);
    if (filenameMatch && filenameMatch.length === 2) {
      filename = filenameMatch[1];
    }
  }
  
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const importCustomers = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await api.post('/customers/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};
