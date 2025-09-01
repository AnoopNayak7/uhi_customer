import { NextResponse } from 'next/server';

export async function GET() {
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

    const homeData = {
      featuredProperties: featuredProperties.success ? featuredProperties.data || [] : [],
      trendingProperties: trendingProperties.success ? trendingProperties.data || [] : [],
      topProperties: topProperties.success ? topProperties.data || [] : [],
      timestamp: new Date().toISOString()
    };

    // Set cache headers for better performance
    return NextResponse.json(homeData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5 minutes cache, 10 minutes stale-while-revalidate
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Error fetching homepage data:', error);
    
    // Return empty data on error to prevent page crash
    return NextResponse.json({
      featuredProperties: [],
      trendingProperties: [],
      topProperties: [],
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch data'
    }, {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
