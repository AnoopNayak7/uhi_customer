import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Single source of truth for Indian-format property prices.
 * Null-safe: returns "" for undefined/null so callers don't need their own guards.
 */
export const formatPrice = (price?: number | null) => {
  if (price == null || isNaN(price)) return "";
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  }
  return `₹${Math.round(price).toLocaleString()}`;
};
