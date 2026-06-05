// ========================================
// Detection API — Image analysis API calls
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

/**
 * Uploads an image for AI detection analysis
 * @param {File} imageFile - The image file to analyze
 * @returns {object} Detection result with verdict, confidence, heatmap
 */
export const analyzeImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await axios.post(API_URLS.DETECT, formData, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
