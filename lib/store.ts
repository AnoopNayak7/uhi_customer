"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'user' | 'builder' | 'admin';
  isVerified: boolean;
}

interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  propertyType?: string;
  address: string;
  city: string;
  state?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  images?: string[];
  features?: string[];
  category?: string;
  constructionStatus?: string;
  furnishingStatus?: string;
  latitude?: number;
  longitude?: number;
  isFeatured?: boolean;
  isHotSelling?: boolean;
  isFastSelling?: boolean;
  isNewlyAdded?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  initialize: () => void;
  checkTokenExpiry: () => boolean;
}

interface PropertyState {
  compareList: Property[];
  favourites: Property[];
  viewedProperties: Property[];
  addToCompare: (property: Property) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  addToFavourites: (property: any) => void;
  removeFromFavourites: (propertyId: string) => void;
  addToViewed: (property: Property) => void;
}

interface SearchState {
  searchFilters: {
    type: string;
    city: string;
    area: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: string;
    propertyCategory: string;
  };
  updateSearchFilters: (filters: Partial<SearchState['searchFilters']>) => void;
  clearFilters: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitialized: false,
  login: (user, token) => {
    set({ user, token, isAuthenticated: true, isInitialized: true });
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false, isInitialized: true });
  },
  updateUser: (userData) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null
  })),
  initialize: () => {
    set({ isInitialized: true });
  },
  checkTokenExpiry: () => {
    const { token } = get();
    if (!token) return false;
    
    try {
      // Decode JWT token to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        // Token expired, logout user
        get().logout();
        return false;
      }
      return true;
    } catch (error) {
      // Invalid token, logout user
      get().logout();
      return false;
    }
  }
}),
    {
      name: 'urbanhousein-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const usePropertyStore = create<PropertyState>()(
  persist(
    (set, get) => ({
      compareList: [],
      favourites: [],
      viewedProperties: [],
      addToCompare: (property) => set((state) => {
        if (state.compareList.length >= 3) return state;
        if (state.compareList.find(p => p.id === property.id)) return state;
        return { compareList: [...state.compareList, property] };
      }),
      removeFromCompare: (propertyId) => set((state) => ({
        compareList: state.compareList.filter(p => p.id !== propertyId)
      })),
      clearCompare: () => set({ compareList: [] }),
      addToFavourites: (property) => set((state) => {
        if (state.favourites.find(p => p.id === property.id)) return state;
        return { favourites: [...state.favourites, property] };
      }),
      removeFromFavourites: (propertyId) => set((state) => ({
        favourites: state.favourites.filter(p => p.id !== propertyId)
      })),
      addToViewed: (property) => set((state) => {
        const filtered = state.viewedProperties.filter(p => p.id !== property.id);
        return { viewedProperties: [property, ...filtered].slice(0, 20) };
      })
    }),
    {
      name: 'urbanhousein-properties',
      storage: typeof window !== 'undefined' ? {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      } : undefined,
    }
  )
);

export const useSearchStore = create<SearchState>((set) => ({
  searchFilters: {
    type: 'sell',
    city: '',
    area: '',
    minPrice: 0,
    maxPrice: 100000000,
    bedrooms: '',
    propertyCategory: ''
  },
  updateSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),
  clearFilters: () => set({
    searchFilters: {
      type: 'sell',
      city: '',
      area: '',
      minPrice: 0,
      maxPrice: 100000000,
      bedrooms: '',
      propertyCategory: ''
    }
  })
}));