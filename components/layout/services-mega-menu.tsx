"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  ChevronDown,
  MapPin,
  Palette,
  Scale,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const INTERIOR_THUMB =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=280&fit=crop&crop=center&auto=format&q=80";

const serviceItems = [
  {
    title: "Interiors",
    description: "End-to-end interior design for apartments and homes in Bengaluru.",
    href: "/interiors",
    icon: Palette,
    badge: "Popular",
    image: INTERIOR_THUMB,
  },
  {
    title: "RERA Check",
    description: "Verify project registration and compliance details instantly.",
    href: "/tools/rera-check",
    icon: Scale,
  },
  {
    title: "Property consultation",
    description: "Get expert guidance on buying, selling, or investing.",
    href: "/tools/real-estate",
    icon: Sparkles,
  },
];

const toolHighlights = [
  {
    title: "Price Trends",
    description: "Track property prices across cities and areas.",
    href: "/tools/price-trends",
    icon: TrendingUp,
  },
  {
    title: "Property Value",
    description: "Estimate what a property is worth today.",
    href: "/tools/property-value",
    icon: Calculator,
  },
  {
    title: "Area Insights",
    description: "Explore neighbourhood stats and livability.",
    href: "/tools/area-insights",
    icon: MapPin,
  },
];

export function ServicesMegaMenu({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleOpen = () => {
    clearCloseTimer();
    setOpen(true);
  };

  const handleClose = () => {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 font-manrope text-sm font-medium text-[#484848] transition-colors hover:text-[#222222]",
          open && "text-[#222222]"
        )}
        aria-expanded={open}
        aria-haspopup="true"
      >
        Services
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={1.5}
        />
      </button>

      {open ? (
        <div className="absolute left-1/2 top-full z-[70] w-[min(920px,calc(100vw-2rem))] -translate-x-1/2 pt-4">
          <div className="nav-glass-panel overflow-hidden rounded-[24px] p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-4 font-manrope text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B0B0B0]">
                  Services
                </p>
                <div className="space-y-2">
                  {serviceItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onNavigate}
                        className="group flex gap-4 rounded-2xl border border-transparent p-3 transition-all hover:border-[#EBEBEB] hover:bg-[#FAFAFA]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E8E8E8] bg-[#FAFAFA]">
                          <Icon className="size-3.5 text-[#484848]" strokeWidth={1.25} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-manrope text-sm font-semibold text-[#222222]">
                              {item.title}
                            </p>
                            {item.badge ? (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 font-manrope text-[10px] font-medium text-amber-700">
                                {item.badge}
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-1 font-manrope text-xs leading-relaxed text-[#717171]">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-4 font-manrope text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B0B0B0]">
                  Tools & guides
                </p>

                <Link
                  href="/interiors"
                  onClick={onNavigate}
                  className="group mb-4 flex gap-4 overflow-hidden rounded-2xl border border-[#EBEBEB] bg-white p-3 transition-all hover:border-[#DDDDDD] hover:shadow-[0_8px_24px_rgba(0,0,0,0.05)]"
                >
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-[#F5F5F5]">
                    <Image
                      src={INTERIOR_THUMB}
                      alt="Interior design"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <p className="font-manrope text-sm font-semibold text-[#222222]">
                      Crafting dream spaces
                    </p>
                    <p className="mt-1 font-manrope text-xs text-[#717171]">
                      Explore Urbanhousein Interiors
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 font-manrope text-xs font-medium text-red-500">
                      Learn more
                      <ArrowRight className="size-3" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>

                <div className="space-y-1">
                  {toolHighlights.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={onNavigate}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#FAFAFA]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E8E8E8] bg-[#FAFAFA]">
                          <Icon className="size-3.5 text-[#484848]" strokeWidth={1.25} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-manrope text-sm font-medium text-[#222222]">
                            {tool.title}
                          </p>
                          <p className="truncate font-manrope text-xs text-[#717171]">
                            {tool.description}
                          </p>
                        </div>
                        <ArrowRight
                          className="size-3.5 shrink-0 text-[#B0B0B0] transition-transform group-hover:translate-x-0.5 group-hover:text-[#222222]"
                          strokeWidth={1.5}
                        />
                      </Link>
                    );
                  })}
                </div>

                <Link
                  href="/tools/real-estate"
                  onClick={onNavigate}
                  className="mt-4 inline-flex items-center gap-1.5 font-manrope text-sm font-medium text-[#222222] transition-colors hover:text-red-500"
                >
                  View all tools
                  <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export const mobileServiceLinks = [
  { label: "Interiors", href: "/interiors" },
  { label: "RERA Check", href: "/tools/rera-check" },
  { label: "Price Trends", href: "/tools/price-trends" },
  { label: "Property Value", href: "/tools/property-value" },
  { label: "Area Insights", href: "/tools/area-insights" },
  { label: "All tools", href: "/tools/real-estate" },
];
