/**
 * SmartPark Full-Stack API Client
 * Provides unified HTTP communication layer with RESTful backend endpoints,
 * automatic token management, and error interceptors.
 */

const API_BASE_URL = (typeof window !== 'undefined' && window.location && window.location.origin)
  ? window.location.origin
  : 'http://127.0.0.1:8000';

export const apiClient = {
  async get(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });

    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('smartpark_auth_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(url.toString(), { credentials: 'omit', method: 'GET', headers });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: Failed to fetch`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`[API GET Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  async post(endpoint, body = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('smartpark_auth_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Request failed`);
      }
      return data;
    } catch (error) {
      console.warn(`[API POST Error] ${endpoint}:`, error.message);
      throw error;
    }
  },

  async patch(endpoint, body = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('smartpark_auth_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: Request failed`);
      }
      return data;
    } catch (error) {
      console.warn(`[API PATCH Error] ${endpoint}:`, error.message);
      throw error;
    }
  }
};
