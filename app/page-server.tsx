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

// Server-side data fetching
async function getHomePageData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://g82q9hlk9h.execute-api.ap-south-1.amazonaws.com/prod/api';
    
    // Fetch data in parallel for better performance
    const [featuredResponse, trendingResponse, topResponse] = await Promise.allSettled([
      fetch(`${baseUrl}/properties?isFeatured=true&status=approved&limit=8`, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      fetch(`${baseUrl}/properties?isHotSelling=true&status=approved&limit=8`, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      }),
      fetch(`${baseUrl}/properties?isFastSelling=true&status=approved&limit=8`, { 
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        }
      })
    ]);

    // Process responses
    const featuredProperties = featuredResponse.status === 'fulfilled' 
      ? await featuredResponse.value.json().catch(() => ({ success: false, data: [] }))
      : { success: false, data: [] };

    const trendingProperties = trendingResponse.status === 'fulfilled'
      ? await trendingResponse.value.json().catch(() => ({ success: false, data: [] }))
      : { success: false, data: [] };

    const topProperties = topResponse.status === 'fulfilled'
      ? await topResponse.value.json().catch(() => ({ success: false, data: [] }))
      : { success: false, data: [] };

    return {
      featuredProperties: featuredProperties.success ? featuredProperties.data || [] : [],
      trendingProperties: trendingProperties.success ? trendingProperties.data || [] : [],
      topProperties: topProperties.success ? topProperties.data || [] : [],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    // Return empty data on error to prevent page crash
    return {
      featuredProperties: [],
      trendingProperties: [],
      topProperties: [],
      timestamp: new Date().toISOString()
    };
  }
}

export default async function HomePageServer() {
  // Fetch data server-side for SEO purposes
  const homeData = await getHomePageData();

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
          <SectionReveal>
            <CTASection />
          </SectionReveal>
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
