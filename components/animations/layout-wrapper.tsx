"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LayoutWrapperProps {
  children: ReactNode;
  className?: string;
}

export const LayoutWrapper = ({ children, className }: LayoutWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Simple fade in animation for page content
export const PageContent = ({ children, className }: LayoutWrapperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
