"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  Compass,
  GitCompare,
  Home,
  Lock,
  MapPin,
  Scale,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContent } from "@/components/animations/layout-wrapper";
import { useAuthStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type ToolItem = {
  id: string;
  label: string;
  title: string;
  hook: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
  featured?: boolean;
};

const catchyLines = [
  "Know the price before you fall in love with the floor plan.",
  "RERA-checked. Vastu-scored. EMI-calculated.",
  "Your next home deserves more than a gut feeling.",
  "Compare three projects before you visit even one.",
  "Bengaluru market data, in your pocket.",
];

const freeTools: ToolItem[] = [
  {
    id: "price-trends",
    label: "Market",
    title: "Price Trends",
    hook: "See where prices are heading",
    description: "Historical charts and city-wise movement so you never overpay.",
    href: "/tools/price-trends",
    icon: TrendingUp,
    accent: "from-blue-50 to-sky-50 text-blue-600",
    featured: true,
  },
  {
    id: "property-value",
    label: "Valuation",
    title: "Property Value",
    hook: "What's it really worth?",
    description: "Instant estimates based on location, size, and live market data.",
    href: "/tools/property-value",
    icon: Calculator,
    accent: "from-emerald-50 to-green-50 text-emerald-600",
    featured: true,
  },
  {
    id: "rera-check",
    label: "Compliance",
    title: "RERA Check",
    hook: "Trust, but verify",
    description: "Registration, documents, reviews, and litigation — one report.",
    href: "/tools/rera-check",
    icon: Scale,
    accent: "from-violet-50 to-purple-50 text-violet-600",
    featured: true,
  },
  {
    id: "area-insights",
    label: "Areas",
    title: "Area Insights",
    hook: "Love the flat? Check the hood.",
    description: "Schools, commute, safety, and livability scores by neighbourhood.",
    href: "/tools/area-insights",
    icon: MapPin,
    accent: "from-amber-50 to-orange-50 text-amber-700",
  },
  {
    id: "mortgage-calculator",
    label: "Finance",
    title: "Mortgage Calculator",
    hook: "EMI you can actually afford",
    description: "Full breakdown of principal, interest, and tenure — no surprises.",
    href: "/tools/mortgage-calculator",
    icon: Calculator,
    accent: "from-slate-50 to-zinc-50 text-slate-600",
  },
  {
    id: "vastu-checker",
    label: "Vastu",
    title: "Vastu Checker",
    hook: "Good energy, good investment",
    description: "Score entry direction, room placement, and open spaces in minutes.",
    href: "/tools/vastu-checker",
    icon: Compass,
    accent: "from-orange-50 to-rose-50 text-orange-600",
  },
];

const memberTools: ToolItem[] = [
  {
    id: "property-comparison",
    label: "Compare",
    title: "Property Comparison",
    hook: "Side by side, no spreadsheet",
    description: "Stack up to three homes on price, amenities, and location.",
    href: "/tools/property-comparison",
    icon: GitCompare,
    accent: "from-rose-50 to-red-50 text-red-500",
    featured: true,
  },
  {
    id: "investment-guide",
    label: "Invest",
    title: "Investment Guide",
    hook: "Buy to live or buy to earn?",
    description: "ROI strategies, risk checks, and portfolio-friendly picks.",
    href: "/tools/investment-guide",
    icon: BookOpen,
    accent: "from-indigo-50 to-blue-50 text-indigo-600",
  },
  {
    id: "home-affordability",
    label: "Budget",
    title: "Home Affordability",
    hook: "Dream home, real budget",
    description: "Income, down payment, and monthly comfort — all in one view.",
    href: "/tools/home-affordability",
    icon: Home,
    accent: "from-teal-50 to-cyan-50 text-teal-700",
  },
  {
    id: "market-predictor",
    label: "Forecast",
    title: "Market Predictor",
    hook: "Buy now or wait it out?",
    description: "AI-backed signals on price movement in key micro-markets.",
    href: "/tools/market-predictor",
    icon: Target,
    accent: "from-fuchsia-50 to-pink-50 text-fuchsia-600",
  },
];

const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=600&fit=crop&crop=center&auto=format&q=85";

function ToolsMarquee() {
  const items = [...catchyLines, ...catchyLines];

  return (
    <div className="overflow-hidden border-y border-[#EBEBEB] bg-white py-3">
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap">
        {items.map((line, i) => (
          <span
            key={`${line}-${i}`}
            className="inline-flex items-center gap-2 font-manrope text-sm text-[#484848]"
          >
            <Sparkles className="size-3.5 shrink-0 text-red-400" strokeWidth={1.5} />
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeaturedToolCard({
  tool,
  locked = false,
  large = false,
}: {
  tool: ToolItem;
  locked?: boolean;
  large?: boolean;
}) {
  const Icon = tool.icon;
  const href = locked ? "/auth/login" : tool.href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[#EBEBEB] bg-white transition-all hover:-translate-y-1 hover:border-[#DDDDDD] hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]",
        large ? "p-6 sm:p-7" : "p-5"
      )}
    >
      <div
        className={cn(
          "absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br opacity-60 blur-2xl transition-opacity group-hover:opacity-90",
          tool.accent.split(" ").slice(0, 2).join(" ")
        )}
      />

      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div
            className={cn(
              "flex items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm",
              tool.accent,
              large ? "size-12" : "size-10"
            )}
          >
            <Icon className={large ? "size-5" : "size-4"} strokeWidth={1.5} />
          </div>
          {locked ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#EBEBEB] bg-[#FAFAFA] px-2.5 py-1 font-manrope text-[10px] font-medium text-[#717171]">
              <Lock className="size-2.5" strokeWidth={1.5} />
              Members
            </span>
          ) : (
            <span className="rounded-full border border-[#F0F0F0] bg-[#FAFAFA] px-2.5 py-1 font-manrope text-[10px] font-medium uppercase tracking-[0.1em] text-[#8A8A8A]">
              {tool.label}
            </span>
          )}
        </div>

        <p className="font-manrope text-xs font-medium text-red-500">{tool.hook}</p>
        <h3
          className={cn(
            "mt-1 font-manrope font-semibold text-[#1A1A1A]",
            large ? "text-lg tracking-[-0.02em]" : "text-[15px]"
          )}
        >
          {tool.title}
        </h3>
        <p
          className={cn(
            "mt-2 font-manrope leading-relaxed text-[#717171]",
            large ? "text-sm" : "text-xs"
          )}
        >
          {tool.description}
        </p>

        <span className="mt-5 inline-flex items-center gap-1.5 font-manrope text-[13px] font-semibold text-[#222222] transition-colors group-hover:text-red-500">
          {locked ? "Sign in to unlock" : "Try it free"}
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
}

function ToolCard({
  tool,
  locked = false,
}: {
  tool: ToolItem;
  locked?: boolean;
}) {
  return <FeaturedToolCard tool={tool} locked={locked} />;
}

export function RealEstateToolsHub() {
  const { user } = useAuthStore();
  const featuredFree = freeTools.filter((t) => t.featured);
  const featuredMember = memberTools.filter((t) => t.featured);
  const allFeatured = [...featuredFree, ...featuredMember];

  return (
    <PageContent>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 py-5 font-manrope text-sm text-[#717171] transition-colors hover:text-[#303030]"
        >
          <ArrowLeft className="size-4" strokeWidth={1.5} />
          Back to home
        </Link>

        {/* Hero banner */}
        <section className="relative mb-10 overflow-hidden rounded-[28px] border border-[#EBEBEB] bg-[#1A1A1A]">
          <div className="absolute inset-0">
            <Image
              src={BANNER_IMAGE}
              alt="Modern apartment skyline"
              fill
              className="object-cover opacity-40"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/85 to-[#1A1A1A]/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
          </div>

          <div className="relative grid gap-8 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-manrope text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm">
                <Sparkles className="size-3 text-red-400" strokeWidth={1.5} />
                10 tools · Bengaluru ready
              </p>

              <h1 className="font-playfair text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-[2.75rem] lg:text-[3.25rem]">
                buy smarter,
                <span className="block text-red-400">not harder.</span>
              </h1>

              <p className="mt-4 max-w-lg font-manrope text-sm leading-relaxed text-white/75 sm:text-base">
                From RERA checks to EMI math — every tool you need to research
                your next home without the guesswork. Most are free. No sales
                pitch attached.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="property-btn-pill h-11 rounded-full bg-red-500 px-6 text-white hover:bg-red-600"
                >
                  <a href="#featured-tools">
                    Explore tools
                    <ArrowRight className="ml-2 size-4" strokeWidth={1.5} />
                  </a>
                </Button>
                {!user ? (
                  <Button
                    asChild
                    variant="outline"
                    className="property-btn-pill h-11 rounded-full border-white/25 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/auth/signup">Create free account</Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    className="property-btn-pill h-11 rounded-full border-white/25 bg-white/10 px-6 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                  >
                    <Link href="/dashboard">My dashboard</Link>
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 backdrop-blur-md">
              {[
                { value: "6", label: "Free tools", sub: "No login needed" },
                { value: "4", label: "Pro tools", sub: "For members" },
                { value: "100%", label: "RERA focus", sub: "Compliance first" },
                { value: "0", label: "Hidden fees", sub: "Always free basics" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1A1A1A]/60 px-4 py-4 sm:px-5 sm:py-5"
                >
                  <p className="font-playfair text-2xl font-bold text-white sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 font-manrope text-xs font-semibold text-white">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 font-manrope text-[10px] text-white/55">
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <ToolsMarquee />

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 lg:space-y-16 lg:px-8 lg:py-12">
        {/* Featured showcase */}
        <section id="featured-tools" className="scroll-mt-24 space-y-6">
          <div className="max-w-2xl">
            <p className="property-section-eyebrow">Most popular</p>
            <h2 className="property-section-title">start with these</h2>
            <p className="mt-3 font-manrope text-sm leading-relaxed text-[#717171] sm:text-[15px]">
              The tools Bengaluru buyers open first — price clarity, project
              verification, and side-by-side comparison.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {allFeatured.map((tool) => {
              const isMember = memberTools.some((m) => m.id === tool.id);
              return (
                <FeaturedToolCard
                  key={tool.id}
                  tool={tool}
                  locked={isMember && !user}
                  large
                />
              );
            })}
          </div>
        </section>

        {/* Free tools */}
        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="property-section-eyebrow">Free forever</p>
              <h2 className="font-manrope text-lg font-semibold tracking-[-0.01em] text-[#1A1A1A] sm:text-xl">
                Open now — no account required
              </h2>
              <p className="mt-1 font-manrope text-sm text-[#717171]">
                Research like a pro. Pay nothing. Sign up only when you want to
                save your work.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {freeTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Member tools */}
        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="property-section-eyebrow">Go deeper</p>
              <h2 className="font-manrope text-lg font-semibold tracking-[-0.01em] text-[#1A1A1A] sm:text-xl">
                {user
                  ? "Your member toolkit is unlocked"
                  : "Unlock the full toolkit"}
              </h2>
              <p className="mt-1 font-manrope text-sm text-[#717171]">
                {user
                  ? "Compare, forecast, and plan affordability — all yours."
                  : "Sign in free to compare properties, forecast markets, and plan your budget."}
              </p>
            </div>
            {!user ? (
              <Button
                asChild
                className="property-btn-pill h-10 shrink-0 rounded-full bg-[#303030] px-5 text-white hover:bg-[#1a1a1a]"
              >
                <Link href="/auth/login">Sign in free</Link>
              </Button>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {memberTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} locked={!user} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="compare-surface overflow-hidden">
          <div className="grid gap-0 md:grid-cols-[1fr_auto] md:items-center">
            <div className="border-b border-[#F0F0F0] p-6 sm:p-8 md:border-b-0 md:border-r">
              <p className="font-manrope text-xs font-medium text-red-500">
                {user ? "You're all set" : "One last thing"}
              </p>
              <h2 className="mt-1 font-manrope text-lg font-semibold tracking-[-0.02em] text-[#222222] sm:text-xl">
                {user
                  ? "Your research lives on your dashboard"
                  : "Don't lose your research halfway"}
              </h2>
              <p className="mt-2 max-w-md font-manrope text-sm leading-relaxed text-[#717171]">
                {user
                  ? "Saved comparisons, site visits, and shortlists — pick up exactly where you left off."
                  : "Save comparisons, book site visits, and track favourites. Free account, two minutes."}
              </p>
            </div>
            <div className="flex flex-col gap-2 p-6 sm:flex-row sm:p-8 md:flex-col">
              {user ? (
                <Button
                  asChild
                  className="property-btn-pill h-11 rounded-full bg-[#303030] px-6 text-white hover:bg-[#1a1a1a]"
                >
                  <Link href="/dashboard">
                    Go to dashboard
                    <ArrowRight className="ml-2 size-4" strokeWidth={1.5} />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button
                    asChild
                    className="property-btn-pill h-11 rounded-full bg-red-500 px-6 text-white hover:bg-red-600"
                  >
                    <Link href="/auth/signup">Create free account</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="property-btn-pill h-11 rounded-full border-[#DDDDDD] bg-white px-6 text-[#222222] hover:bg-[#F7F7F7]"
                  >
                    <Link href="/auth/login">Sign in</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  );
}
