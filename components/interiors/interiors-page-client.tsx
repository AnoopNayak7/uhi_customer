"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Award,
  CheckCircle2,
  Clock,
  Eye,
  Hammer,
  Heart,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HomeSection,
  HomeSectionHeader,
} from "@/components/home/home-section";
import { InteriorsInquiryDialog } from "@/components/interiors/interiors-inquiry-dialog";
import { InteriorsBrandBar } from "@/components/interiors/interiors-brand-bar";
import { InteriorsLogo } from "@/components/interiors/interiors-logo";
import { PROPERTY_IMAGES } from "@/lib/images";

const INTERIORS_PHONE = "8217452498";
const INTERIORS_PHONE_DISPLAY = "+91 82174 52498";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&h=900&fit=crop&crop=center&auto=format&q=85";

const GALLERY_IMAGES = [
  {
    src: PROPERTY_IMAGES.commercial_1,
    alt: "Modern living room interior",
    label: "Living room",
  },
  {
    src: PROPERTY_IMAGES.modern_apartment_2,
    alt: "Elegant bedroom design",
    label: "Bedroom",
  },
  {
    src: PROPERTY_IMAGES.villa_1,
    alt: "Contemporary kitchen",
    label: "Kitchen",
  },
  {
    src: PROPERTY_IMAGES.penthouse_1,
    alt: "Luxury dining space",
    label: "Dining",
  },
  {
    src: PROPERTY_IMAGES.villa_2,
    alt: "Minimal home office",
    label: "Study",
  },
  {
    src: PROPERTY_IMAGES.modern_apartment_1,
    alt: "Open plan apartment",
    label: "Open plan",
  },
];

const features = [
  {
    icon: Palette,
    title: "Customized designs",
    description: "Tailored layouts that match your lifestyle and taste.",
  },
  {
    icon: Award,
    title: "Up to 5 year warranty",
    description: "Quality materials with long-term peace of mind.",
  },
  {
    icon: Sparkles,
    title: "End-to-end service",
    description: "From concept and 3D visuals to final installation.",
  },
  {
    icon: CheckCircle2,
    title: "Assured quality",
    description: "Premium finishes and skilled craftsmanship.",
  },
  {
    icon: Clock,
    title: "45–60 day delivery",
    description: "Structured timelines with clear milestones.",
  },
  {
    icon: Hammer,
    title: "Modern production",
    description: "Precision manufacturing and clean handover.",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Brainstorm",
    description:
      "We understand your needs, explore ideas, and shape a design direction together.",
    icon: Lightbulb,
  },
  {
    step: "02",
    title: "Visualize",
    description:
      "See your space in 3D before work begins — layouts, materials, and mood.",
    icon: Eye,
  },
  {
    step: "03",
    title: "Craft it",
    description:
      "Our team builds your home with care, quality checks at every stage.",
    icon: Hammer,
  },
  {
    step: "04",
    title: "Celebrate",
    description:
      "Move into a finished space that feels personal, warm, and truly yours.",
    icon: Heart,
  },
];

