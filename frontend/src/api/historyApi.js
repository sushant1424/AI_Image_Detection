// ========================================
// History API — Detection history API calls
// ========================================

import axios from 'axios';
import { API_URLS, HISTORY_PAGE_SIZE } from 'src/constants';

/**
 * Gets the auth header with JWT token
 * @returns {object} Authorization header
 */
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Fetches paginated detection history
 * @param {object} params - Query params { page, filter, startDate, endDate }
 * @returns {object} Paginated history data
 */
export const fetchHistory = async (params = {}) => {
  const { page = 1, filter, startDate, endDate } = params;
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: HISTORY_PAGE_SIZE.toString(),
  });

  if (filter && filter !== 'ALL') queryParams.append('filter', filter);
  if (startDate) queryParams.append('start_date', startDate);
  if (endDate) queryParams.append('end_date', endDate);

  const response = await axios.get(
    `${API_URLS.HISTORY}?${queryParams.toString()}`,
    { headers: getAuthHeader() }
  );
  return response.data;
};

/**
 * Fetches a single detection record by ID
 * @param {string} id - Detection UUID
 * @returns {object} Detection detail
 */
export const fetchHistoryById = async (id) => {
  const response = await axios.get(API_URLS.HISTORY_BY_ID(id), {
    headers: getAuthHeader(),
  });
  return response.data;
};

/**
 * Deletes a detection record
 * @param {string} id - Detection UUID
 * @returns {object} Deletion confirmation
 */
export const deleteHistoryItem = async (id) => {
  const response = await axios.delete(API_URLS.HISTORY_BY_ID(id), {
    headers: getAuthHeader(),
  });
  return response.data;
};
