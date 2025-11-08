"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGTMBanner } from "@/hooks/use-gtm";
import { motion, AnimatePresence } from "framer-motion";

interface BannerConfig {
  enabled: boolean;
  type: "info" | "success" | "warning" | "error" | "festival" | "promo";
  message: string;
  title?: string;
  ctaText?: string;
  ctaLink?: string;
  ctaAction?: string;
  backgroundColor?: string;
  textColor?: string;
  position?: "top" | "bottom";
  dismissible?: boolean;
  targetSegment?: string; // Show only to specific user segments
  targetCity?: string; // Show only to specific cities
  targetRole?: string; // Show only to specific roles
  imageUrl?: string;
  startDate?: string;
  endDate?: string;
}

export function DynamicBanner() {
  const bannerConfig = useGTMBanner();
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!bannerConfig || !bannerConfig.enabled) {
      setIsVisible(false);
      return;
    }

    // Check if banner should be shown based on date range
    if (bannerConfig.startDate || bannerConfig.endDate) {
      const now = new Date();
      if (bannerConfig.startDate && new Date(bannerConfig.startDate) > now) {
        setIsVisible(false);
        return;
      }
      if (bannerConfig.endDate && new Date(bannerConfig.endDate) < now) {
        setIsVisible(false);
        return;
      }
    }

    // Check if banner was dismissed
    const bannerId = bannerConfig.message + (bannerConfig.startDate || "");
    if (dismissedBanners.has(bannerId)) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
  }, [bannerConfig, dismissedBanners]);

  const handleDismiss = () => {
    if (bannerConfig) {
      const bannerId = bannerConfig.message + (bannerConfig.startDate || "");
      setDismissedBanners((prev) => new Set(prev).add(bannerId));
      setIsVisible(false);

      // Store in localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("dismissedBanners");
        const dismissed = stored ? JSON.parse(stored) : [];
        dismissed.push(bannerId);
        localStorage.setItem("dismissedBanners", JSON.stringify(dismissed));
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

  if (!isVisible || !bannerConfig) return null;

  const position = bannerConfig.position || "top";
  const type: keyof typeof typeStyles = bannerConfig.type || "info";

  // Type-based styling
  const typeStyles = {
    info: {
      bg: bannerConfig.backgroundColor || "bg-blue-50",
      text: bannerConfig.textColor || "text-blue-900",
      border: "border-blue-200",
    },
    success: {
      bg: bannerConfig.backgroundColor || "bg-green-50",
      text: bannerConfig.textColor || "text-green-900",
      border: "border-green-200",
    },
    warning: {
      bg: bannerConfig.backgroundColor || "bg-yellow-50",
      text: bannerConfig.textColor || "text-yellow-900",
      border: "border-yellow-200",
    },
    error: {
      bg: bannerConfig.backgroundColor || "bg-red-50",
      text: bannerConfig.textColor || "text-red-900",
      border: "border-red-200",
    },
    festival: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-purple-50 to-pink-50",
      text: bannerConfig.textColor || "text-purple-900",
      border: "border-purple-200",
    },
    promo: {
      bg:
        bannerConfig.backgroundColor ||
        "bg-gradient-to-r from-red-50 to-orange-50",
      text: bannerConfig.textColor || "text-red-900",
      border: "border-red-200",
    },
  } as const;

  const styles = typeStyles[type] || typeStyles.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${
            position === "top" ? "top-0" : "bottom-0"
          } left-0 right-0 z-50 ${styles.bg} ${styles.text} border-b ${
            styles.border
          } shadow-lg`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                {bannerConfig.imageUrl && (
                  <Image
                    src={bannerConfig.imageUrl}
                    alt="Banner"
                    width={32}
                    height={32}
                    className="object-contain rounded"
                  />
                )}
                <div className="flex-1">
                  {bannerConfig.title && (
                    <h3 className="font-semibold text-sm sm:text-base mb-1">
                      {bannerConfig.title}
                    </h3>
                  )}
                  <p className="text-sm sm:text-base">{bannerConfig.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {bannerConfig.ctaText && (
                  <Button
                    onClick={handleCTAClick}
                    size="sm"
                    className={`${styles.text} border-2 ${styles.border} hover:opacity-80 transition-opacity`}
                    variant="outline"
                  >
                    {bannerConfig.ctaText}
                  </Button>
                )}
                {bannerConfig.dismissible !== false && (
                  <Button
                    onClick={handleDismiss}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-black/10"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
