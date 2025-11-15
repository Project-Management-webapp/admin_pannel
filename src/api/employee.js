import api from './index';

export const getAllEmployee = async () => {
  try {
    const response = await api.get('/admin/employees');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong in fetching all employee' };
  }
};

    