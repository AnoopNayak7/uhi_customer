"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useLocationStore } from "@/lib/store";
import { trackUserInfo } from "@/lib/gtm";

/**
 * User Tracker Component
 *
 * Automatically tracks user information to GTM dataLayer
 * Updates when user logs in/out or changes location
 */
export function UserTracker() {
  const { user, isAuthenticated } = useAuthStore();
  const { selectedLocation } = useLocationStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Determine user segment based on role and behavior
      let userSegment = "visitor";

      if (user.role === "builder") {
        userSegment = "builder";
      } else if (user.role === "admin") {
        userSegment = "admin";
      } else if (user.isVerified) {
        userSegment = "verified_user";
      } else {
        userSegment = "registered_user";
      }

      // Track user information to GTM
      trackUserInfo({
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        city: selectedLocation?.city || undefined,
        userSegment,
      });

      // Push additional user properties
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "user_authenticated",
          user_id: user.id,
          role: user.role,
          user_verified: user.isVerified,
          city: selectedLocation?.city,
        });
      }
    } else {
      // Track anonymous user
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "user_anonymous",
          userSegment: "visitor",
          city: selectedLocation?.city,
        });
      }
    }
  }, [user, isAuthenticated, selectedLocation]);

  return null; // This component doesn't render anything
}
