const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  get: async (endpoint: string, token?: string) => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    return response.json();
  },
  
  post: async (endpoint: string, data: any, token?: string) => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    return response.json();
  }
};