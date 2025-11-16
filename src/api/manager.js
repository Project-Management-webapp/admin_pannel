import api from './index';

export const getPendingApprovals = async () => {
  try {
    const response = await api.get('/admin/managers/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong in fetching pending approvals' };
  }
};

export const getAllManagers = async () => {
  try {
    const response = await api.get('/admin/managers');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong in fetching all managers' };
  }
};

export const getManagerById = async (managerId) => {
  try {
    const response = await api.get(`/admin/managers/${managerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong in fetching manager' };
  }
};


export const approveManager = async (managerId) => {
  try {
    const response = await api.put(`/admin/managers/${managerId}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong in manager approval' };
  }
};


export const rejectManager = async (managerId, reason = '') => {
  try {
    const response = await api.put(`/admin/managers/${managerId}/reject`, {
      reason: reason || 'No reason provided'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong in  manager rejection' };
  }
};
