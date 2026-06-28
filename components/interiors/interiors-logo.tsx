"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type InteriorsLogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  link?: boolean;
};

const sizeStyles = {
  sm: {
    brand: "text-base",
    tag: "text-[10px] tracking-[0.2em]",
  },
  md: {
    brand: "text-xl sm:text-[1.35rem]",
    tag: "text-[11px] tracking-[0.22em]",
  },
  lg: {
    brand: "text-2xl sm:text-3xl",
    tag: "text-xs sm:text-[13px] tracking-[0.24em]",
  },
};

export function InteriorsLogo({
  className,
  size = "md",
  href = "/interiors",
  link = true,
}: InteriorsLogoProps) {
  const styles = sizeStyles[size];

  const content = (
    <span
      className={cn(
        "inline-flex flex-col items-start leading-none",
        className
      )}
    >
      <span
        className={cn(
          "font-montserrat font-semibold tracking-[-0.03em] text-[#222222]",
          styles.brand
        )}
      >
        Urbanhousein
      </span>
      <span
        className={cn(
          "mt-1.5 font-montserrat font-medium uppercase text-[#8A8A8A]",
          styles.tag
        )}
      >
        Interiors
      </span>
    </span>
  );

  if (!link) {
    return content;
  }

  return (
    <Link href={href} className="inline-block transition-opacity hover:opacity-80">
      {content}
    </Link>
  );
}
