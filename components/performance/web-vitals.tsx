"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB } from "web-vitals";

// Production-ready Web Vitals monitoring
// Tracks Core Web Vitals for performance optimization

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  entries: PerformanceEntry[];
}

// Send metrics to analytics service (replace with your analytics provider)
function sendToAnalytics(metric: WebVitalsMetric) {
  // Example: Send to Google Analytics 4
  if (typeof window !== "undefined" && "gtag" in window) {
    (window as any).gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(
        metric.name === "CLS" ? metric.value * 1000 : metric.value
      ),
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: metric.delta,
      },
    });
  }

  // Example: Send to custom analytics endpoint
  if (process.env.NODE_ENV === "production") {
    fetch("/api/analytics/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch((error) => {
      console.warn("Failed to send Web Vitals metric:", error);
    });
  }

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vitals Metric:", {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    });
  }
}

export function WebVitals() {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return;

    // Track Core Web Vitals
    onCLS(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);

    // Track custom font loading performance
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        const fontLoadTime = performance.now();
        sendToAnalytics({
          id: "font-load-time",
          name: "FONT",
          value: fontLoadTime,
          rating:
            fontLoadTime < 1000
              ? "good"
              : fontLoadTime < 2500
              ? "needs-improvement"
              : "poor",
          delta: fontLoadTime,
          entries: [],
        });
      });
    }

    // Track image loading performance
    const imageObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (
          entry.entryType === "resource" &&
          entry.name.includes("images.unsplash.com")
        ) {
          const loadTime =
            (entry as PerformanceResourceTiming).responseEnd - entry.startTime;
          sendToAnalytics({
            id: `image-load-${entry.name}`,
            name: "IMG",
            value: loadTime,
            rating:
              loadTime < 500
                ? "good"
                : loadTime < 1500
                ? "needs-improvement"
                : "poor",
            delta: loadTime,
            entries: [entry],
          });
        }
      });
    });

    imageObserver.observe({ entryTypes: ["resource"] });

    return () => {
      imageObserver.disconnect();
    };
  }, []);

  // This component doesn't render anything
  return null;
}

// Hook for component-level performance tracking
export function usePerformanceMetric(name: string, value: number) {
  useEffect(() => {
    if (typeof window === "undefined" || !value) return;

    const metric: WebVitalsMetric = {
      id: `custom-${name}-${Date.now()}`,
      name: name.toUpperCase(),
      value,
      rating: "good", // You can implement custom rating logic
      delta: value,
      entries: [],
    };

    sendToAnalytics(metric);
  }, [name, value]);
}

// Performance budget alerts (development only)
export function PerformanceBudget() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // Alert for large images
        if (entry.entryType === "resource" && entry.name.includes("image")) {
          const size = (entry as any).transferSize;
          if (size > 500000) {
            // 500KB
            console.warn(
              `⚠️ Large image detected: ${entry.name} (${Math.round(
                size / 1024
              )}KB)`
            );
          }
        }

        // Alert for slow resources
        if (entry.entryType === "resource") {
          const loadTime =
            (entry as PerformanceResourceTiming).responseEnd - entry.startTime;
          if (loadTime > 2000) {
            // 2 seconds
            console.warn(
              `⚠️ Slow resource: ${entry.name} (${Math.round(loadTime)}ms)`
            );
          }
        }
      });
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => observer.disconnect();
  }, []);

  return null;
}