export function InteriorsPageClient() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <main className="flex-1 bg-white">
        <InteriorsBrandBar />
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-[#EBEBEB] bg-white">
          <div
            aria-hidden
            className="hero-cred-background pointer-events-none absolute inset-0 z-[1]"
          />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-16 lg:py-20">
              <div>
                <InteriorsLogo size="lg" link={false} className="mb-6" />
                <h1 className="home-section-headline !text-[1.75rem] sm:!text-[2.25rem] md:!text-[2.75rem]">
                  crafting dream spaces
                </h1>
                <p className="mt-5 max-w-lg font-manrope text-sm leading-relaxed text-[#717171] sm:text-[15px]">
                  End-to-end interior solutions for apartments and homes in
                  Bengaluru — designed around how you live, built with precision.
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="property-btn-pill mt-7 rounded-full bg-[#303030] px-6 text-white hover:bg-[#1a1a1a]"
                >
                  Book free consultation
                </Button>
              </div>

              <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-[#EBEBEB]">
                <Image
                  src={HERO_IMAGE}
                  alt="Beautiful modern interior living room"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <HomeSection className="bg-[#FAFAFA]">
          <HomeSectionHeader
            eyebrow="Portfolio"
            title="Spaces we've styled"
            subtitle="Living rooms, bedrooms, kitchens and more — clean, functional, and personal."
          />

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {GALLERY_IMAGES.map((image) => (
              <div
                key={image.label}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-[16px] border border-[#EBEBEB] bg-[#F5F5F5]"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <span className="font-manrope text-xs font-medium text-white">
                    {image.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </HomeSection>

        {/* Features */}
        <HomeSection>
          <HomeSectionHeader
            eyebrow="What we offer"
            title="complete interior solutions"
            subtitle="Everything you need to turn a blank apartment into a home you'll love."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-[20px] border border-[#EBEBEB] bg-white p-5 transition-all hover:border-[#DDDDDD] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                >
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-[#F0F0F0] bg-[#FAFAFA] px-2.5 py-1">
                    <Icon className="size-2.5 text-[#484848]" strokeWidth={1} />
                  </div>
                  <h3 className="font-manrope text-[15px] font-semibold text-[#222222]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 font-manrope text-xs leading-relaxed text-[#717171]">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </HomeSection>

        {/* Process */}
        <HomeSection className="bg-[#FAFAFA]">
          <HomeSectionHeader
            eyebrow="How it works"
            title="four simple steps"
            subtitle="A clear, collaborative process from first call to final handover."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="rounded-[20px] border border-[#EBEBEB] bg-white p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-manrope text-[11px] font-semibold tracking-[0.12em] text-[#B0B0B0]">
                      {step.step}
                    </span>
                    <Icon className="size-3.5 text-[#B0B0B0]" strokeWidth={1.25} />
                  </div>
                  <h3 className="font-manrope text-[15px] font-semibold text-[#222222]">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-manrope text-xs leading-relaxed text-[#717171]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </HomeSection>

        {/* CTA + Contact */}
        <HomeSection>
          <div className="overflow-hidden rounded-[20px] border border-[#EBEBEB] bg-white">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-10 lg:p-12">
                <p className="home-section-eyebrow mb-0">Get started</p>
                <h2 className="home-section-headline mt-3 !text-[1.75rem] sm:!text-[2.25rem]">
                  ready to design your home?
                </h2>
                <p className="mt-4 font-manrope text-sm leading-relaxed text-[#717171] sm:text-[15px]">
                  Tell us about your space and we&apos;ll schedule a free
                  consultation — no obligation, just honest guidance.
                </p>
                <Button
                  onClick={() => setDialogOpen(true)}
                  className="property-btn-pill mt-6 rounded-full bg-red-500 text-white hover:bg-red-600"
                >
                  <MessageCircle className="mr-2 size-4" strokeWidth={1.5} />
                  Request a callback
                </Button>
              </div>

              <div className="border-t border-[#EBEBEB] bg-[#FAFAFA] p-8 md:border-l md:border-t-0 md:p-10">
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#B0B0B0]" strokeWidth={1.25} />
                    <div>
                      <p className="home-card-label">Studio</p>
                      <p className="mt-1 font-manrope text-sm leading-relaxed text-[#484848]">
                        #85/A, 11th Main, 14th Cross
                        <br />
                        Sector 6, HSR Layout
                        <br />
                        Bengaluru 560102
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 size-3.5 shrink-0 text-[#B0B0B0]" strokeWidth={1.25} />
                    <div>
                      <p className="home-card-label">Phone</p>
                      <a
                        href={`tel:+91${INTERIORS_PHONE}`}
                        className="mt-1 block font-manrope text-sm text-[#222222] hover:text-red-500"
                      >
                        {INTERIORS_PHONE_DISPLAY}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 size-3.5 shrink-0 text-[#B0B0B0]" strokeWidth={1.25} />
                    <div>
                      <p className="home-card-label">Email</p>
                      <a
                        href="mailto:hello@urbanhousein.com"
                        className="mt-1 block font-manrope text-sm text-[#222222] hover:text-red-500"
                      >
                        hello@urbanhousein.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HomeSection>
      </main>

      <div className="fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8">
        <Button
          onClick={() => setDialogOpen(true)}
          className="property-btn-pill h-12 rounded-full bg-[#303030] px-5 text-white shadow-lg hover:bg-[#1a1a1a]"
        >
          <MessageCircle className="mr-2 size-4" strokeWidth={1.5} />
          Enquire now
        </Button>
      </div>

      <InteriorsInquiryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
