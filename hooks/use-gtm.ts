"use client";

import { useEffect, useState, useCallback } from 'react';
import {
  getGTMTheme,
  getGTMBanner,
  getUserSegment,
  getFestivalTheme,
  isFestivalActive,
  getDataLayerValue,
  pushToDataLayer,
  trackUserInfo,
  trackPageView,
  trackPropertyInteraction,
  trackSearch,
} from '@/lib/gtm';

/**
 * Hook to get and react to GTM theme changes
 */
export function useGTMTheme() {
  const [theme, setTheme] = useState<string | null>(null);
  const [festivalTheme, setFestivalTheme] = useState<any>(null);

  useEffect(() => {
    // Also listen to dataLayer changes directly
    const checkDataLayer = () => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        const lastEvent = window.dataLayer[window.dataLayer.length - 1];
        if (lastEvent && (lastEvent.theme || lastEvent.activeFestival || lastEvent.festivalTheme)) {
          return true;
        }
      }
      return false;
    };
    
    const checkTheme = () => {
      const currentTheme = getGTMTheme();
      const currentFestivalTheme = getFestivalTheme();
      
      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        if (currentTheme !== theme) {
          console.log('Theme changed:', { from: theme, to: currentTheme });
        }
      }
      
      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
      
      if (JSON.stringify(currentFestivalTheme) !== JSON.stringify(festivalTheme)) {
        setFestivalTheme(currentFestivalTheme);
      }
    };

    // Check immediately
    checkTheme();

    // Set up interval to check for changes (check more frequently initially)
    const interval = setInterval(() => {
      if (checkDataLayer() || true) { // Always check
        checkTheme();
      }
    }, 300); // Check every 300ms

    // Listen for custom events
    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail?.gtmTheme || event.detail?.theme || event.detail?.activeFestival) {
        checkTheme();
      }
      if (event.detail?.festivalTheme) {
        checkTheme();
      }
    };
    
    // Override dataLayer.push to detect changes
    if (typeof window !== 'undefined' && window.dataLayer) {
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args: any[]) {
        const result = originalPush.apply(this, args);
        if (args[0] && typeof args[0] === 'object') {
          if (args[0].theme || args[0].activeFestival || args[0].festivalTheme) {
            setTimeout(checkTheme, 100); // Small delay to ensure dataLayer is updated
          }
        }
        return result;
      };
    }

    window.addEventListener('gtm-custom-event', handleGTMEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gtm-custom-event', handleGTMEvent as EventListener);
    };
  }, [theme, festivalTheme]);

  return { theme, festivalTheme };
}

/**
 * Hook to get and react to GTM banner configuration
 */
export function useGTMBanner() {
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    const checkBanner = () => {
      // Check dataLayer directly for banner
      let currentBanner = null;
      
      if (typeof window !== 'undefined' && window.dataLayer) {
        // Search through dataLayer from newest to oldest
        for (let i = window.dataLayer.length - 1; i >= 0; i--) {
          const item = window.dataLayer[i];
          if (item) {
            if (item.banner && typeof item.banner === 'object') {
              currentBanner = item.banner;
              break;
            }
            if (item.gtmBanner && typeof item.gtmBanner === 'object') {
              currentBanner = item.gtmBanner;
              break;
            }
          }
        }
      }
      
      // Also try the getter function
      if (!currentBanner) {
        currentBanner = getGTMBanner();
      }
      
      if (JSON.stringify(currentBanner) !== JSON.stringify(banner)) {
        setBanner(currentBanner);
      }
    };

    checkBanner();
    const interval = setInterval(checkBanner, 500);

    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail?.gtmBanner || event.detail?.banner) {
        checkBanner();
      }
    };
    
    // Also listen to dataLayer changes directly
    const checkDataLayer = () => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        const lastEvent = window.dataLayer[window.dataLayer.length - 1];
        if (lastEvent && (lastEvent.banner || lastEvent.gtmBanner)) {
          checkBanner();
        }
      }
    };

    window.addEventListener('gtm-custom-event', handleGTMEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gtm-custom-event', handleGTMEvent as EventListener);
    };
  }, [banner]);

  return banner;
}

/**
 * Hook to get user segment from GTM
 */
export function useUserSegment() {
  const [segment, setSegment] = useState<string | null>(null);

  useEffect(() => {
    const checkSegment = () => {
      const currentSegment = getUserSegment();
      if (currentSegment !== segment) {
        setSegment(currentSegment);
      }
    };

    checkSegment();
    const interval = setInterval(checkSegment, 2000);

    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail?.gtmUserSegment || event.detail?.user_segment) {
        checkSegment();
      }
    };

    window.addEventListener('gtm-custom-event', handleGTMEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gtm-custom-event', handleGTMEvent as EventListener);
    };
  }, [segment]);

  return segment;
}

/**
 * Hook to check if a festival is active
 */
export function useFestivalStatus(festivalName: string) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const active = isFestivalActive(festivalName);
      if (active !== isActive) {
        setIsActive(active);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 1000);

    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail?.activeFestival) {
        checkStatus();
      }
    };

    window.addEventListener('gtm-custom-event', handleGTMEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gtm-custom-event', handleGTMEvent as EventListener);
    };
  }, [festivalName, isActive]);

  return isActive;
}

/**
 * Hook for GTM tracking functions
 */
export function useGTMTracking() {
  const trackUser = useCallback((userInfo: Parameters<typeof trackUserInfo>[0]) => {
    trackUserInfo(userInfo);
  }, []);

  const trackPage = useCallback((pageData?: Parameters<typeof trackPageView>[0]) => {
    trackPageView(pageData);
  }, []);

  const trackProperty = useCallback((
    action: string,
    propertyData: Parameters<typeof trackPropertyInteraction>[1]
  ) => {
    trackPropertyInteraction(action, propertyData);
  }, []);

  const trackSearchActivity = useCallback((searchData: Parameters<typeof trackSearch>[0]) => {
    trackSearch(searchData);
  }, []);

  return {
    trackUser,
    trackPage,
    trackProperty,
    trackSearch: trackSearchActivity,
  };
}

/**
 * Hook to get any GTM variable
 */
export function useGTMVariable(key: string) {
  const [value, setValue] = useState<any>(null);

  useEffect(() => {
    const checkValue = () => {
      const currentValue = getDataLayerValue(key);
      if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
        setValue(currentValue);
      }
    };

    checkValue();
    const interval = setInterval(checkValue, 1000);

    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail && event.detail[key] !== undefined) {
        checkValue();
      }
    };

    window.addEventListener('gtm-custom-event', handleGTMEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gtm-custom-event', handleGTMEvent as EventListener);
    };
  }, [key, value]);

  return value;
}

