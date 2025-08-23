"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { ReactNode, useState, useEffect } from "react";

// Hook to detect mobile device
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Reduced motion for performance on mobile
export const getMobileOptimizedTransition = (isMobile: boolean) => ({
  duration: isMobile ? 0.3 : 0.6,
  ease: isMobile ? "easeOut" : [0.25, 0.46, 0.45, 0.94],
});

// Mobile-optimized fade in
export const MobileFadeIn = ({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        ...getMobileOptimizedTransition(isMobile),
        delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Swipe to dismiss component
interface SwipeToDismissProps {
  children: ReactNode;
  onDismiss: () => void;
  className?: string;
  threshold?: number;
}

export const SwipeToDismiss = ({
  children,
  onDismiss,
  className,
  threshold = 100,
}: SwipeToDismissProps) => {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-threshold, 0, threshold], [0.5, 1, 0.5]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (Math.abs(info.offset.x) > threshold) {
      onDismiss();
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      style={{ x, opacity }}
      whileDrag={{ scale: 0.95 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Pull to refresh component
interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  className?: string;
  threshold?: number;
}

export const PullToRefresh = ({
  children,
  onRefresh,
  className,
  threshold = 80,
}: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const y = useMotionValue(0);
  const rotate = useTransform(y, [0, threshold], [0, 180]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (info.offset.y > threshold && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  };

  return (
    <motion.div className={className}>
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="relative"
      >
        {/* Refresh indicator */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full p-4"
          style={{ rotate }}
          animate={isRefreshing ? { rotate: 360 } : {}}
          transition={
            isRefreshing
              ? { duration: 1, repeat: Infinity, ease: "linear" }
              : {}
          }
        >
          <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full" />
        </motion.div>

        {children}
      </motion.div>
    </motion.div>
  );
};

// Touch-friendly button with haptic feedback
export const TouchButton = ({
  children,
  onClick,
  className,
  haptic = true,
}: {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  haptic?: boolean;
}) => {
  const handleTap = () => {
    if (haptic && "vibrate" in navigator) {
      navigator.vibrate(10); // Light haptic feedback
    }
    onClick();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onTap={handleTap}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// Parallax scroll effect (mobile optimized)
export const ParallaxScroll = ({
  children,
  offset = 50,
  className,
}: {
  children: ReactNode;
  offset?: number;
  className?: string;
}) => {
  const isMobile = useIsMobile();
  const actualOffset = isMobile ? offset * 0.5 : offset; // Reduce parallax on mobile

  return (
    <motion.div
      initial={{ y: actualOffset }}
      whileInView={{ y: 0 }}
      viewport={{ once: true }}
      transition={getMobileOptimizedTransition(isMobile)}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Accordion with smooth animations
interface AnimatedAccordionProps {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export const AnimatedAccordion = ({
  title,
  children,
  isOpen,
  onToggle,
  className,
}: AnimatedAccordionProps) => {
  return (
    <motion.div className={className}>
      <motion.button
        onClick={onToggle}
        className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex justify-between items-center">
          <span className="font-medium">{title}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ↓
          </motion.div>
        </div>
      </motion.button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: "hidden" }}
      >
        <div className="p-4 bg-white">{children}</div>
      </motion.div>
    </motion.div>
  );
};

// Infinite scroll loading animation
export const InfiniteScrollLoader = ({
  isLoading,
  className,
}: {
  isLoading: boolean;
  className?: string;
}) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex justify-center p-4 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"
      />
    </motion.div>
  );
};

// Staggered list animation for mobile
export const MobileStaggerList = ({
  children,
  className,
  staggerDelay = 0.05, // Faster stagger for mobile
}: {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
}) => {
  const isMobile = useIsMobile();
  const actualStaggerDelay = isMobile ? staggerDelay : staggerDelay * 2;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: actualStaggerDelay,
          },
        },
      }}
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: isMobile ? 10 : 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={getMobileOptimizedTransition(isMobile)}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
