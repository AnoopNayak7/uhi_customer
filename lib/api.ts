import { APP_CONFIG } from './config';
import { useAuthStore } from './store';

const BYPASS_AUTH_ENDPOINTS = [
  '/auth/login',
  '/auth/signup', 
  '/auth/send-otp',
  '/auth/verify-otp',
  '/properties',
  '/properties/',
  '/area-insights',
  '/tools',
  '/business-partnerships',
  '/interior/inquiries'
];

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

  private shouldBypassAuth(endpoint: string, method: string = 'GET'): boolean {
    // Check exact matches first
    if (BYPASS_AUTH_ENDPOINTS.includes(endpoint)) {
      return true;
    }
    
    // Check for GET requests to single property endpoint
    if (method === 'GET' && endpoint.startsWith('/properties/') && endpoint.split('/').length === 3) {
      return true;
    }
    
    if (method === 'GET' && endpoint.startsWith('/properties?')) {
      return true;
    }
    
    // Check for area insights endpoints
    if (method === 'GET' && endpoint.startsWith('/area-insights/')) {
      return true;
    }
    
    // Check for tools endpoints
    if (method === 'GET' && endpoint.startsWith('/tools/')) {
      return true;
    }
    
    return false;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const method = options.method || 'GET';
    
    if (!this.shouldBypassAuth(endpoint, method)) {
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
        useAuthStore.getState().logout();
        throw new Error('Session expired. Please login again.');
      }
      
      // Try to get the error response body
      try {
        const errorData = await response.json();
        const error = new Error(errorData.message || `API Error: ${response.status}`);
        (error as any).response = { data: errorData, status: response.status };
        throw error;
      } catch (parseError) {
        // If we can't parse the error response, throw a generic error
        const error = new Error(`API Error: ${response.status}`);
        (error as any).response = { status: response.status };
        throw error;
      }
    }

    return response.json();
  }

  async signup(data: {
    email: string;
    firstName: string;
    lastName?: string;
    phone: string;
    role: string;
  }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendOTP(identifier: string) {
    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email: identifier }),
    });
  }

  async verifyOTP(identifier: string, otp: string) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ identifier, otp }),
    });
  }

  async login(identifier: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
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
    // Map property types for better compatibility
    if (params.propertyCategory) {
      // Map flat to apartment for consistency
      if (params.propertyCategory === 'flat') {
        params.propertyCategory = 'apartment';
      }
      // Also support the category parameter
      params.category = params.propertyCategory;
    }
    
    const searchParams = new URLSearchParams(params);
    return this.request(`/properties?${searchParams}`);
  }

  async getLocationBasedProperties(location: { city: string; area?: string }, params: any = {}) {
    const searchParams = new URLSearchParams({
      city: location.city,
      ...(location.area && { area: location.area }),
      ...params
    });
    return this.request(`/properties?${searchParams}`);
  }

  async getFeaturedPropertiesByLocation(location: { city: string; area?: string }, limit: number = 8) {
    return this.getLocationBasedProperties(location, {
      isFeatured: true,
      limit: limit.toString()
    });
  }

  async getTrendingPropertiesByLocation(location: { city: string; area?: string }, limit: number = 8) {
    return this.getLocationBasedProperties(location, {
      isHotSelling: true,
      limit: limit.toString()
    });
  }

  async getTopPropertiesByLocation(location: { city: string; area?: string }, limit: number = 8) {
    return this.getLocationBasedProperties(location, {
      isFastSelling: true,
      limit: limit.toString()
    });
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
  
  async getBuilderAnalytics(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/leads/analytics?${searchParams}`);
  }

  async getMyLeads(params: any = {}) {
    const searchParams = new URLSearchParams(params);
    return this.request(`/leads/my?${searchParams}`);
  }

  // Area Insights methods
  async getSupportedCities() {
    return this.request('/area-insights/cities');
  }

  async getCityLocations(cityName: string) {
    return this.request(`/area-insights/cities/${encodeURIComponent(cityName)}/locations`);
  }

  async getLocationDetails(cityName: string, locationName: string) {
    return this.request(`/area-insights/cities/${encodeURIComponent(cityName)}/locations/${encodeURIComponent(locationName)}`);
  }

  async getPriceTrends(cityName: string, locationName: string, params: {
    propertyType?: 'all' | 'apartments' | 'villas' | 'independent_houses';
    timeRange?: '1y' | '3y' | '5y' | '10y';
  } = {}) {
    const searchParams = new URLSearchParams(params as any);
    return this.request(`/area-insights/cities/${encodeURIComponent(cityName)}/locations/${encodeURIComponent(locationName)}/price-trends?${searchParams}`);
  }

  async getToolsPriceTrends(cityName: string, propertyType: string, timeRange: string) {
    return this.request(`/tools/price-trends/${encodeURIComponent(cityName.toLowerCase())}?propertyType=${propertyType}&timeRange=${timeRange}`);
  }

  async getToolsAreasForCity(cityName: string, options?: { includePrices?: boolean }) {
    const queryParams = options?.includePrices ? '?includePrices=true' : '';
    return this.request(`/tools/areas/${encodeURIComponent(cityName.toLowerCase())}${queryParams}`);
  }

  async getToolsAreaInsights(cityName: string, areaName: string) {
    return this.request(`/tools/area-insights/${encodeURIComponent(cityName.toLowerCase())}/${encodeURIComponent(areaName)}`);
  }

  async getToolsPropertyValue(data: {
    cityName: string;
    areaName: string;
    propertyType: string;
    builtUpArea: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyAge?: string;
    furnishing?: string;
    floor?: number;
    totalFloors?: number;
  }) {
    return this.request('/tools/property-value', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getToolsMarketPredictions(data: {
    cityName: string;
    areaName: string;
    propertyType?: string;
    predictionYears?: number;
  }) {
    return this.request('/tools/market-predictor', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getLocationComparison(cityName: string, locations: string[]) {
    return this.request(`/area-insights/cities/${encodeURIComponent(cityName)}/compare`, {
      method: 'POST',
      body: JSON.stringify({ locations }),
    });
  }

  // User search preferences methods
  async saveUserSearchPreferences(data: {
    userId: string;
    searchPreferences: any;
    lastSearchedAt: string;
  }) {
    return this.request('/auth/user-search-preferences', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserSearchPreferences(userId: string) {
    return this.request(`/auth/user-search-preferences/${userId}`);
  }

  async updateUserSearchPreferences(userId: string, searchPreferences: any) {
    return this.request(`/auth/user-search-preferences/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ searchPreferences }),
    });
  }

  // Recently viewed properties methods
  async addRecentlyViewedProperty(userId: string, propertyId: string) {
    return this.request('/auth/recently-viewed-properties', {
      method: 'POST',
      body: JSON.stringify({ userId, propertyId }),
    });
  }

  async getRecentlyViewedProperties(userId: string, limit: number = 10) {
    return this.request(`/auth/recently-viewed-properties/${userId}?limit=${limit}`);
  }

  // Book visit methods
  async bookPropertyVisit(data: {
    propertyId: string;
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    message?: string;
  }) {
    return this.request(`/properties/${data.propertyId}/book-visit`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserBookVisits(limit: number = 20) {
    return this.request(`/auth/book-visits?limit=${limit}`);
  }

  async updateBookVisitStatus(id: string, status: string) {
    return this.request(`/auth/book-visits/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Favourite methods
  async addToFavourites(propertyId: string) {
    return this.request('/auth/favourites', {
      method: 'POST',
      body: JSON.stringify({ propertyId }),
    });
  }

  async removeFromFavourites(propertyId: string) {
    return this.request(`/auth/favourites/${propertyId}`, {
      method: 'DELETE',
    });
  }

  async getFavourites() {
    return this.request('/auth/favourites');
  }

  // Viewed properties methods (updated to use array approach)
  async addViewedProperty(userId: string, propertyId: string) {
    return this.request('/auth/viewed-properties', {
      method: 'POST',
      body: JSON.stringify({ userId, propertyId }),
    });
  }

  async getViewedProperties(userId: string, limit: number = 20) {
    return this.request(`/auth/viewed-properties/${userId}?limit=${limit}`);
  }

  // Business Partnership methods
  async createBusinessPartnership(data: {
    name: string;
    email: string;
    phone: string;
    company: string;
    city?: string;
    propertyTypes?: string;
    experience?: string;
    message?: string;
    website?: string;
    employeeCount?: string;
    annualRevenue?: string;
    targetMarkets?: string;
  }) {
    return this.request('/business-partnerships/partnerships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async checkPartnershipStatus(email: string) {
    return this.request(`/business-partnerships/partnerships/check-status?email=${encodeURIComponent(email)}`);
  }

  async submitInteriorInquiry(data: {
    name: string;
    whatsapp: string;
    email?: string;
    message?: string;
  }) {
    return this.request('/interior/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

}

export const apiClient = new ApiClient();