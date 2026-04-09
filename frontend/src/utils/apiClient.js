import { getCookie, removeCookie } from './cookie';
import { API_BASE_URL, TOKEN_COOKIE_NAME } from '../config/env';

const sendRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...options.headers };
  const token = getCookie(TOKEN_COOKIE_NAME);

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

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
        removeCookie(TOKEN_COOKIE_NAME);
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
  get: (url, options = {}) => sendRequest(url, { ...options, method: 'GET' }),
  post: (url, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return sendRequest(url, { ...options, method: 'POST', body });
  },
  patch: (url, data, options = {}) => {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return sendRequest(url, { ...options, method: 'PATCH', body });
  },
  delete: (url, options = {}) => sendRequest(url, { ...options, method: 'DELETE' }),
};

export default api;
