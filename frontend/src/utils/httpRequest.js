import { getCookie, removeCookie } from './cookie';

const API_BASE_URL = '/api/v1';

/**
 * Reusable HTTP Request utility using fetch with multipart support.
 * Automatically injects the TMS_TOKEN from browser cookies into headers.
 * @param {string} endpoint - The API endpoint relative to the base URL.
 * @param {object} options - Request options (method, body, headers, etc.)
 */
const httpRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Prepare headers
  const headers = { ...options.headers };
  
  // Retrieve TMS_TOKEN from custom cookie helper
  const token = getCookie('TMS_TOKEN');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Automatically handle multipart/form-data
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }
  
  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      const path = window.location.pathname;
      if (path !== '/' && path !== '/login' && path !== '/signup') {
        removeCookie('TMS_TOKEN');
        window.location.href = '/';
      }
    }

    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

const api = {
  get: (url, options = {}) => httpRequest(url, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return httpRequest(url, { ...options, method: 'POST', body });
  },
  patch: (url, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return httpRequest(url, { ...options, method: 'PATCH', body });
  },
  delete: (url, options = {}) => httpRequest(url, { ...options, method: 'DELETE' }),
};

export default api;
