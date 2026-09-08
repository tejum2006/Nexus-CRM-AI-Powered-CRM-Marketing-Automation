import api from './api';

export const getTeamMembers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const inviteTeamMember = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateTeamMemberRole = async (id, role) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
};

export const removeTeamMember = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
