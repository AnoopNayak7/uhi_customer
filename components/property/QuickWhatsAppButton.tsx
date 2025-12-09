"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { openWhatsAppChat, PropertyInfo } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface QuickWhatsAppButtonProps {
  property: PropertyInfo;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Compact WhatsApp Button for Property Cards
 *
 * Stops event propagation to prevent card click when button is clicked
 */
export const QuickWhatsAppButton = ({
  property,
  className,
  size = "sm",
  variant = "outline",
  onClick,
}: QuickWhatsAppButtonProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    // Call custom onClick if provided
    onClick?.(e);

    // Open WhatsApp
    openWhatsAppChat(property, undefined, {
      trackEvent: true,
    });
  };

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={variant}
      className={cn(
        "text-green-600 border-green-600 hover:bg-green-50",
        className
      )}
    >
      <MessageCircle className="w-3 h-3 mr-1" />
      WhatsApp
    </Button>
  );
};
