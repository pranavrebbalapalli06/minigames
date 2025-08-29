// src/lib/api.js

// Set API base URL from environment or fallback to your deployed URL
const API_BASE = (import.meta?.env?.VITE_API_URL || 'https://minigames-backend-1.onrender.com').replace(/\/$/, '');
const API_PREFIX = '/api/v1';

// Generic API request function
async function apiRequest(path, { method = 'GET', body } = {}) {
  try {
    const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // if backend uses cookies/session
    });

    const data = await res.json().catch(() => ({})); // handle empty responses

    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error(`API Request Error: ${path}`, err);
    throw err;
  }
}

// ------------------ API Endpoints ------------------

// Auth Endpoints
export const auth = {
  register: (username, password) =>
    apiRequest('/auth/register', { method: 'POST', body: { username, password } }),
  login: (username, password) =>
    apiRequest('/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
};

// Users Endpoint
export const users = {
  get: (username) => apiRequest(`/users/${encodeURIComponent(username)}`),
};

// Scores Endpoint
export const scores = {
  update: (username, game, score) =>
    apiRequest('/scores', { method: 'PUT', body: { username, game, score } }),
};

// Leaderboard Endpoints
export const leaderboard = {
  all: () => apiRequest('/leaderboard'),
  game: (game, limit = 10) => apiRequest(`/leaderboard/${encodeURIComponent(game)}?limit=${limit}`),
};

// Local Storage Utility
export const storage = {
  getUsername: () => localStorage.getItem('mg_username'),
  setUsername: (u) => localStorage.setItem('mg_username', u),
  clear: () => localStorage.removeItem('mg_username'),
};
