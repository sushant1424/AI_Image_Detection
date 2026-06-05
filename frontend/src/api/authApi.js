// ========================================
// Auth API — All authentication API calls
// ========================================

import axios from 'axios';
import { API_URLS } from 'src/constants';

/**
 * Gets the auth header with JWT token
 * @returns {object} Authorization header
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (userData) => {
  const response = await axios.post(API_URLS.REGISTER, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(API_URLS.LOGIN, credentials);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(API_URLS.ME, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await axios.put(API_URLS.CHANGE_PASSWORD, passwordData, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const deleteAccount = async () => {
  const response = await axios.delete(API_URLS.DELETE_ACCOUNT, {
    headers: getAuthHeader(),
  });
  return response.data;
};
