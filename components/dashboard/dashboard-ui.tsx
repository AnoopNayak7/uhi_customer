import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="compare-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="property-stat-label mb-1.5">{label}</p>
          <p className="font-manrope text-2xl font-bold tracking-[-0.02em] text-[#1A1A1A]">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className="property-icon-pill !size-10 shrink-0">
          <Icon className="size-4" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

export function DashboardSection({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="compare-surface overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-[#D8D8D8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-manrope text-base font-semibold text-[#1A1A1A]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-0.5 font-manrope text-sm text-[#717171]">
              {subtitle}
            </p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function DashboardQuickAction({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-[16px] border border-[#D0D0D0] bg-[#FAFAFA] p-4 transition-colors hover:border-[#B8B8B8] hover:bg-white"
    >
      <div className="property-icon-pill shrink-0">
        <Icon className="size-4" strokeWidth={1.5} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-manrope text-sm font-semibold text-[#1A1A1A] group-hover:text-[#303030]">
          {label}
        </p>
        <p className="mt-0.5 font-manrope text-xs text-[#717171]">
          {description}
        </p>
      </div>
      <ArrowRight className="mt-0.5 size-4 shrink-0 text-[#B0B0B0] transition-transform group-hover:translate-x-0.5 group-hover:text-[#484848]" />
    </Link>
  );
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-10 text-center">
      <div className="property-icon-pill mx-auto mb-4 !size-14">
        <Icon className="size-6 text-[#8A8A8A]" strokeWidth={1.5} />
      </div>
      <h3 className="font-manrope text-base font-semibold text-[#1A1A1A]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-sm font-manrope text-sm text-[#717171]">
        {description}
      </p>
      {actionLabel && onAction ? (
        <Button
          className="property-btn-pill mt-5 h-10 bg-[#303030] px-5 font-manrope text-sm text-white hover:bg-[#1a1a1a]"
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      ) : actionHref && actionLabel ? (
        <Button
          className="property-btn-pill mt-5 h-10 bg-[#303030] px-5 font-manrope text-sm text-white hover:bg-[#1a1a1a]"
          asChild
        >
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}

export function DashboardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="compare-surface h-24 animate-pulse bg-[#FAFAFA]"
        />
      ))}
    </div>
  );
}
