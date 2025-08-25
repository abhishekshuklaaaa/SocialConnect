const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-19483.up.railway.app';

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
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
};

export const authAPI = {
  login: async (data: any) => {
    const response = await apiCall('/api/auth/login/', { method: 'POST', body: JSON.stringify(data) });
    if (response.access) {
      setAuthToken(response.access);
    }
    return { data: response };
  },
  register: (data: any) => apiCall('/api/auth/register/', { method: 'POST', body: JSON.stringify(data) })
};

export const postsAPI = {
  getPosts: () => apiCall('/api/posts/').then(data => ({ data })),
  getFeed: () => apiCall('/api/posts/feed/').then(data => ({ data })),
  createPost: (data: any) => apiCall('/api/posts/', { method: 'POST', body: JSON.stringify(data) }),
  deletePost: (id: string) => apiCall(`/api/posts/${id}/`, { method: 'DELETE' }),
  likePost: (id: string) => apiCall(`/api/posts/${id}/like/`, { method: 'POST' }),
  unlikePost: (id: string) => apiCall(`/api/posts/${id}/like/`, { method: 'DELETE' }),
  getComments: (id: string) => apiCall(`/api/posts/${id}/comments/`).then(data => ({ data })),
  addComment: (id: string, data: any) => apiCall(`/api/posts/${id}/comments/`, { method: 'POST', body: JSON.stringify(data) }),
  deleteComment: (id: string) => apiCall(`/api/posts/comments/${id}/`, { method: 'DELETE' })
};

export const usersAPI = {
  searchUsers: (query: string) => apiCall(`/api/users/?search=${query}`).then(data => ({ data })),
  getProfile: (id: string) => apiCall(`/api/users/${id}/`).then(data => ({ data })),
  updateProfile: (data: any) => apiCall('/api/users/me/', { method: 'PUT', body: JSON.stringify(data) }),
  followUser: (id: string) => apiCall(`/api/users/${id}/follow/`, { method: 'POST' }),
  unfollowUser: (id: string) => apiCall(`/api/users/${id}/follow/`, { method: 'DELETE' }),
  getFollowers: (id: string) => apiCall(`/api/users/${id}/followers/`).then(data => ({ data })),
  getFollowing: (id: string) => apiCall(`/api/users/${id}/following/`).then(data => ({ data }))
};

export const api = {
  get: (endpoint: string) => apiCall(endpoint),
  post: (endpoint: string, data: any) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) })
};