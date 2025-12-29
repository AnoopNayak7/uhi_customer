"use client";

import { useEffect, useState } from "react";

/**
 * Detects when user is about to leave the page (exit intent)
 * Works by detecting mouse movement towards the top of the page
 */
export function useExitIntent(onExitIntent: () => void) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving upward (towards browser bar)
      if (e.clientY <= 0) {
        onExitIntent();
        setEnabled(false); // Only show once per session
      }
    };

    // Also detect when user tries to close tab/window
    const handleBeforeUnload = () => {
      // This is a fallback, but browser restrictions limit what we can do
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [enabled, onExitIntent]);

  return { enabled, setEnabled };
}



