import api from './api';

export const getCampaigns = async (params = {}) => {
  const { data } = await api.get('/campaigns', { params });
  return data;
};

export const getCampaignById = async (id) => {
  const { data } = await api.get(`/campaigns/${id}`);
  return data;
};

export const createCampaign = async (campaignData) => {
  const { data } = await api.post('/campaigns', campaignData);
  return data;
};

export const updateCampaign = async (id, campaignData) => {
  const { data } = await api.put(`/campaigns/${id}`, campaignData);
  return data;
};

export const deleteCampaign = async (id) => {
  const { data } = await api.delete(`/campaigns/${id}`);
  return data;
};

export const launchCampaign = async (id, isSimulation = true) => {
  const { data } = await api.post(`/campaigns/${id}/launch`, { isSimulation });
  return data;
};

export const sendTestEmail = async (id, testEmail) => {
  const { data } = await api.post(`/campaigns/${id}/test-email`, { testEmail });
  return data;
};
