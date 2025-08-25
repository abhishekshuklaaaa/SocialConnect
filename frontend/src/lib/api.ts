const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-19483.up.railway.app';

let authToken = '';

export const setAuthToken = (token: string) => {
  authToken = token;
};

const apiCall = async (endpoint: string, options: any = {}) => {
  const headers: any = {};
  
  // Only set Content-Type for JSON, let browser set it for FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  
  // Merge with any headers passed in options
  const finalHeaders = { ...headers, ...options.headers };
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: finalHeaders
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
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
  getPosts: () => apiCall('/api/posts/').then(data => ({ data: { results: data.results || data || [] } })),
  getFeed: () => apiCall('/api/posts/feed/').then(data => ({ data: { results: data.results || data || [] } })),
  create: (data: any) => {
    // Handle FormData for file uploads
    if (data instanceof FormData) {
      return apiCall('/api/posts/', { 
        method: 'POST', 
        body: data,
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}
      });
    }
    // Handle regular JSON data
    return apiCall('/api/posts/', { method: 'POST', body: JSON.stringify(data) });
  },
  createPost: (data: any) => apiCall('/api/posts/', { method: 'POST', body: JSON.stringify(data) }),
  deletePost: (id: string) => apiCall(`/api/posts/${id}/`, { method: 'DELETE' }),
  like: (id: string) => apiCall(`/api/posts/${id}/like/`, { method: 'POST' }),
  unlike: (id: string) => apiCall(`/api/posts/${id}/like/`, { method: 'DELETE' }),
  likePost: (id: string) => apiCall(`/api/posts/${id}/like/`, { method: 'POST' }),
  unlikePost: (id: string) => apiCall(`/api/posts/${id}/like/`, { method: 'DELETE' }),
  getComments: (id: string) => apiCall(`/api/posts/${id}/comments/`).then(data => ({ data: data.results || data || [] })),
  addComment: (id: string, data: any) => apiCall(`/api/posts/${id}/comments/`, { method: 'POST', body: JSON.stringify(data) }),
  deleteComment: (id: string) => apiCall(`/api/posts/comments/${id}/`, { method: 'DELETE' })
};

export const usersAPI = {
  searchUsers: (query: string) => apiCall(`/api/users/?search=${query}`).then(data => ({ data: data.results || data || [] })),
  getProfile: (id: string) => apiCall(`/api/users/${id}/`).then(data => ({ data: data || {} })),
  updateProfile: (data: any) => apiCall('/api/users/me/', { method: 'PUT', body: JSON.stringify(data) }),
  followUser: (id: string) => apiCall(`/api/users/${id}/follow/`, { method: 'POST' }),
  unfollowUser: (id: string) => apiCall(`/api/users/${id}/follow/`, { method: 'DELETE' }),
  getFollowers: (id: string) => apiCall(`/api/users/${id}/followers/`).then(data => ({ data: data.results || data || [] })),
  getFollowing: (id: string) => apiCall(`/api/users/${id}/following/`).then(data => ({ data: data.results || data || [] }))
};

export const api = {
  get: (endpoint: string) => apiCall(endpoint),
  post: (endpoint: string, data: any) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) })
};