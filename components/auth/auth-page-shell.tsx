"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";

const TRUST_POINTS = [
  "Browse verified properties across Bengaluru",
  "Save favourites and get personalised alerts",
  "Book visits and connect with trusted agents",
];

interface AuthPageShellProps {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imageEyebrow: string;
  imageTagline: string;
  footer: React.ReactNode;
}

export function AuthPageShell({
  children,
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  imageEyebrow,
  imageTagline,
  footer,
}: AuthPageShellProps) {
  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      {/* Mobile image strip */}
      <div className="relative h-44 overflow-hidden lg:hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-manrope text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
            {imageEyebrow}
          </p>
          <p className="mt-1 font-playfair text-xl font-semibold leading-tight tracking-[-0.02em] text-white">
            {imageTagline}
          </p>
        </div>
      </div>

      <div className="grid lg:min-h-screen lg:grid-cols-2">
        {/* Form */}
        <div className="flex items-center justify-center px-4 py-8 sm:px-8 lg:px-12 lg:py-12 xl:px-16">
          <div className="w-full max-w-[420px]">
            <div className="mb-7">
              <Logo />
            </div>

            <div className="rounded-[24px] border border-[#EBEBEB] bg-white p-6 shadow-sm sm:p-8">
              <p className="mb-2 font-manrope text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5C5C5C]">
                {eyebrow}
              </p>
              <h1 className="home-section-headline !text-[1.65rem] sm:!text-[2rem]">
                {title}
              </h1>
              <p className="mt-2 font-manrope text-sm leading-relaxed text-[#717171]">
                {subtitle}
              </p>

              <div className="mt-7">{children}</div>

              <div className="mt-7 border-t border-[#F0F0F0] pt-5">{footer}</div>
            </div>

            <p className="mt-6 text-center">
              <Link
                href="/"
                className="font-manrope text-xs text-[#8A8A8A] transition-colors hover:text-[#303030]"
              >
                ← Back to home
              </Link>
            </p>
          </div>
        </div>

        {/* Desktop image panel */}
        <div className="relative hidden min-h-screen lg:block">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

          <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">
            <div>
              <p className="font-manrope text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
                {imageEyebrow}
              </p>
              <h2 className="mt-3 max-w-md font-playfair text-3xl font-semibold leading-[1.15] tracking-[-0.02em] text-white xl:text-4xl">
                {imageTagline}
              </h2>
            </div>

            <ul className="space-y-3">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 font-manrope text-sm text-white/90"
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-white/80"
                    strokeWidth={1.5}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

export const authInputClassName =
  "h-11 rounded-[12px] border-[#EBEBEB] bg-[#FAFAFA] font-manrope text-base text-[#1A1A1A] placeholder:text-[#A0A0A0] focus-visible:border-[#303030] focus-visible:ring-[#303030]/10 sm:text-sm";

export const authLabelClassName =
  "font-manrope text-sm font-medium text-[#3A3A3A]";

export const authSubmitClassName =
  "property-btn-pill h-11 w-full bg-[#303030] font-manrope text-sm font-semibold text-white hover:bg-[#1a1a1a]";
