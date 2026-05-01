const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const buildQuery = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const getApiBaseUrl = () => API_BASE_URL;

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const authApi = {
  me: (token) => apiFetch('/auth/me', { token }),
};

export const dashboardApi = {
  overview: ({ token, assetId = 'bitcoin', range = '7d' }) =>
    apiFetch(`/dashboard/overview${buildQuery({ asset_id: assetId, range })}`, { token }),
};

export const marketsApi = {
  list: ({ token, search = '', page = 1, limit = 40, sort = 'market_cap_desc' }) =>
    apiFetch(`/markets${buildQuery({ search, page, limit, sort })}`, { token }),
  detail: ({ token, assetId }) => apiFetch(`/markets/${assetId}`, { token }),
  history: ({ token, assetId, range = '7d' }) =>
    apiFetch(`/markets/${assetId}/history${buildQuery({ range })}`, { token }),
};

export const portfolioApi = {
  summary: (token) => apiFetch('/portfolio', { token }),
  analytics: (token) => apiFetch('/portfolio/analytics', { token }),
  history: (token) => apiFetch('/portfolio/history', { token }),
  strategies: (token) => apiFetch('/portfolio/strategies', { token }),
};

export const settingsApi = {
  get: (token) => apiFetch('/settings', { token }),
  update: (token, payload) => apiFetch('/settings', { method: 'PATCH', body: payload, token }),
};
