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

/**
 * Fetches user scan aggregates and chart series
 * @returns {object} Stats response
 */
export const fetchStats = async () => {
  const response = await axios.get(API_URLS.STATS, {
    headers: getAuthHeader(),
  });
  return response.data;
};
