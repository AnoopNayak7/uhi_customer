import {
  fetchApprovedPropertiesForSitemap,
  getPropertyCanonicalUrl,
} from "@/lib/property-seo";

export const revalidate = 3600;

export async function GET(): Promise<Response> {
  const properties = await fetchApprovedPropertiesForSitemap();

  const urls = properties
    .map((property) => {
      const loc = getPropertyCanonicalUrl(property);
      const lastmod = property.updatedAt || property.createdAt;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod ? new Date(lastmod).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
