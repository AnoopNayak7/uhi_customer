"use client";

import { motion } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TouchButtonProps extends ButtonProps {
  haptic?: boolean;
  touchScale?: number;
}

export const TouchButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  (
    {
      className,
      haptic = true,
      touchScale = 0.95,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback on mobile devices
      if (haptic && "vibrate" in navigator) {
        navigator.vibrate(10); // Very light vibration
      }

      if (onClick) {
        onClick(e);
      }
    };

    return (
      <motion.div
        whileTap={{ scale: touchScale }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          className={cn(
            "touch-manipulation select-none", // Optimize for touch
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

TouchButton.displayName = "TouchButton";
