/**
 * Google Tag Manager Utilities
 * 
 * This module provides utilities for interacting with GTM dataLayer
 * and managing dynamic UI updates based on GTM variables.
 */

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtmTheme?: string;
    gtmBanner?: any;
    gtmUserSegment?: string;
  }
}

/**
 * Push data to GTM dataLayer
 */
export const pushToDataLayer = (data: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

/**
 * Get value from GTM dataLayer
 */
export const getDataLayerValue = (key: string): any => {
  if (typeof window === 'undefined' || !window.dataLayer) {
    return null;
  }

  // Search through dataLayer for the key (newest first)
  for (let i = window.dataLayer.length - 1; i >= 0; i--) {
    const item = window.dataLayer[i];
    if (item && item[key] !== undefined && item[key] !== null) {
      // For objects, return the object itself
      if (typeof item[key] === 'object' && !Array.isArray(item[key])) {
        return item[key];
      }
      // For primitives, return the value
      return item[key];
    }
  }

  // Also check window object for GTM variables
  if (window[key as keyof Window] !== undefined) {
    return window[key as keyof Window];
  }

  return null;
};

/**
 * Set GTM variable
 * Also pushes simplified versions for GTM compatibility
 */
export const setGTMVariable = (key: string, value: any) => {
  if (typeof window !== 'undefined') {
    (window as any)[key] = value;
    pushToDataLayer({ [key]: value });
    
    // Map to simplified GTM variable names
    const gtmKeyMap: Record<string, string> = {
      'gtmTheme': 'theme',
      'gtmBanner': 'banner',
      'gtmUserSegment': 'userSegment',
    };
    
    if (gtmKeyMap[key]) {
      pushToDataLayer({ [gtmKeyMap[key]]: value });
    }
  }
};

/**
 * Track user information to GTM
 */
export const trackUserInfo = (userInfo: {
  userId?: string;
  email?: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  userSegment?: string;
}) => {
  pushToDataLayer({
    event: 'user_info',
    user_id: userInfo.userId,
    user_email: userInfo.email,
    user_role: userInfo.role,
    role: userInfo.role, // Simplified for GTM
    user_name: userInfo.firstName && userInfo.lastName 
      ? `${userInfo.firstName} ${userInfo.lastName}` 
      : undefined,
    user_city: userInfo.city,
    city: userInfo.city, // Simplified for GTM
    user_segment: userInfo.userSegment,
    userSegment: userInfo.userSegment, // Simplified for GTM
  });

  // Also set as window variable for easy access
  if (userInfo.userSegment) {
    setGTMVariable('gtmUserSegment', userInfo.userSegment);
  }
};

/**
 * Track page view with custom data
 */
export const trackPageView = (pageData?: {
  page_title?: string;
  page_path?: string;
  page_location?: string;
  property_type?: string;
  city?: string;
}) => {
  pushToDataLayer({
    event: 'page_view',
    ...pageData,
  });
};

/**
 * Track property interaction
 */
export const trackPropertyInteraction = (action: string, propertyData: {
  property_id: string;
  property_title?: string;
  property_price?: number;
  property_type?: string;
  property_city?: string;
}) => {
  pushToDataLayer({
    event: 'property_interaction',
    interaction_type: action, // 'view', 'favourite', 'compare', 'contact', etc.
    ...propertyData,
  });
};

/**
 * Track search/filter activity
 */
export const trackSearch = (searchData: {
  search_query?: string;
  filters?: Record<string, any>;
  results_count?: number;
  city?: string;
  property_type?: string;
}) => {
  pushToDataLayer({
    event: 'search',
    ...searchData,
  });
};

/**
 * Get current theme from GTM
 */
export const getGTMTheme = (): string | null => {
  const theme = getDataLayerValue('gtmTheme') || getDataLayerValue('theme') || null;
  
  // Debug logging
  if (process.env.NODE_ENV === 'development' && theme) {
    console.log('getGTMTheme found:', theme);
  }
  
  return theme;
};

/**
 * Get banner configuration from GTM
 */
export const getGTMBanner = (): any => {
  return getDataLayerValue('gtmBanner') || getDataLayerValue('banner') || null;
};

/**
 * Get user segment from GTM
 */
export const getUserSegment = (): string | null => {
  return getDataLayerValue('gtmUserSegment') || getDataLayerValue('user_segment') || null;
};

/**
 * Check if a festival/event is active
 */
export const isFestivalActive = (festivalName: string): boolean => {
  const activeFestival = getDataLayerValue('activeFestival');
  return activeFestival === festivalName || 
         (Array.isArray(activeFestival) && activeFestival.includes(festivalName));
};

/**
 * Get festival theme configuration
 */
export const getFestivalTheme = (): {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  banner?: any;
} | null => {
  const festival = getDataLayerValue('festivalTheme');
  return festival || null;
};

/**
 * Initialize GTM listener for custom events
 */
export const initGTMListener = (callback: (event: any) => void) => {
  if (typeof window === 'undefined') return;

  // Listen for custom GTM events
  window.addEventListener('gtm-custom-event', ((event: CustomEvent) => {
    callback(event.detail);
  }) as EventListener);

  // Also listen to dataLayer changes
  const originalPush = window.dataLayer?.push;
  if (originalPush && window.dataLayer) {
    window.dataLayer.push = function(...args: any[]) {
      const result = originalPush.apply(this, args);
      if (args[0] && typeof args[0] === 'object') {
        callback(args[0]);
      }
      return result;
    };
  }
};

