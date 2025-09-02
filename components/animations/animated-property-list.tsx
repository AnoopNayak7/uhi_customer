"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { MobileStaggerList } from "./mobile-animations";
import { useIsMobile } from "./mobile-animations";

interface AnimatedPropertyListProps {
  children: ReactNode[];
  loading?: boolean;
  className?: string;
}

export const AnimatedPropertyList = ({
  children,
  loading = false,
  className,
}: AnimatedPropertyListProps) => {
  const isMobile = useIsMobile();
  const skeletonCount = isMobile ? 4 : 6; // Show fewer skeletons on mobile
  const animationDelay = isMobile ? 0.05 : 0.1; // Faster animations on mobile

  if (loading) {
    return (
      <div className={`${className} overflow-x-hidden`}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * animationDelay,
              duration: isMobile ? 0.3 : 0.5,
            }}
            className="mb-4 sm:mb-6"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="animate-pulse">
                <div className="h-48 sm:h-52 bg-gray-200"></div>
                <div className="p-4 sm:p-5">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <MobileStaggerList className={className}>{children}</MobileStaggerList>
    </AnimatePresence>
  );
};

// Grid layout with stagger animation
export const AnimatedPropertyGrid = ({
  children,
  loading = false,
  className,
}: AnimatedPropertyListProps) => {
  // Use the provided className or fallback to default grid layout
  const gridClassName =
    className || "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  if (loading) {
    return (
      <div className={`grid ${gridClassName} gap-6 overflow-x-hidden`}>
        {Array.from({ length: 9 }).map((_, index) => (
          <motion.div
            key={`skeleton-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className={`grid ${gridClassName} gap-6 overflow-x-hidden`}
      >
        {children.map((child, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {child}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

// Filter animation
export const FilterAnimation = ({
  children,
  isVisible,
}: {
  children: ReactNode;
  isVisible: boolean;
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Search results animation
export const SearchResultsAnimation = ({
  children,
  count,
  loading,
}: {
  children: ReactNode;
  count: number;
  loading: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4 text-gray-600"
      >
        {loading ? (
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full mr-2"
            />
            Searching properties...
          </div>
        ) : (
          `Found ${count} properties`
        )}
      </motion.div>
      {children}
    </motion.div>
  );
};
