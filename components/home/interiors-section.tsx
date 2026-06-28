"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeSection } from "@/components/home/home-section";
import { InteriorsLogo } from "@/components/interiors/interiors-logo";

const INTERIOR_IMAGE =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=900&fit=crop&crop=center&auto=format&q=85";

export function InteriorsSection() {
  return (
    <HomeSection className="bg-white">
      <div className="overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-white">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col justify-center p-8 md:p-10 lg:p-12">
            <InteriorsLogo size="md" className="mb-5" />
            <h2 className="home-section-headline !text-[1.75rem] sm:!text-[2.25rem]">
              looking for interiors?
            </h2>
            <p className="mt-4 max-w-md font-manrope text-sm leading-relaxed text-[#717171] md:text-[15px]">
              Transform your home with expert interior design — end-to-end
              solutions crafted with passion and precision.
            </p>
            <Link
              href="/interiors"
              className="property-btn-pill mt-6 inline-flex w-fit items-center rounded-full bg-[#303030] px-6 text-white hover:bg-[#1a1a1a]"
            >
              Explore interior services
              <ArrowRight className="ml-2 size-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="relative min-h-[280px] md:min-h-[360px]">
            <Image
              src={INTERIOR_IMAGE}
              alt="Modern interior living space"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-black/5" />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
              <p className="font-playfair text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-3xl">
                Crafting dream spaces
              </p>
            </div>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
