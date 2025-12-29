"use client";

import { useState, useEffect } from "react";

interface FeatureFlags {
  [key: string]: {
    enabled: boolean;
    value: boolean | string | number;
    metadata?: Record<string, any>;
  };
}

const CACHE_KEY = "feature_flags_cache";
const CACHE_EXPIRY_KEY = "feature_flags_cache_expiry";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Custom hook to fetch and use feature flags
 * 
 * Features:
 * - Fetches active flags from backend
 * - Caches flags for 5 minutes
 * - Provides easy check methods
 * - Handles errors gracefully
 */
export function useFeatureFlags() {
  const [flags, setFlags] = useState<FeatureFlags>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFlags = async () => {
    try {
      // Check cache first
      const cachedFlags = localStorage.getItem(CACHE_KEY);
      const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY);
      
      if (cachedFlags && cacheExpiry) {
        const expiryTime = parseInt(cacheExpiry, 10);
        if (Date.now() < expiryTime) {
          setFlags(JSON.parse(cachedFlags));
          setLoading(false);
          return;
        }
      }

      // Determine API URL - use localhost for local development
      let apiUrl;
      const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Check if env var is set and valid (not a placeholder)
      if (envApiUrl && !envApiUrl.includes('your_api_url') && envApiUrl.startsWith('http')) {
        apiUrl = envApiUrl;
      } else if (typeof window !== 'undefined') {
        // Check if we're on localhost
        const isLocalhost = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname.startsWith('192.168.') ||
                           window.location.hostname.startsWith('10.');
        apiUrl = isLocalhost 
          ? 'http://localhost:3000/api' 
          : 'https://g82q9hlk9h.execute-api.ap-south-1.amazonaws.com/prod/api';
      } else {
        // Server-side: default to production
        apiUrl = 'https://g82q9hlk9h.execute-api.ap-south-1.amazonaws.com/prod/api';
      }
      
      const fetchUrl = `${apiUrl}/feature-flags/active`;
      
      // Fetch from API
      const response = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch feature flags: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const activeFlags: FeatureFlags = data.data || {};

      // Cache the flags
      localStorage.setItem(CACHE_KEY, JSON.stringify(activeFlags));
      localStorage.setItem(
        CACHE_EXPIRY_KEY,
        (Date.now() + CACHE_DURATION).toString()
      );
      setFlags(activeFlags);
      setError(null);
    } catch (err) {
      setError(err as Error);
      
      // Try to use cached flags if available
      const cachedFlags = localStorage.getItem(CACHE_KEY);
      if (cachedFlags) {
        setFlags(JSON.parse(cachedFlags));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  /**
   * Check if a feature flag is enabled
   */
  const isEnabled = (key: string): boolean => {
    return flags[key]?.enabled === true;
  };

  /**
   * Get the value of a feature flag
   */
  const getValue = <T = any>(key: string, defaultValue?: T): T => {
    if (!flags[key]?.enabled) {
      return defaultValue as T;
    }
    return (flags[key]?.value ?? defaultValue) as T;
  };

  /**
   * Get metadata for a feature flag
   */
  const getMetadata = (key: string): Record<string, any> => {
    return flags[key]?.metadata || {};
  };

  /**
   * Refresh flags from server
   */
  const refresh = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
    setLoading(true);
    fetchFlags();
  };

  return {
    flags,
    loading,
    error,
    isEnabled,
    getValue,
    getMetadata,
    refresh,
  };
}

/**
 * Hook to check a specific feature flag
 * Simplified version for single flag checks
 */
export function useFeatureFlag(key: string, defaultValue = false) {
  const { isEnabled, loading, error } = useFeatureFlags();
  const flagValue = isEnabled(key);
  
  // If there's an error or flag not found, use default value
  // This ensures the feature works even if API fails
  const enabled = error || flagValue === undefined ? defaultValue : (flagValue ?? defaultValue);
  
  return {
    enabled,
    loading,
  };
}



