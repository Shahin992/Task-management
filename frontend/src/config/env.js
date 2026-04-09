const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

export const API_BASE_URL = rawApiBaseUrl.replace(/\/$/, '');
export const TOKEN_COOKIE_NAME = import.meta.env.VITE_TOKEN_COOKIE_NAME || 'TMS_TOKEN';

export const buildApiUrl = (path = '') => {
  if (!path) {
    return API_BASE_URL;
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};
