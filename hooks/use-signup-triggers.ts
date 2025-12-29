"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/lib/store";
import { usePathname } from "next/navigation";

interface UserBehavior {
  propertiesViewed: number;
  toolsUsed: number;
  timeOnSite: number; // in seconds
  lastPromptTime: number;
  dismissedPrompts: Set<string>;
}

const STORAGE_KEY = "urbanhousein-user-behavior";

export function useSignupTriggers() {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [behavior, setBehavior] = useState<UserBehavior>({
    propertiesViewed: 0,
    toolsUsed: 0,
    timeOnSite: 0,
    lastPromptTime: 0,
    dismissedPrompts: new Set(),
  });

  // Load behavior from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBehavior({
          ...parsed,
          dismissedPrompts: new Set(parsed.dismissedPrompts || []),
        });
      } catch (error) {
        console.error("Error loading user behavior:", error);
      }
    }
  }, []);

  // Track time on site
  useEffect(() => {
    if (isAuthenticated) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setBehavior((prev) => ({
        ...prev,
        timeOnSite: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Save behavior to localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const toStore = {
      ...behavior,
      dismissedPrompts: Array.from(behavior.dismissedPrompts),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [behavior]);

  // Track property view
  const trackPropertyView = useCallback(() => {
    if (isAuthenticated) return;
    
    setBehavior((prev) => ({
      ...prev,
      propertiesViewed: prev.propertiesViewed + 1,
    }));

    // Track in analytics
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "property_view",
        total_views: behavior.propertiesViewed + 1,
      });
    }
  }, [isAuthenticated, behavior.propertiesViewed]);

  // Track tool usage
  const trackToolUsage = useCallback((toolName: string) => {
    if (isAuthenticated) return;
    
    setBehavior((prev) => ({
      ...prev,
      toolsUsed: prev.toolsUsed + 1,
    }));

    // Track in analytics
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "tool_usage",
        tool_name: toolName,
        total_uses: behavior.toolsUsed + 1,
      });
    }
  }, [isAuthenticated, behavior.toolsUsed]);

  // Check if should show prompt
  const shouldShowPrompt = useCallback(
    (trigger: string): boolean => {
      if (isAuthenticated) return false;

      // Check if dismissed recently (24 hours)
      const dismissedKey = `signup-prompt-dismissed-${trigger}`;
      const dismissedTime = localStorage.getItem(dismissedKey);
      if (dismissedTime) {
        const hoursSinceDismiss = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
        if (hoursSinceDismiss < 24) return false;
      }

      // Check if already dismissed this trigger
      if (behavior.dismissedPrompts.has(trigger)) {
        const lastPrompt = behavior.lastPromptTime;
        const hoursSincePrompt = (Date.now() - lastPrompt) / (1000 * 60 * 60);
        if (hoursSincePrompt < 24) return false;
      }

      // Trigger-specific logic
      switch (trigger) {
        case "engagement":
          return behavior.propertiesViewed >= 3 || behavior.timeOnSite >= 300; // 3 properties or 5 minutes
        case "favorite":
          return behavior.propertiesViewed >= 2;
        case "compare":
          return behavior.propertiesViewed >= 2;
        case "tool-usage":
          return behavior.toolsUsed >= 2;
        case "save-search":
          return behavior.propertiesViewed >= 3;
        default:
          return false;
      }
    },
    [isAuthenticated, behavior]
  );

  // Mark prompt as shown
  const markPromptShown = useCallback((trigger: string) => {
    setBehavior((prev) => ({
      ...prev,
      lastPromptTime: Date.now(),
      dismissedPrompts: new Set(prev.dismissedPrompts).add(trigger),
    }));
  }, []);

  // Reset behavior (for testing)
  const resetBehavior = useCallback(() => {
    setBehavior({
      propertiesViewed: 0,
      toolsUsed: 0,
      timeOnSite: 0,
      lastPromptTime: 0,
      dismissedPrompts: new Set(),
    });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    behavior,
    trackPropertyView,
    trackToolUsage,
    shouldShowPrompt,
    markPromptShown,
    resetBehavior,
  };
}



