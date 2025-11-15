import api from './index';

export const adminLogin = async (credentials) => {
  try {
    const response = await api.post('/auth/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const adminLogout = async () => {
  try {
    const response = await api.post('/auth/admin/logout');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const forgotPassword = async (email) => {
  if (!email) throw { message: "Email is required" };

  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password API error:", error);
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post(`/auth/reset-password/${token}`, { newPassword });
    return response.data;
  } catch (error) {
    console.error("Reset password API error:", error);
    throw error.response?.data || { message: "Something went wrong" };
  }
};



