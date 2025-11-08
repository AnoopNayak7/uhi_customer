"use client";

import { useEffect } from "react";
import { useGTMTheme, useFestivalStatus } from "@/hooks/use-gtm";
import { getFestivalTheme } from "@/lib/gtm";

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

    // Apply festival theme if available
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
    } else {
      // Remove festival theme
      root.classList.remove("festival-theme");
      root.removeAttribute("data-festival");
      root.style.removeProperty("--festival-primary");
      root.style.removeProperty("--festival-secondary");
      root.style.removeProperty("--festival-accent");
    }

    // Apply custom theme if specified
    if (theme && !festival) {
      root.setAttribute("data-theme", theme);

      // Apply theme-specific styles
      switch (theme) {
        case "diwali":
          applyDiwaliTheme(root);
          break;
        case "holi":
          applyHoliTheme(root);
          break;
        case "eid":
          applyEidTheme(root);
          break;
        case "christmas":
          applyChristmasTheme(root);
          break;
        case "newyear":
          applyNewYearTheme(root);
          break;
        default:
          // Custom theme - GTM will provide CSS variables
          break;
      }
    } else if (!theme && !festival) {
      root.removeAttribute("data-theme");
    }
  }, [theme, festivalTheme]);

  return null; // This component doesn't render anything
}

// Festival-specific theme functions
function applyDiwaliTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "hsl(35, 100%, 50%)"); // Gold/Orange
  root.style.setProperty("--secondary", "hsl(45, 100%, 60%)"); // Light Gold
  root.style.setProperty("--accent", "hsl(0, 100%, 50%)"); // Red
  root.classList.add("festival-diwali");
}

function applyHoliTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "hsl(300, 100%, 60%)"); // Pink
  root.style.setProperty("--secondary", "hsl(120, 100%, 50%)"); // Green
  root.style.setProperty("--accent", "hsl(240, 100%, 60%)"); // Blue
  root.classList.add("festival-holi");
}

function applyEidTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "hsl(210, 100%, 50%)"); // Blue
  root.style.setProperty("--secondary", "hsl(150, 100%, 40%)"); // Green
  root.style.setProperty("--accent", "hsl(45, 100%, 50%)"); // Gold
  root.classList.add("festival-eid");
}

function applyChristmasTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "hsl(0, 100%, 40%)"); // Red
  root.style.setProperty("--secondary", "hsl(120, 100%, 30%)"); // Green
  root.style.setProperty("--accent", "hsl(45, 100%, 50%)"); // Gold
  root.classList.add("festival-christmas");
}

function applyNewYearTheme(root: HTMLElement) {
  root.style.setProperty("--primary", "hsl(280, 100%, 60%)"); // Purple
  root.style.setProperty("--secondary", "hsl(200, 100%, 50%)"); // Cyan
  root.style.setProperty("--accent", "hsl(0, 0%, 100%)"); // White
  root.classList.add("festival-newyear");
}
