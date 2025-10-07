"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from './api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'builder' | 'admin';
  isVerified: boolean;
  googleId?: string;
  profilePicture?: string;
  authProvider?: 'email' | 'google';
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
  bhkVariants?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: (user: User, token: string) => void;
  loginWithGoogle: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  initialize: () => void;
  checkTokenExpiry: () => boolean;
  addToRecentlyViewed: (property: Property) => void;
}

interface PropertyState {
  compareList: Property[];
  favourites: Property[];
  viewedProperties: Property[];
  addToCompare: (property: Property) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  addToFavourites: (property: any) => Promise<void>;
  removeFromFavourites: (propertyId: string) => Promise<void>;
  addToViewed: (property: Property) => void;
  setFavourites: (properties: Property[]) => void;
  clearFavourites: () => void;
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
    furnishingStatus: string;
    possessionStatus: string;
    minArea: number;
    maxArea: number;
  };
  updateSearchFilters: (filters: Partial<SearchState['searchFilters']>) => void;
  clearFilters: () => void;
}

interface LocationState {
  selectedLocation: {
    city: string;
    area?: string;
  } | null;
  setSelectedLocation: (location: { city: string; area?: string } | null) => void;
  clearLocation: () => void;
}

interface TravelDestination {
  id: string;
  name: string;
  address: string;
  position: [number, number];
  travelTime?: string;
  distance?: number;
  lastCalculated?: number;
}

interface TravelPreferencesState {
  preferredDestinations: TravelDestination[];
  addDestination: (destination: TravelDestination) => void;
  removeDestination: (id: string) => void;
  clearDestinations: () => void;
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
  loginWithGoogle: (user, token) => {
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
  },
  addToRecentlyViewed: async (property) => {
    const { user } = get();
    if (user && property) {
      try {
        await apiClient.addRecentlyViewedProperty(user.id, property.id);
      } catch (error) {
        console.error('Error adding to recently viewed:', error);
      }
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
      addToFavourites: async (property) => {
        if (property) {
          try {
            await apiClient.addToFavourites(property.id);
            set((state) => ({
              favourites: [...state.favourites, property]
            }));
          } catch (error) {
            console.error('Error adding to favourites:', error);
            throw error;
          }
        }
      },
      removeFromFavourites: async (propertyId) => {
        try {
          await apiClient.removeFromFavourites(propertyId);
          set((state) => ({
            favourites: state.favourites.filter(p => p.id !== propertyId)
          }));
        } catch (error) {
          console.error('Error removing from favourites:', error);
          throw error;
        }
      },
      addToViewed: (property) => set((state) => {
        const filtered = state.viewedProperties.filter(p => p.id !== property.id);
        return { viewedProperties: [property, ...filtered].slice(0, 20) };
      }),
      setFavourites: (properties) => set({ favourites: properties }),
      clearFavourites: () => set({ favourites: [] })
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
    city: 'Bengaluru', // Set Bengaluru as default
    area: '',
    minPrice: 0,
    maxPrice: 100000000,
    bedrooms: '',
    propertyCategory: '',
    furnishingStatus: '',
    possessionStatus: '',
    minArea: 0,
    maxArea: 0
  },
  updateSearchFilters: (filters) => set((state) => ({
    searchFilters: { ...state.searchFilters, ...filters }
  })),
  clearFilters: () => set({
    searchFilters: {
      type: 'sell',
      city: 'Bengaluru', // Keep Bengaluru as default even when clearing
      area: '',
      minPrice: 0,
      maxPrice: 100000000,
      bedrooms: '',
      propertyCategory: '',
      furnishingStatus: '',
      possessionStatus: '',
      minArea: 0,
      maxArea: 0
    }
  })
}));

export const useLocationStore = create<LocationState>((set) => ({
  selectedLocation: { city: 'Bengaluru', area: undefined }, // Initialize with Bengaluru
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  clearLocation: () => set({ selectedLocation: { city: 'Bengaluru', area: undefined } })
}));

export const useTravelPreferencesStore = create<TravelPreferencesState>()(
  persist(
    (set, get) => ({
      preferredDestinations: [],
      addDestination: (destination) => set((state) => {
        if (state.preferredDestinations.length >= 3) return state;
        if (state.preferredDestinations.find(d => d.id === destination.id)) return state;
        return { preferredDestinations: [...state.preferredDestinations, destination] };
      }),
      removeDestination: (id) => set((state) => ({
        preferredDestinations: state.preferredDestinations.filter(d => d.id !== id)
      })),
      clearDestinations: () => set({ preferredDestinations: [] })
    }),
    {
      name: 'urbanhousein-travel-preferences',
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