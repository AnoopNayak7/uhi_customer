"use client";

import { useEffect } from "react";
import { useGTMTheme, useFestivalStatus } from "@/hooks/use-gtm";
import { getFestivalTheme } from "@/lib/gtm";
import { applyTheme, festivalThemes } from "@/lib/theme-config";

/**
 * Theme Manager Component
 *
 * Dynamically applies theme changes based on GTM variables
 * Supports festival themes, seasonal themes, and custom themes
 */
export function ThemeManager() {
  const { theme, festivalTheme } = useGTMTheme();

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const root = document.documentElement;
    const festival = getFestivalTheme();

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("ThemeManager effect:", {
        theme,
        festivalTheme,
        hasFestival: !!festival,
      });
    }

    // Apply festival theme if available (from festivalTheme object)
    if (festival && festival.colors) {
      const { primary, secondary, accent } = festival.colors;

      // Convert hex/rgb to HSL if needed, or use directly
      // For simplicity, assuming colors are in CSS variable format or hex
      if (primary) {
        root.style.setProperty("--festival-primary", primary);
        root.style.setProperty("--primary", primary);
      }
      if (secondary) {
        root.style.setProperty("--festival-secondary", secondary);
        root.style.setProperty("--secondary", secondary);
      }
      if (accent) {
        root.style.setProperty("--festival-accent", accent);
        root.style.setProperty("--accent", accent);
      }

      // Add festival class to body
      root.classList.add("festival-theme");
      root.setAttribute("data-festival", festival.name);
      root.setAttribute("data-theme", festival.name);
    } else if (theme) {
      // Apply theme from GTM theme variable (e.g., theme: "diwali")
      root.setAttribute("data-theme", theme);

      // Apply comprehensive theme-specific styles
      if (festivalThemes[theme]) {
        applyTheme(root, theme);
        root.classList.add("festival-theme");
        root.setAttribute("data-festival", theme);
      } else {
        // Fallback to old theme functions for backward compatibility
        switch (theme) {
          case "diwali":
            applyDiwaliTheme(root);
            root.classList.add("festival-theme");
            root.setAttribute("data-festival", "diwali");
            break;
          case "holi":
            applyHoliTheme(root);
            root.classList.add("festival-theme");
            root.setAttribute("data-festival", "holi");
            break;
          case "eid":
            applyEidTheme(root);
            root.classList.add("festival-theme");
            root.setAttribute("data-festival", "eid");
            break;
          case "christmas":
            applyChristmasTheme(root);
            root.classList.add("festival-theme");
            root.setAttribute("data-festival", "christmas");
            break;
          case "newyear":
            applyNewYearTheme(root);
            root.classList.add("festival-theme");
            root.setAttribute("data-festival", "newyear");
            break;
          default:
            // Custom theme - GTM will provide CSS variables
            break;
        }
      }
    } else {
      // Remove all theme classes and attributes
      root.classList.remove(
        "festival-theme",
        "festival-diwali",
        "festival-holi",
        "festival-eid",
        "festival-christmas",
        "festival-newyear"
      );
      root.removeAttribute("data-festival");
      root.removeAttribute("data-theme");

      // Remove all custom theme CSS variables that were set by applyTheme
      // This ensures default colors are restored when no theme is active
      root.style.removeProperty("--festival-primary");
      root.style.removeProperty("--festival-secondary");
      root.style.removeProperty("--festival-accent");

      // Remove all CSS variables that might have been set by applyTheme
      root.style.removeProperty("--primary");
      root.style.removeProperty("--primary-foreground");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--secondary-foreground");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--accent-foreground");
      root.style.removeProperty("--background");
      root.style.removeProperty("--foreground");
      root.style.removeProperty("--card");
      root.style.removeProperty("--card-foreground");
      root.style.removeProperty("--popover");
      root.style.removeProperty("--popover-foreground");
      root.style.removeProperty("--muted");
      root.style.removeProperty("--muted-foreground");
      root.style.removeProperty("--destructive");
      root.style.removeProperty("--destructive-foreground");
      root.style.removeProperty("--border");
      root.style.removeProperty("--input");
      root.style.removeProperty("--ring");
      root.style.removeProperty("--chart-1");
      root.style.removeProperty("--chart-2");
      root.style.removeProperty("--chart-3");
      root.style.removeProperty("--chart-4");
      root.style.removeProperty("--chart-5");

      // After removing inline styles, CSS defaults from :root will apply
    }

    // Debug logging (remove in production)
    if (process.env.NODE_ENV === "development") {
      console.log("ThemeManager applied:", {
        "data-theme": root.getAttribute("data-theme"),
        "data-festival": root.getAttribute("data-festival"),
        "has-festival-theme-class": root.classList.contains("festival-theme"),
        "primary-color": getComputedStyle(root).getPropertyValue("--primary"),
      });
    }
  }, [theme, festivalTheme]);

  return null; // This component doesn't render anything
}

// Festival-specific theme functions
// Note: CSS variables should be set WITHOUT hsl() wrapper for Tailwind compatibility
// Tailwind uses hsl(var(--primary)) so we need just the values: "35 100% 50%"
function applyDiwaliTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "35 100% 50%"); // Gold/Orange
  root.style.setProperty("--secondary", "45 100% 60%"); // Light Gold
  root.style.setProperty("--accent", "0 100% 50%"); // Red
  root.classList.add("festival-diwali");
}

function applyHoliTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "300 100% 60%"); // Pink
  root.style.setProperty("--secondary", "120 100% 50%"); // Green
  root.style.setProperty("--accent", "240 100% 60%"); // Blue
  root.classList.add("festival-holi");
}

function applyEidTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "210 100% 50%"); // Blue
  root.style.setProperty("--secondary", "150 100% 40%"); // Green
  root.style.setProperty("--accent", "45 100% 50%"); // Gold
  root.classList.add("festival-eid");
}

function applyChristmasTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "0 100% 40%"); // Red
  root.style.setProperty("--secondary", "120 100% 30%"); // Green
  root.style.setProperty("--accent", "45 100% 50%"); // Gold
  root.classList.add("festival-christmas");
}

function applyNewYearTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "280 100% 60%"); // Purple
  root.style.setProperty("--secondary", "200 100% 50%"); // Cyan
  root.style.setProperty("--accent", "0 0% 100%"); // White
  root.classList.add("festival-newyear");
}
