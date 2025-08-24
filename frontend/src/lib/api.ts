const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

let authToken = '';

export const setAuthToken = (token: string) => {
  authToken = token;
};

const apiCall = async (endpoint: string, options: any = {}) => {
  const headers: any = { 'Content-Type': 'application/json' };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options
  });
  return response.json();
};

export const authAPI = {
  login: (data: any) => apiCall('/api/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => apiCall('/api/auth/register/', { method: 'POST', body: JSON.stringify(data) })
};

export const postsAPI = {
  getFeed: () => apiCall('/api/posts/feed/'),
  create: (data: any) => apiCall('/api/posts/', { method: 'POST', body: JSON.stringify(data) }),
  like: (id: number) => apiCall(`/api/posts/${id}/like/`, { method: 'POST' }),
  unlike: (id: number) => apiCall(`/api/posts/${id}/like/`, { method: 'DELETE' })
};

export const usersAPI = {
  search: (query: string) => apiCall(`/api/users/?search=${query}`),
  getProfile: (id: number) => apiCall(`/api/users/${id}/`),
  follow: (id: number) => apiCall(`/api/users/${id}/follow/`, { method: 'POST' }),
  unfollow: (id: number) => apiCall(`/api/users/${id}/follow/`, { method: 'DELETE' })
};

export const api = {
  get: (endpoint: string) => apiCall(endpoint),
  post: (endpoint: string, data: any) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) })
};