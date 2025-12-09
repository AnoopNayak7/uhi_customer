"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { openWhatsAppChat, PropertyInfo } from "@/lib/whatsapp";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
  property: PropertyInfo;
  customMessage?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
  trackEvent?: boolean;
}

/**
 * Reusable WhatsApp Button Component
 *
 * Opens WhatsApp chat with pre-filled property information
 */
export const WhatsAppButton = ({
  property,
  customMessage,
  variant = "default",
  size = "default",
  className,
  showIcon = true,
  children,
  trackEvent = true,
}: WhatsAppButtonProps) => {
  const handleClick = () => {
    openWhatsAppChat(property, customMessage, {
      trackEvent,
      onSuccess: () => {
        toast.success("Opening WhatsApp...");
      },
      onError: (error) => {
        toast.error("Failed to open WhatsApp. Please try again.");
        console.error("WhatsApp error:", error);
      },
    });
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn("bg-green-600 hover:bg-green-700 text-white", className)}
    >
      {/* {showIcon && <MessageCircle className="w-4 h-4 mr-2" />} */}
      {children || "Chat on WhatsApp"}
    </Button>
  );
};
