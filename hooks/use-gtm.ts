"use client";

import { useEffect, useState, useCallback } from 'react';
import {
  getGTMTheme,
  getGTMBanner,
  getGTMHeroBackground,
  getUserSegment,
  getFestivalTheme,
  isFestivalActive,
  trackUserInfo,
  trackPageView,
  trackPropertyInteraction,
} from '@/lib/gtm';
import type { BannerConfig } from '@/lib/gtm';

/**
 * Hook to get and react to GTM theme changes
 */
export function useGTMTheme() {
  const [theme, setTheme] = useState<string | null>(null);
  const [festivalTheme, setFestivalTheme] = useState<any>(null);
  const [activeFestival, setActiveFestival] = useState<string | null>(null);

  useEffect(() => {
    const checkTheme = () => {
      const currentTheme = getGTMTheme();
      const festival = getFestivalTheme();
      const festivalName = festival?.name || null;

      if (currentTheme !== theme) {
        setTheme(currentTheme);
      }
      if (JSON.stringify(festival) !== JSON.stringify(festivalTheme)) {
        setFestivalTheme(festival);
      }
      if (festivalName !== activeFestival) {
        setActiveFestival(festivalName);
      }
    };

    // Check immediately
    checkTheme();

    // Set up interval to check for changes
    const interval = setInterval(() => {
      checkTheme();
    }, 300);

    // Override dataLayer.push to detect theme changes
    if (typeof window !== 'undefined' && window.dataLayer) {
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args: any[]) {
        const result = originalPush.apply(this, args);
        if (args[0] && typeof args[0] === 'object') {
          if (args[0].theme || args[0].gtmTheme || args[0].festivalTheme || args[0].activeFestival) {
            setTimeout(checkTheme, 100);
          }
        }
        return result;
      };
    }

    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail?.theme || event.detail?.gtmTheme || event.detail?.festivalTheme) {
        checkTheme();
      }
    };

    window.addEventListener('gtm-custom-event', handleGTMEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gtm-custom-event', handleGTMEvent as EventListener);
    };
  }, [theme, festivalTheme, activeFestival]);

  return { theme, festivalTheme, activeFestival };
}

/**
 * Hook to get and react to GTM banner configuration
 */
export function useGTMBanner() {
  const [banner, setBanner] = useState<BannerConfig | null>(null);

  useEffect(() => {
    // Check dataLayer for banner changes
    const checkDataLayer = () => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        const lastEvent = window.dataLayer[window.dataLayer.length - 1];
        if (lastEvent && (lastEvent.banner || lastEvent.gtmBanner)) {
          return true;
        }
      }
      return false;
    };
    
    const checkBanner = () => {
      const currentBanner = getGTMBanner();
      
      // Always update if banner changed (including null to object or vice versa)
      const currentStr = JSON.stringify(currentBanner);
      const prevStr = JSON.stringify(banner);
      
      if (currentStr !== prevStr) {
        setBanner(currentBanner);
      }
    };

    // Check immediately
    checkBanner();

    // Set up interval to check for changes (more frequent like theme hook)
    const interval = setInterval(() => {
      if (checkDataLayer() || true) { // Always check
        checkBanner();
      }
    }, 300); // Check every 300ms (same as theme hook)

    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail?.gtmBanner || event.detail?.banner) {
        checkBanner();
      }
    };
    
    // Override dataLayer.push to detect banner changes
    if (typeof window !== 'undefined' && window.dataLayer) {
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args: any[]) {
        const result = originalPush.apply(this, args);
        if (args[0] && typeof args[0] === 'object') {
          if (args[0].banner || args[0].gtmBanner) {
            setTimeout(checkBanner, 100); // Small delay to ensure dataLayer is updated
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
  }, [banner]);

  return banner;
}

/**
 * Hook to get hero background image configuration from GTM
 */
export function useGTMHeroBackground() {
  const [heroConfig, setHeroConfig] = useState<{
    enabled: boolean;
    imageUrl: string;
    propertyTitle?: string;
    propertyType?: string;
    tag?: string;
    opacity?: number;
    position?: string;
  } | null>(null);

  useEffect(() => {
    const checkHeroBackground = () => {
      const heroBg = getGTMHeroBackground();
      
      if (heroBg) {
        const currentStr = JSON.stringify(heroBg);
        const prevStr = JSON.stringify(heroConfig);
        
        if (currentStr !== prevStr) {
          setHeroConfig(heroBg);
        }
      } else if (!heroBg && heroConfig) {
        setHeroConfig(null);
      }
    };

    // Check immediately
    checkHeroBackground();

    // Set up interval to check for changes
    const interval = setInterval(() => {
      checkHeroBackground();
    }, 300);

    // Override dataLayer.push to detect hero background changes
    if (typeof window !== 'undefined' && window.dataLayer) {
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args: any[]) {
        const result = originalPush.apply(this, args);
        if (args[0] && typeof args[0] === 'object') {
          if (args[0].heroBackground || args[0].gtmHeroBackground) {
            setTimeout(checkHeroBackground, 100);
          }
        }
        return result;
      };
    }

    const handleGTMEvent = (event: CustomEvent) => {
      if (event.detail?.heroBackground || event.detail?.gtmHeroBackground) {
        checkHeroBackground();
      }
    };

    window.addEventListener('gtm-custom-event', handleGTMEvent as EventListener);

    return () => {
      clearInterval(interval);
      window.removeEventListener('gtm-custom-event', handleGTMEvent as EventListener);
    };
  }, [heroConfig]);

  return heroConfig;
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
    const interval = setInterval(checkSegment, 1000);

    return () => clearInterval(interval);
  }, [segment]);

  return segment;
}

/**
 * Hook to check if a specific festival is active
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

    return () => clearInterval(interval);
  }, [festivalName, isActive]);

  return isActive;
}

/**
 * Hook to get GTM tracking functions
 */
export function useGTMTracking() {
  const trackUser = useCallback((userInfo: any) => {
    trackUserInfo(userInfo);
  }, []);

  const trackPage = useCallback((pageData: any) => {
    trackPageView(pageData);
  }, []);

  const trackProperty = useCallback((action: string, propertyData: any) => {
    trackPropertyInteraction(action, propertyData);
  }, []);

  const trackSearch = useCallback((searchData: any) => {
    trackSearch(searchData);
  }, []);

  return { trackUser, trackPage, trackProperty, trackSearch };
}
