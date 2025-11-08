# GTM Components Quick Reference

## Components

### 1. DynamicBanner
Automatically displays banners based on GTM dataLayer configuration.

**Features:**
- Multiple banner types (info, success, warning, error, festival, promo)
- Dismissible banners with localStorage persistence
- Date range support (startDate/endDate)
- Target by user segment, city, or role
- CTA buttons with tracking
- Top or bottom positioning

**Usage:** Already integrated in `app/layout.tsx`

### 2. ThemeManager
Applies dynamic themes based on GTM variables.

**Features:**
- Festival themes (Diwali, Holi, Eid, Christmas, New Year)
- Custom theme support via CSS variables
- Automatic theme switching
- Smooth transitions

**Usage:** Already integrated in `app/layout.tsx`

### 3. UserTracker
Automatically tracks user information to GTM.

**Features:**
- Tracks on login/logout
- Updates on location change
- User segment detection
- Automatic dataLayer pushes

**Usage:** Already integrated in `app/layout.tsx`

## Hooks

### useGTMTheme()
Returns current theme and festival theme from GTM.

```tsx
const { theme, festivalTheme } = useGTMTheme();
```

### useGTMBanner()
Returns current banner configuration from GTM.

```tsx
const banner = useGTMBanner();
```

### useUserSegment()
Returns current user segment from GTM.

```tsx
const segment = useUserSegment();
```

### useFestivalStatus(festivalName)
Checks if a specific festival is active.

```tsx
const isDiwali = useFestivalStatus('diwali');
```

### useGTMTracking()
Provides tracking functions for user actions.

```tsx
const { trackUser, trackPage, trackProperty, trackSearch } = useGTMTracking();
```

## Utilities

### lib/gtm.ts

**Functions:**
- `pushToDataLayer(data)` - Push data to GTM
- `getDataLayerValue(key)` - Get value from dataLayer
- `trackUserInfo(userInfo)` - Track user information
- `trackPageView(pageData)` - Track page views
- `trackPropertyInteraction(action, propertyData)` - Track property actions
- `trackSearch(searchData)` - Track search activity

## Example: Using in a Component

```tsx
"use client";

import { useGTMTheme, useGTMBanner, useGTMTracking } from '@/hooks/use-gtm';

export function MyComponent() {
  const { theme } = useGTMTheme();
  const banner = useGTMBanner();
  const { trackProperty } = useGTMTracking();
  
  return (
    <div>
      {theme === 'diwali' && <DiwaliContent />}
      {banner?.enabled && <p>{banner.message}</p>}
      <button onClick={() => trackProperty('view', { property_id: '123' })}>
        View Property
      </button>
    </div>
  );
}
```

