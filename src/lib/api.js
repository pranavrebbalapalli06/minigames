// Set API base URL from environment or use your deployed URL as fallback
const API_BASE = (import.meta?.env?.VITE_API_URL || 'https://minigames-backend-1.onrender.com').replace(/\/$/, '');
const API_PREFIX = '/api/v1';

async function apiRequest(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE}${API_PREFIX}${path}`, {
    method,
    headers: body && { 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
    credentials: 'include'
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// API Endpoints
export const auth = {
  register: (username, password) => apiRequest('/auth/register', { method: 'POST', body: { username, password } }),
  login: (username, password) => apiRequest('/auth/login', { method: 'POST', body: { username, password } }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' })
};

export const users = {
  get: (username) => apiRequest(`/users/${encodeURIComponent(username)}`)
};

export const scores = {
  update: (username, game, score) => apiRequest('/scores', { method: 'PUT', body: { username, game, score } })
};

export const leaderboard = {
  all: () => apiRequest('/leaderboard'),
  game: (game, limit = 10) => apiRequest(`/leaderboard/${game}?limit=${limit}`)
};

export const storage = {
  getUsername: () => localStorage.getItem('mg_username'),
  setUsername: (u) => localStorage.setItem('mg_username', u),
  clear: () => localStorage.removeItem('mg_username')
};
