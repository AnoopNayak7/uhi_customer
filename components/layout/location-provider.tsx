"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useLocationStore } from "@/lib/store";

interface LocationContextType {
  selectedLocation: { city: string; area: string } | null;
  setSelectedLocation: (location: { city: string; area: string } | null) => void;
  clearLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const { selectedLocation, setSelectedLocation, clearLocation }:any = useLocationStore();
  const [isClient, setIsClient] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Try to restore location from localStorage on mount
    if (typeof window !== 'undefined' && !isInitialized) {
      const savedLocation = localStorage.getItem('urbanhousein-selected-location');
      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          if (parsed.city) {
            // Only set if it's different from current location to prevent unnecessary API calls
            if (!selectedLocation || selectedLocation.city !== parsed.city || selectedLocation.area !== parsed.area) {
              console.log('📍 LocationProvider: Restoring location from localStorage:', parsed);
              setSelectedLocation(parsed);
            }
          }
        } catch (error) {
          console.error('Error parsing saved location:', error);
        }
      }
      setIsInitialized(true);
    }
  }, [setSelectedLocation, selectedLocation, isInitialized]);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedLocation) {
      localStorage.setItem('urbanhousein-selected-location', JSON.stringify(selectedLocation));
    } else if (typeof window !== 'undefined' && !selectedLocation) {
      localStorage.removeItem('urbanhousein-selected-location');
    }
  }, [selectedLocation]);

  if (!isClient) {
    return null;
  }

  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation, clearLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
