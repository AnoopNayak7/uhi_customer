"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { MobileSearchTrigger } from "@/components/home/mobile-search-trigger";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { ProminentProjects } from "@/components/home/prominent-projects";
import { RealEstateTools } from "@/components/home/real-estate-tools";
import { TrendingProperties } from "@/components/home/trending-properties";
import { PropertyListings } from "@/components/home/property-listings";
import { CTASection } from "@/components/home/cta-section";
import { PageContent } from "@/components/animations/layout-wrapper";
import { SectionReveal } from "@/components/animations/page-transitions";
import { HomePageSEO } from "@/components/seo/HomePageSEO";
import { HomepageSEOContent } from "@/components/home/homepage-seo-content";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <HomePageSEO />
      <HomepageSEOContent />
      <Header />

      <main className="flex-1">
        {/* Mobile Search Interface */}
        <MobileSearchTrigger />
        
        <PageContent>
          {/* Desktop Hero Section - Hidden on mobile */}
          <div className="hidden sm:block">
            <HeroSection />
          </div>
          
          <SectionReveal>
            <FeaturedProperties />
          </SectionReveal>
          <SectionReveal>
            <ProminentProjects />
          </SectionReveal>
          <SectionReveal>
            <RealEstateTools />
          </SectionReveal>
          <SectionReveal>
            <TrendingProperties />
          </SectionReveal>
          <SectionReveal>
            <PropertyListings />
          </SectionReveal>
          {/* <SectionReveal>
            <CTASection />
          </SectionReveal> */}
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
