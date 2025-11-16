import api from './index';

export const setupGoogleAuth = async () => {
  try {
    const response = await api.post('/google-auth/setup');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const verifyAndEnableGoogleAuth = async (token) => {
  try {
    const response = await api.post('/google-auth/verify-and-enable', {
      token
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


export const verifyGoogleAuthCode = async (userId, token) => {
  try {
    const response = await api.post('/google-auth/verify-code', {
      userId,
      token
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const disableGoogleAuth = async () => {
  try {
    const response = await api.post('/google-auth/disable');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getGoogleAuthStatus = async () => {
  try {
    const response = await api.get('/google-auth/status');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
