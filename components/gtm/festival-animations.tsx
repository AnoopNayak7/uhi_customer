"use client";

import { useEffect, useState } from "react";
import { useGTMTheme, useFestivalStatus } from "@/hooks/use-gtm";
import { usePathname } from "next/navigation";

/**
 * Festival Animations Component
 *
 * Displays festival-specific animations based on active theme
 * Currently supports:
 * - Christmas: Snowflakes animation
 */
export function FestivalAnimations() {
  const { theme } = useGTMTheme();
  const isChristmas = useFestivalStatus("christmas");
  const pathname = usePathname();
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    // Check if we're on the landing page (homepage)
    setIsHomePage(pathname === "/");
  }, [pathname]);

  // Only show animations on the landing page
  if (!isHomePage) {
    return null;
  }

  // Show Christmas snowflakes if Christmas theme is active
  if ((theme === "christmas" || isChristmas) && isHomePage) {
    return (
      <>
        <SnowflakesAnimation />
        {/* <ChristmasDecorations /> */}
      </>
    );
  }

  return null;
}

/**
 * Snowflakes Animation Component
 * Creates a beautiful falling snowflakes effect for Christmas theme
 */
function SnowflakesAnimation() {
  const [snowflakes, setSnowflakes] = useState<
    Array<{
      id: number;
      left: number;
      animationDuration: number;
      animationDelay: number;
      size: number;
      opacity: number;
    }>
  >([]);

  useEffect(() => {
    // Generate snowflakes - adjust count based on screen size for performance
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const count = isMobile ? 30 : 50; // Fewer snowflakes on mobile

    const newSnowflakes = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      animationDuration: 3 + Math.random() * 4, // 3-7 seconds
      animationDelay: Math.random() * 2, // 0-2 seconds delay
      size: 6 + Math.random() * 8, // 6-14px (larger for better visibility)
      opacity: 0.6 + Math.random() * 0.4, // 0.6-1.0 for better visibility
    }));

    setSnowflakes(newSnowflakes);
  }, []);

  return (
    <>
      <div
        className="festival-snowflakes fixed inset-0 pointer-events-none z-40 overflow-hidden"
        aria-hidden="true"
      >
        {snowflakes.map((snowflake) => (
          <div
            key={snowflake.id}
            className="festival-snowflake absolute select-none"
            style={{
              left: `${snowflake.left}%`,
              fontSize: `${snowflake.size}px`,
              opacity: snowflake.opacity,
              animation: `snowfall ${snowflake.animationDuration}s linear infinite`,
              animationDelay: `${snowflake.animationDelay}s`,
              color: "#ffffff", // Pure white for snowflakes
              filter:
                "drop-shadow(0 0 2px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 4px rgba(255, 255, 255, 0.6)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))",
            }}
          >
            ❅
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
            opacity: 0;
          }
        }

        .festival-snowflakes {
          will-change: transform;
        }

        .festival-snowflake {
          will-change: transform, opacity;
          user-select: none;
          -webkit-user-select: none;
          font-weight: 300;
          line-height: 1;
          text-rendering: optimizeLegibility;
        }

        /* Enhanced visibility for snowflakes on white background */
        html[data-theme="christmas"] .festival-snowflake,
        html[data-festival="christmas"] .festival-snowflake {
          color: #ffffff !important; /* Pure white snowflakes */
          text-shadow: 0 0 4px rgba(255, 255, 255, 0.9),
            0 0 8px rgba(255, 255, 255, 0.7), 0 0 12px rgba(255, 255, 255, 0.5),
            0 1px 2px rgba(0, 0, 0, 0.15) !important;
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.9))
            drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))
            drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))
            drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2)) !important;
        }
      `}</style>
    </>
  );
}

/**
 * Christmas Decorations Component
 * Adds festive Christmas trees and candies to the landing page
 */
function ChristmasDecorations() {
  const [decorations, setDecorations] = useState<
    Array<{
      id: number;
      type: "tree" | "candy";
      left: number;
      bottom: number;
      size: number;
      animationDelay: number;
    }>
  >([]);

  useEffect(() => {
    // Generate decorations - trees on sides, candies scattered
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    const newDecorations: Array<{
      id: number;
      type: "tree" | "candy";
      left: number;
      bottom: number;
      size: number;
      animationDelay: number;
    }> = [];

    // Add Christmas trees (2-3 trees on each side)
    const treeCount = isMobile ? 2 : 3;
    for (let i = 0; i < treeCount; i++) {
      // Left side trees
      newDecorations.push({
        id: i,
        type: "tree",
        left: 2 + Math.random() * 8, // 2-10% from left
        bottom: 5 + Math.random() * 15, // 5-20% from bottom
        size: 40 + Math.random() * 30, // 40-70px
        animationDelay: Math.random() * 2,
      });

      // Right side trees
      newDecorations.push({
        id: i + treeCount,
        type: "tree",
        left: 90 + Math.random() * 8, // 90-98% from left (right side)
        bottom: 5 + Math.random() * 15, // 5-20% from bottom
        size: 40 + Math.random() * 30, // 40-70px
        animationDelay: Math.random() * 2,
      });
    }

    // Add candies scattered around (more on desktop)
    const candyCount = isMobile ? 8 : 15;
    for (let i = 0; i < candyCount; i++) {
      newDecorations.push({
        id: i + treeCount * 2,
        type: "candy",
        left: 10 + Math.random() * 80, // 10-90% from left
        bottom: 10 + Math.random() * 80, // 10-90% from bottom
        size: 20 + Math.random() * 15, // 20-35px
        animationDelay: Math.random() * 3,
      });
    }

    setDecorations(newDecorations);
  }, []);

  return (
    <>
      <div
        className="festival-christmas-decorations fixed inset-0 pointer-events-none z-30 overflow-hidden"
        aria-hidden="true"
      >
        {decorations.map((decoration) => (
          <div
            key={decoration.id}
            className={`festival-decoration festival-${decoration.type} absolute`}
            style={{
              left: `${decoration.left}%`,
              bottom: `${decoration.bottom}%`,
              width: `${decoration.size}px`,
              height: `${decoration.size}px`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${decoration.animationDelay}s`,
            }}
          >
            {decoration.type === "tree" ? (
              <div className="christmas-tree">
                <div className="tree-top">🎄</div>
              </div>
            ) : (
              <div className="christmas-candy">
                {["🍬", "🍭", "🍫"][Math.floor(Math.random() * 3)]}
              </div>
            )}
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        .festival-christmas-decorations {
          will-change: transform;
        }

        .festival-decoration {
          will-change: transform;
          user-select: none;
          -webkit-user-select: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .christmas-tree {
          font-size: 100%;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .christmas-candy {
          font-size: 100%;
          filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.15));
        }

        /* Enhanced visibility for Christmas decorations */
        html[data-theme="christmas"] .festival-decoration,
        html[data-festival="christmas"] .festival-decoration {
          opacity: 0.9;
        }

        html[data-theme="christmas"] .christmas-tree,
        html[data-festival="christmas"] .christmas-tree {
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))
            drop-shadow(0 0 8px rgba(34, 197, 94, 0.2));
        }

        html[data-theme="christmas"] .christmas-candy,
        html[data-festival="christmas"] .christmas-candy {
          filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2))
            drop-shadow(0 0 6px rgba(239, 68, 68, 0.15));
        }

        /* Responsive sizing */
        @media (max-width: 768px) {
          .festival-decoration {
            opacity: 0.8;
          }
        }
      `}</style>
    </>
  );
}
