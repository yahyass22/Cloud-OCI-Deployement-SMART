import { BASE_URL } from "@/constants";

// Normalize BASE_URL by removing trailing /api or / and then append /api
const normalizedBase = BASE_URL.replace(/\/api\/?$/, '').replace(/\/$/, '');
const API_BASE = `${normalizedBase}/api`;

/**
 * Generic API client for making HTTP requests
 */
export const apiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    console.log('🌐 API GET:', url);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      console.log('📡 API Response Status:', response.status);

      const isNoContent = response.status === 204 || response.status === 205;
      let data: any = null;

      if (!isNoContent) {
        try {
          data = await response.json();
        } catch (e) {
          if (response.ok) {
            throw new Error(`Failed to parse JSON response: ${e instanceof Error ? e.message : String(e)} (Status: ${response.status})`);
          }
        }
      }

      if (!response.ok) {
        console.error('❌ API Error Status:', response.status);
        const message = data?.error || data?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return data as T;
    } catch (error) {
      // Handle network errors (backend offline, CORS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error - backend may be offline:', error);
        throw new Error('Failed to connect to server. Please ensure the backend is running.');
      }
      throw error;
    }
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    console.log('🌐 API POST:', url, data);
    console.log('🍪 Current cookies before POST:', document.cookie?.substring(0, 100));

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      console.log('📡 POST Response Status:', response.status);
      console.log('🍪 Set-Cookie header present:', response.headers.has('Set-Cookie'));

      const isNoContent = response.status === 204 || response.status === 205;
      let responseData: any = null;

      if (!isNoContent) {
        try {
          responseData = await response.json();
        } catch (e) {
          if (response.ok) {
            throw new Error(`Failed to parse JSON response: ${e instanceof Error ? e.message : String(e)} (Status: ${response.status})`);
          }
        }
      }

      if (!response.ok) {
        console.error('❌ API Error Status:', response.status);
        const message = responseData?.error || responseData?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return responseData as T;
    } catch (error) {
      // Handle network errors (backend offline, CORS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error - backend may be offline:', error);
        throw new Error('Failed to connect to server. Please ensure the backend is running.');
      }
      throw error;
    }
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    console.log('🌐 API PUT:', url, data);

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const isNoContent = response.status === 204 || response.status === 205;
      let responseData: any = null;

      if (!isNoContent) {
        try {
          responseData = await response.json();
        } catch (e) {
          if (response.ok) {
            throw new Error(`Failed to parse JSON response: ${e instanceof Error ? e.message : String(e)} (Status: ${response.status})`);
          }
        }
      }

      if (!response.ok) {
        console.error('❌ API Error Status:', response.status);
        const message = responseData?.error || responseData?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return responseData as T;
    } catch (error) {
      // Handle network errors (backend offline, CORS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error - backend may be offline:', error);
        throw new Error('Failed to connect to server. Please ensure the backend is running.');
      }
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    console.log('🌐 API DELETE:', url);

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const isNoContent = response.status === 204 || response.status === 205;
      let responseData: any = null;

      if (!isNoContent) {
        try {
          responseData = await response.json();
        } catch (e) {
          if (response.ok) {
            throw new Error(`Failed to parse JSON response: ${e instanceof Error ? e.message : String(e)} (Status: ${response.status})`);
          }
        }
      }

      if (!response.ok) {
        console.error('❌ API Error Status:', response.status);
        const message = responseData?.error || responseData?.message || `HTTP ${response.status}`;
        throw new Error(message);
      }

      return responseData as T;
    } catch (error) {
      // Handle network errors (backend offline, CORS, etc.)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('❌ Network error - backend may be offline:', error);
        throw new Error('Failed to connect to server. Please ensure the backend is running.');
      }
      throw error;
    }
  },
};
