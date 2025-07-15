"use client";

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initialize, isInitialized, token, checkTokenExpiry, logout } = useAuthStore();

  useEffect(() => {
    // Initialize auth state on app load
    if (!isInitialized) {
      initialize();
      
      // Check if token exists and is valid
      if (token) {
        const isValid = checkTokenExpiry();
        if (!isValid) {
          logout();
        }
      }
    }
  }, [initialize, isInitialized, token, checkTokenExpiry, logout]);

  // Set up token expiry check interval
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      checkTokenExpiry();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token, checkTokenExpiry]);

  return <>{children}</>;
}