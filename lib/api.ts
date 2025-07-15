import { APP_CONFIG } from './config';
import { useAuthStore } from './store';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = APP_CONFIG.api.baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return useAuthStore.getState().token;
  }

  private checkAuth(): boolean {
    if (typeof window === 'undefined') return false;
    const { checkTokenExpiry } = useAuthStore.getState();
    return checkTokenExpiry();
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Check token validity before making request
    if (endpoint !== '/auth/login' && endpoint !== '/auth/signup' && endpoint !== '/auth/send-otp' && endpoint !== '/auth/verify-otp') {
      if (!this.checkAuth()) {
        throw new Error('Authentication required');
      }
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers: any = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid, logout user
        useAuthStore.getState().logout();
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async signup(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendOTP(email: string) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOTP(email: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(email: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(data: any) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Property methods
  async getProperties(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/properties?${searchParams}`);
  }

  async getProperty(id: string) {
    return this.request(`/properties/${id}`);
  }

  async createProperty(data: any) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: any) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string) {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyProperties(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/properties/my/properties?${searchParams}`);
  }

  async favouriteProperty(id: string) {
    return this.request(`/properties/${id}/favourite`, {
      method: 'POST',
    });
  }

  // Image upload method
  async uploadPropertyImages(propertyId: string, files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images`, file);
    });

    const token = this.getToken();
    const response = await fetch(`${this.baseUrl}/properties/${propertyId}/images`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    const result = await response.json();
    return result.data?.urls || [];
  }
  
  // Analytics methods
  async getBuilderAnalytics(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/leads/analytics?${searchParams}`);
  }

  async getMyLeads(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/leads/my?${searchParams}`);
  }

}

export const apiClient = new ApiClient();