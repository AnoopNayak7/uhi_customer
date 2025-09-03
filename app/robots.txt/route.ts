import { MetadataRoute } from 'next'

export function GET(): Response {
  const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://urbanhousein.com/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /_next/
Disallow: /auth/
Disallow: /favourites/
Disallow: /viewed-properties/

# Allow important pages
Allow: /properties
Allow: /tools/
Allow: /contact
Allow: /pricing
Allow: /privacy
Allow: /terms

# Host
Host: https://urbanhousein.com`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
