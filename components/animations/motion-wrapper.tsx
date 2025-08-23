"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// Common animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

export const slideInUp = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 50 },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Transition presets
export const transitions = {
  smooth: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any },
  spring: { type: "spring" as const, stiffness: 100, damping: 15 },
  bounce: { type: "spring" as const, stiffness: 400, damping: 10 },
  fast: { duration: 0.3, ease: "easeOut" },
  slow: { duration: 1, ease: "easeInOut" },
};

// Motion wrapper components
interface MotionWrapperProps {
  children: ReactNode;
  variant?:
    | "fadeInUp"
    | "fadeInDown"
    | "fadeInLeft"
    | "fadeInRight"
    | "scaleIn"
    | "slideInUp";
  transition?: keyof typeof transitions;
  delay?: number;
  className?: string;
}

export const MotionWrapper = ({
  children,
  variant = "fadeInUp",
  transition = "smooth",
  delay = 0,
  className,
}: MotionWrapperProps) => {
  const variants = {
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    slideInUp,
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
      transition={{ ...transitions[transition], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger container for animating lists
interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  childDelay?: number;
}

export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.1,
  childDelay = 0.1,
}: StaggerContainerProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: childDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Individual stagger item
export const StaggerItem = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      variants={staggerItem}
      transition={transitions.smooth}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hover animations
export const HoverScale = ({
  children,
  scale = 1.05,
  className,
}: {
  children: ReactNode;
  scale?: number;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={transitions.spring}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Animated counter
interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  className?: string;
}

export const AnimatedCounter = ({
  from,
  to,
  duration = 2,
  className,
}: AnimatedCounterProps) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration, ease: "easeOut" }}
      >
        {to}
      </motion.span>
    </motion.span>
  );
};
