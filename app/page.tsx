"use client";

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HeroSection } from '@/components/home/hero-section';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { RealEstateTools } from '@/components/home/real-estate-tools';
import { TrendingProperties } from '@/components/home/trending-properties';
import { PropertyListings } from '@/components/home/property-listings';
import { CTASection } from '@/components/home/cta-section';

export default function HomePage() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        <FeaturedProperties />
        <RealEstateTools />
        <TrendingProperties />
        <PropertyListings />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}