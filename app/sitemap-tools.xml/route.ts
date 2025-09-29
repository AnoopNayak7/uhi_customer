import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://urbanhousein.com';
  const currentDate = new Date().toISOString();

  const toolPages = [
    {
      url: '/tools/price-trends',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      title: 'Property Price Trends Analysis',
      description: 'Track real estate price trends across major Indian cities with comprehensive market analysis and insights.'
    },
    {
      url: '/tools/area-insights',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      title: 'Area Insights & Neighborhood Analysis',
      description: 'Get comprehensive area insights and neighborhood analysis for informed property decisions.'
    },
    {
      url: '/tools/home-affordability',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
      title: 'Home Affordability Calculator',
      description: 'Calculate your home affordability with advanced mortgage calculator and budget recommendations.'
    },
    {
      url: '/tools/investment-calculator',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      title: 'Real Estate Investment Calculator',
      description: 'Calculate ROI, rental yields, and investment returns for real estate properties.'
    },
    {
      url: '/tools/mortgage-calculator',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      title: 'Mortgage Calculator',
      description: 'Calculate EMI, loan eligibility, and mortgage payments for home loans.'
    },
    {
      url: '/tools/property-value',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      title: 'Property Value Estimator',
      description: 'Estimate property values and get market valuations for real estate investments.'
    },
    {
      url: '/tools/property-comparison',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      title: 'Property Comparison Tool',
      description: 'Compare multiple properties side by side with detailed analysis and insights.'
    },
    {
      url: '/tools/market-predictor',
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
      title: 'Real Estate Market Predictor',
      description: 'Predict future property prices and market trends with AI-powered analysis.'
    },
    {
      url: '/tools/investment-guide',
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
      title: 'Real Estate Investment Guide',
      description: 'Comprehensive guide to real estate investment strategies and best practices.'
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${toolPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
    <image:image>
      <image:loc>${baseUrl}/images/og${page.url.replace('/tools/', '-')}.jpg</image:loc>
      <image:title>${page.title}</image:title>
      <image:caption>${page.description}</image:caption>
    </image:image>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
