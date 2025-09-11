import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Tool pages - high priority for SEO
Allow: /tools/price-trends
Allow: /tools/area-insights
Allow: /tools/home-affordability
Allow: /tools/investment-calculator
Allow: /tools/mortgage-calculator
Allow: /tools/property-value
Allow: /tools/property-comparison
Allow: /tools/market-predictor
Allow: /tools/investment-guide

# Main pages
Allow: /
Allow: /properties
Allow: /about
Allow: /contact
Allow: /pricing
Allow: /privacy
Allow: /terms

# API endpoints - disallow crawling
Disallow: /api/

# Admin pages - disallow crawling
Disallow: /admin/
Disallow: /dashboard/

# User-specific pages - disallow crawling
Disallow: /profile/
Disallow: /favourites/
Disallow: /viewed-properties/

# Sitemaps
Sitemap: https://urbanhousein.com/sitemap.xml
Sitemap: https://urbanhousein.com/sitemap-tools.xml

# Crawl delay for better server performance
Crawl-delay: 1`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}