import api from './api';

export const getDashboardAnalytics = async () => {
  const { data } = await api.get('/dashboard/analytics');
  return data;
};
