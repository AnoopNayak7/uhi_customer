# Google Tag Manager Integration Guide

This guide explains how to leverage Google Tag Manager (GTM) for dynamic UI updates, user tracking, and personalized experiences in the Urbanhousein platform.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Use Cases](#use-cases)
4. [GTM Setup](#gtm-setup)
5. [Implementation Examples](#implementation-examples)
6. [Best Practices](#best-practices)

## Overview

The GTM integration allows you to:
- **Dynamically change themes** based on festivals, seasons, or campaigns
- **Display targeted banners** to specific user segments
- **Track user information** and behavior
- **Personalize UI** without code deployments
- **A/B test** different UI configurations

## Architecture

### Components Created

1. **`lib/gtm.ts`** - Core GTM utilities for dataLayer interactions
2. **`hooks/use-gtm.ts`** - React hooks for GTM data
3. **`components/gtm/dynamic-banner.tsx`** - Dynamic banner component
4. **`components/gtm/theme-manager.tsx`** - Theme management component
5. **`components/gtm/user-tracker.tsx`** - Automatic user tracking

### Data Flow

```
GTM Container → dataLayer → React Components → UI Updates
```

## Use Cases

### 1. Festival-Based Theme Changes

**Example: Diwali Theme**

In GTM, create a Custom HTML tag that runs on page load:

```javascript
<script>
  (function() {
    // Check if Diwali is active (Oct-Nov)
    var today = new Date();
    var month = today.getMonth() + 1; // 1-12
    var day = today.getDate();
    
    // Diwali typically falls in October or November
    if ((month === 10 && day >= 20) || (month === 11 && day <= 5)) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'festival_theme',
        festivalTheme: {
          name: 'diwali',
          colors: {
            primary: 'hsl(35, 100%, 50%)', // Gold
            secondary: 'hsl(45, 100%, 60%)', // Light Gold
            accent: 'hsl(0, 100%, 50%)' // Red
          }
        },
        activeFestival: 'diwali'
      });
    }
  })();
</script>
```

**GTM Trigger:** Page View - All Pages

### 2. Customer-Specific Banners

**Example: Show banner to users in Bangalore**

In GTM, create a Custom HTML tag:

```javascript
<script>
  (function() {
    // Wait for user data to be available
    setTimeout(function() {
      var userCity = window.dataLayer.find(function(item) {
        return item.user_city;
      });
      
      if (userCity && userCity.user_city === 'Bengaluru') {
        window.dataLayer.push({
          event: 'banner_update',
          gtmBanner: {
            enabled: true,
            type: 'promo',
            title: 'Special Offer in Bangalore!',
            message: 'Get 5% off on all properties in Bangalore this month',
            ctaText: 'View Properties',
            ctaLink: '/properties?city=Bengaluru',
            backgroundColor: '#fef2f2',
            textColor: '#991b1b',
            position: 'top',
            dismissible: true,
            targetCity: 'Bengaluru',
            startDate: '2025-01-01',
            endDate: '2025-01-31'
          }
        });
      }
    }, 2000);
  })();
</script>
```

**GTM Trigger:** Page View - All Pages (with delay)

### 3. User Segment-Based Personalization

**Example: Show different content to builders vs regular users**

In GTM, create a Custom HTML tag:

```javascript
<script>
  (function() {
    // Check user role from dataLayer
    var userRole = window.dataLayer.find(function(item) {
      return item.user_role;
    });
    
    if (userRole && userRole.user_role === 'builder') {
      window.dataLayer.push({
        event: 'user_segment',
        gtmUserSegment: 'builder',
        gtmBanner: {
          enabled: true,
          type: 'info',
          message: 'Welcome back! Manage your properties from the dashboard.',
          ctaText: 'Go to Dashboard',
          ctaLink: '/dashboard',
          targetRole: 'builder'
        }
      });
    }
  })();
</script>
```

### 4. Seasonal Campaigns

**Example: New Year Sale Banner**

```javascript
<script>
  (function() {
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    
    // Show banner in December and early January
    if ((month === 12 && day >= 20) || (month === 1 && day <= 10)) {
      window.dataLayer.push({
        event: 'campaign_banner',
        gtmBanner: {
          enabled: true,
          type: 'promo',
          title: 'New Year Special!',
          message: 'Start 2025 with your dream home. Special discounts available!',
          ctaText: 'Explore Properties',
          ctaLink: '/properties',
          backgroundColor: 'linear-gradient(to right, #fef2f2, #fff7ed)',
          textColor: '#991b1b',
          imageUrl: '/images/new-year-banner.jpg'
        },
        festivalTheme: {
          name: 'newyear',
          colors: {
            primary: 'hsl(280, 100%, 60%)',
            secondary: 'hsl(200, 100%, 50%)',
            accent: 'hsl(0, 0%, 100%)'
          }
        }
      });
    }
  })();
</script>
```

## GTM Setup

> **Important:** GTM Custom HTML tags run in a restricted JavaScript environment. Always use `var` instead of `const` or `let` for variable declarations to ensure compatibility.

### Step 1: Create Variables

1. Go to **Variables** → **New**
2. Create these variables:
   - `user_city` - Data Layer Variable
   - `user_role` - Data Layer Variable
   - `user_segment` - Data Layer Variable
   - `activeFestival` - Data Layer Variable
   - `gtmTheme` - Data Layer Variable
   - `gtmBanner` - Data Layer Variable

### Step 2: Create Triggers

1. **Page View Trigger**
   - Type: Page View
   - Fires on: All Pages

2. **User Authenticated Trigger**
   - Type: Custom Event
   - Event name: `user_authenticated`

3. **Festival Theme Trigger**
   - Type: Custom Event
   - Event name: `festival_theme`

### Step 3: Create Tags

#### Tag 1: Festival Theme Checker
- **Type:** Custom HTML
- **Trigger:** Page View - All Pages
- **HTML:** (Use festival theme example above)

#### Tag 2: User Segment Banner
- **Type:** Custom HTML
- **Trigger:** User Authenticated
- **HTML:** (Use user segment example above)

#### Tag 3: City-Specific Banner
- **Type:** Custom HTML
- **Trigger:** Page View - All Pages
- **HTML:** (Use city-specific example above)

## Implementation Examples

### Example 1: Using GTM Hooks in Components

```tsx
import { useGTMTheme, useGTMBanner, useUserSegment } from '@/hooks/use-gtm';

export function MyComponent() {
  const { theme, festivalTheme } = useGTMTheme();
  const banner = useGTMBanner();
  const segment = useUserSegment();
  
  return (
    <div>
      {theme === 'diwali' && <DiwaliDecoration />}
      {segment === 'builder' && <BuilderTools />}
    </div>
  );
}
```

### Example 2: Tracking User Actions

```tsx
import { useGTMTracking } from '@/hooks/use-gtm';

export function PropertyCard({ property }) {
  const { trackProperty } = useGTMTracking();
  
  const handleView = () => {
    trackProperty('view', {
      property_id: property.id,
      property_title: property.title,
      property_price: property.price,
      property_type: property.type,
      property_city: property.city,
    });
  };
  
  return <div onClick={handleView}>...</div>;
}
```

### Example 3: Conditional Rendering Based on GTM

```tsx
import { useFestivalStatus } from '@/hooks/use-gtm';

export function HomePage() {
  const isDiwali = useFestivalStatus('diwali');
  
  return (
    <div>
      {isDiwali && <DiwaliSpecialSection />}
      <RegularContent />
    </div>
  );
}
```

## Best Practices

### 1. Performance
- Use debouncing for frequent dataLayer checks
- Cache GTM values in component state
- Avoid blocking renders with GTM calls

### 2. Error Handling
- Always check if `window.dataLayer` exists
- Handle cases where GTM hasn't loaded yet
- Provide fallback values

### 3. Testing
- Use GTM Preview mode to test changes
- Test with different user segments
- Verify theme changes don't break UI

### 4. Security
- Never push sensitive user data to dataLayer
- Sanitize user inputs before pushing
- Use HTTPS for all GTM communications

### 5. Monitoring
- Track banner click rates
- Monitor theme change events
- Log errors in GTM debug mode

## Available GTM Variables

The following variables can be set in GTM and will be automatically picked up:

- `gtmTheme` - Theme name (e.g., 'diwali', 'holi', 'christmas')
- `festivalTheme` - Full festival theme object with colors
- `gtmBanner` - Banner configuration object
- `gtmUserSegment` - User segment (e.g., 'builder', 'verified_user')
- `activeFestival` - Currently active festival name
- `user_city` - User's city
- `user_role` - User's role
- `user_id` - User's ID

## Troubleshooting

### Banner not showing?
1. Check if `gtmBanner.enabled` is `true`
2. Verify date range is valid
3. Check if banner was dismissed
4. Verify target segment/city/role matches

### Theme not applying?
1. Check browser console for errors
2. Verify `festivalTheme` object structure
3. Check CSS variables are being set
4. Clear browser cache

### User data not tracking?
1. Verify user is authenticated
2. Check `UserTracker` component is mounted
3. Verify dataLayer is receiving events
4. Check GTM Preview mode

## Advanced Use Cases

### 1. A/B Testing UI Elements

```javascript
// In GTM
var variant = Math.random() < 0.5 ? 'A' : 'B';
window.dataLayer.push({
  event: 'ab_test',
  variant: variant,
  test_name: 'header_color'
});
```

### 2. Dynamic Content Based on Location

```javascript
// In GTM - Use geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    // Determine city from coordinates
    var city = getCityFromCoordinates(position.coords);
    window.dataLayer.push({
      event: 'location_detected',
      user_city: city
    });
  });
}
```

### 3. Time-Based Promotions

```javascript
// In GTM
var hour = new Date().getHours();
if (hour >= 9 && hour <= 17) {
  window.dataLayer.push({
    event: 'business_hours',
    gtmBanner: {
      enabled: true,
      message: 'Call us now! We\'re open.',
      type: 'info'
    }
  });
}
```

## Support

For questions or issues:
1. Check GTM Preview mode
2. Review browser console logs
3. Verify dataLayer contents
4. Test with different user segments

---

**Last Updated:** January 2025
**GTM Container ID:** GTM-KVLFHQBW

