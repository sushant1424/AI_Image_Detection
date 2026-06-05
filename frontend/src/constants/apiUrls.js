// ========================================
// API URL Constants
// ========================================

const BASE_URL = '/api';

export const API_URLS = {
  // Auth
  REGISTER: `${BASE_URL}/auth/register`,
  LOGIN: `${BASE_URL}/auth/login`,
  ME: `${BASE_URL}/auth/me`,
  CHANGE_PASSWORD: `${BASE_URL}/auth/change-password`,
  DELETE_ACCOUNT: `${BASE_URL}/auth/account`,

  // Detection
  DETECT: `${BASE_URL}/detect`,

  // History
  HISTORY: `${BASE_URL}/history`,
  HISTORY_BY_ID: (id) => `${BASE_URL}/history/${id}`,

  // Stats
  STATS: `${BASE_URL}/stats`,
};
