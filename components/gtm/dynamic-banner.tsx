"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGTMBanner } from "@/hooks/use-gtm";
import { motion, AnimatePresence } from "framer-motion";
import type { BannerConfig } from "@/lib/gtm";

// Re-export for convenience
export type { BannerConfig };

export function DynamicBanner() {
  const bannerConfig = useGTMBanner();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(
    new Set()
  );

  // Add/remove class to body when banner is visible at top
  useEffect(() => {
    if (typeof document !== "undefined") {
      const position = bannerConfig?.position || "top";
      if (isVisible && position === "top") {
        document.body.classList.add("banner-visible-top");
      } else {
        document.body.classList.remove("banner-visible-top");
      }
      return () => {
        document.body.classList.remove("banner-visible-top");
      };
    }
  }, [isVisible, bannerConfig?.position]);

  // Temporary debug - remove after testing
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("DynamicBanner - bannerConfig:", bannerConfig);
      console.log("DynamicBanner - isVisible:", isVisible);
    }
  }, [bannerConfig, isVisible]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("DynamicBanner - useEffect triggered", {
        hasBannerConfig: !!bannerConfig,
        enabled: bannerConfig?.enabled,
        dismissedBannersSize: dismissedBanners.size,
        dismissedBanners: Array.from(dismissedBanners),
      });
    }

    // Handle null/undefined bannerConfig
    if (!bannerConfig) {
      if (process.env.NODE_ENV === "development") {
        console.log("DynamicBanner - No bannerConfig, hiding");
      }
      setIsVisible(false);
      return;
    }

    // Handle empty object or missing enabled property
    if (bannerConfig.enabled !== true) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "DynamicBanner - Banner not enabled:",
          bannerConfig.enabled
        );
      }
      setIsVisible(false);
      return;
    }

    // Check if banner should be shown based on date range
    if (bannerConfig.startDate || bannerConfig.endDate) {
      const now = new Date();
      if (bannerConfig.startDate && new Date(bannerConfig.startDate) > now) {
        if (process.env.NODE_ENV === "development") {
          console.log("DynamicBanner - Banner startDate in future");
        }
        setIsVisible(false);
        return;
      }
      if (bannerConfig.endDate && new Date(bannerConfig.endDate) < now) {
        if (process.env.NODE_ENV === "development") {
          console.log("DynamicBanner - Banner endDate in past");
        }
        setIsVisible(false);
        return;
      }
    }

    // Check if banner was dismissed
    // Create a more unique banner ID using message, title, and startDate
    const bannerId = [
      bannerConfig.message,
      bannerConfig.title || "",
      bannerConfig.startDate || "",
    ]
      .filter(Boolean)
      .join("|");

    if (dismissedBanners.has(bannerId)) {
      if (process.env.NODE_ENV === "development") {
        console.log("DynamicBanner - Banner was dismissed:", bannerId);
        console.log(
          "DynamicBanner - To show this banner again, clear localStorage:"
        );
        console.log("localStorage.removeItem('dismissedBanners')");
      }
      setIsVisible(false);
      return;
    }

    // All checks passed - show banner
    if (process.env.NODE_ENV === "development") {
      console.log("DynamicBanner - All checks passed, showing banner");
    }
    setIsVisible(true);
  }, [bannerConfig, dismissedBanners]);

  const handleDismiss = () => {
    if (bannerConfig) {
      // Create a more unique banner ID using message, title, and startDate
      const bannerId = [
        bannerConfig.message,
        bannerConfig.title || "",
        bannerConfig.startDate || "",
      ]
        .filter(Boolean)
        .join("|");

      // Add to dismissedBanners state
      setDismissedBanners((prev) => new Set(prev).add(bannerId));
      setIsVisible(false);

      // Store in localStorage to persist dismissal
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("dismissedBanners");
        const dismissed = stored ? JSON.parse(stored) : [];
        if (!dismissed.includes(bannerId)) {
          dismissed.push(bannerId);
          localStorage.setItem("dismissedBanners", JSON.stringify(dismissed));
        }
      }
    }
  };

  const handleCTAClick = () => {
    if (bannerConfig?.ctaAction) {
      // Push custom event to GTM
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "banner_cta_click",
          banner_type: bannerConfig.type,
          banner_message: bannerConfig.message,
          cta_text: bannerConfig.ctaText,
        });
      }
    }

    if (bannerConfig?.ctaLink) {
      window.location.href = bannerConfig.ctaLink;
    }
  };

  // Load dismissed banners from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dismissedBanners");
      if (stored) {
        setDismissedBanners(new Set(JSON.parse(stored)));
      }
    }
  }, []);

  if (!isVisible || !bannerConfig) {
    return null;
  }

  const position = bannerConfig.position || "top";
  const type: keyof typeof typeStyles = bannerConfig.type || "info";

  // Type-based styling with improved, more visible design
  const typeStyles = {
    info: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100",
      text: bannerConfig.textColor || "text-blue-950",
      border: "border-blue-300",
      accent: "bg-blue-600",
    },
    success: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-green-100 via-emerald-50 to-green-100",
      text: bannerConfig.textColor || "text-green-950",
      border: "border-green-300",
      accent: "bg-green-600",
    },
    warning: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-yellow-100 via-amber-50 to-yellow-100",
      text: bannerConfig.textColor || "text-yellow-950",
      border: "border-yellow-300",
      accent: "bg-yellow-500",
    },
    error: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-red-100 via-rose-50 to-red-100",
      text: bannerConfig.textColor || "text-red-950",
      border: "border-red-300",
      accent: "bg-red-600",
    },
    festival: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100",
      text: bannerConfig.textColor || "text-purple-950",
      border: "border-purple-300",
      accent: "bg-gradient-to-r from-purple-600 to-pink-600",
    },
    promo: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-red-100 via-orange-100 to-red-100",
      text: bannerConfig.textColor || "text-red-950",
      border: "border-red-300",
      accent: "bg-gradient-to-r from-red-600 to-orange-600",
    },
  } as const;

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Banner */}
          <motion.div
            initial={{ y: position === "top" ? -100 : 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: position === "top" ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`gtm-banner fixed ${
              position === "top" ? "top-0" : "bottom-0"
            } left-0 right-0 z-[100] ${styles.bg} ${styles.text} border-b-2 ${
              styles.border
            } shadow-lg`}
            style={{
              position: "fixed",
              zIndex: 100,
              width: "100%",
              left: 0,
              right: 0,
              top: position === "top" ? 0 : undefined,
              bottom: position === "bottom" ? 0 : undefined,
              display: "block",
              visibility: "visible",
            }}
            data-banner-container="true"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-3 sm:gap-4 py-2.5 sm:py-3">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                  {bannerConfig.imageUrl && (
                    <div className="flex-shrink-0 hidden sm:block">
                      <Image
                        src={bannerConfig.imageUrl}
                        alt="Banner"
                        width={36}
                        height={36}
                        className="object-contain rounded-lg shadow-sm"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      {bannerConfig.title && (
                        <h3 className="font-semibold text-sm sm:text-base leading-tight flex-shrink-0">
                          {bannerConfig.title}
                        </h3>
                      )}
                      <p className="text-xs sm:text-sm leading-relaxed flex-1 min-w-0">
                        {bannerConfig.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                  {bannerConfig.ctaText && (
                    <Button
                      onClick={handleCTAClick}
                      size="sm"
                      className={`text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 h-auto rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 ${
                        type === "promo" || type === "festival"
                          ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                          : type === "success"
                          ? "bg-green-600 hover:bg-green-700 text-white"
                          : type === "warning"
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : type === "error"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      {bannerConfig.ctaText}
                    </Button>
                  )}
                  {bannerConfig.dismissible !== false && (
                    <button
                      onClick={handleDismiss}
                      className="flex-shrink-0 h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-black/10 active:bg-black/20 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black/20"
                      aria-label="Dismiss banner"
                    >
                      <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
