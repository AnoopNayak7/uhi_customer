import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HomeSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-white py-12 sm:py-16", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function HomeSectionHeader({
  title,
  subtitle,
  action,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-3xl">
        {eyebrow ? <p className="home-section-eyebrow">{eyebrow}</p> : null}

        <h2 className="home-section-headline">{title}</h2>

        {subtitle ? (
          <p className="mt-4 max-w-xl font-manrope text-sm leading-relaxed text-[#717171] sm:text-[15px]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0 self-start sm:self-end">{action}</div> : null}
    </div>
  );
}

export function HomeCarouselControls({
  onPrev,
  onNext,
  disabled,
}: {
  onPrev: () => void;
  onNext: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="liquid-glass-cluster hidden md:flex">
      <button
        type="button"
        onClick={onPrev}
        disabled={disabled}
        aria-label="Previous properties"
        className="liquid-glass-action disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="liquid-glass-divider" />
      <button
        type="button"
        onClick={onNext}
        disabled={disabled}
        aria-label="Next properties"
        className="liquid-glass-action disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export function HomeViewAllButton({ href = "/properties" }: { href?: string }) {
  return (
    <div className="mt-8 text-center">
      <Button
        asChild
        variant="outline"
        className="property-btn-pill border-[#DDDDDD] bg-white px-6 text-[#222222] hover:bg-[#F7F7F7]"
      >
        <Link href={href}>View all properties</Link>
      </Button>
    </div>
  );
}
