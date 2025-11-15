import api from './index';

export const getSystemStats = async () => {
  try {
    const response = await api.get('/admin/stats');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong in fetching stats' };
  }
};
