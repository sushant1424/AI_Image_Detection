import axios from 'axios';
import { API_URLS } from 'src/constants';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Uploads an image for AI detection analysis
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

/**
 * Sends an image URL for AI detection analysis
 */
export const analyzeImageUrl = async (url) => {
  const response = await axios.post('/api/detect-url', { url }, {
    headers: {
      ...getAuthHeader(),
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
