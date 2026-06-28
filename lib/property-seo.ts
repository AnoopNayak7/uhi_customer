import { cache } from "react";
import type { Metadata } from "next";
import { getApiBaseUrl } from "@/lib/config";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://urbanhousein.com";
const API_URL = getApiBaseUrl();

export type PropertySeoRecord = {
  id: string;
  slug?: string;
  title?: string;
  description?: string;
  city?: string;
  state?: string;
  address?: string;
  zipCode?: string;
  category?: string;
  propertyType?: string;
  price?: number;
  priceRangeStart?: number;
  priceRangeEnd?: number;
  pricePerSqFt?: number;
  bedrooms?: number;
  bhkConfigurations?: string[];
  builtUpAreaRangeStart?: number;
  builtUpAreaRangeEnd?: number;
  areaUnit?: string;
  images?: string[];
  amenities?: string[];
  possessionDate?: string;
  constructionStatus?: string;
  status?: string;
  updatedAt?: string;
  createdAt?: string;
  latitude?: number;
  longitude?: number;
  developer?: { name?: string };
  builderName?: string;
  rera?: { registrationNumber?: string };
  seo?: {
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
  };
};

export const fetchPropertyForSeo = cache(
  async (slugOrId: string): Promise<PropertySeoRecord | null> => {
    try {
      const response = await fetch(
        `${API_URL}/properties/${encodeURIComponent(slugOrId)}`,
        {
          next: { revalidate: 3600 },
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) return null;

      const json = await response.json();
      if (!json?.success || !json?.data) return null;

      return json.data as PropertySeoRecord;
    } catch (error) {
      console.error("SEO property fetch failed:", error);
      return null;
    }
  }
);

export async function fetchApprovedPropertiesForSitemap(): Promise<
  PropertySeoRecord[]
> {
  const properties: PropertySeoRecord[] = [];
  let page = 1;
  const limit = 100;

  try {
    while (page <= 50) {
      const response = await fetch(
        `${API_URL}/properties?page=${page}&limit=${limit}`,
        {
          next: { revalidate: 3600 },
          headers: { Accept: "application/json" },
        }
      );

      if (!response.ok) break;

      const json = await response.json();
      const batch: PropertySeoRecord[] = Array.isArray(json?.data)
        ? json.data
        : [];

      if (!batch.length) break;

      properties.push(...batch);

      if (batch.length < limit) break;
      page += 1;
    }
  } catch (error) {
    console.error("Sitemap property fetch failed:", error);
  }

  return properties;
}

export function getPropertySlug(property: PropertySeoRecord): string {
  return property.slug || property.seo?.slug || property.id;
}

export function getPropertyCanonicalPath(
  property: PropertySeoRecord,
  fallbackSlug?: string
): string {
  const slug = getPropertySlug(property) || fallbackSlug || property.id;
  return `/properties/${slug}`;
}

export function getPropertyCanonicalUrl(
  property: PropertySeoRecord,
  fallbackSlug?: string
): string {
  return `${SITE_URL}${getPropertyCanonicalPath(property, fallbackSlug)}`;
}

function formatPriceShort(price?: number): string {
  if (!price) return "";
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2).replace(/\.00$/, "")} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2).replace(/\.00$/, "")} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

function buildConfigurationText(property: PropertySeoRecord): string {
  if (property.bhkConfigurations?.length) {
    return property.bhkConfigurations.join(", ");
  }
  if (property.bedrooms) return `${property.bedrooms} BHK`;
  return "";
}

export function buildPropertyDescription(property: PropertySeoRecord): string {
  if (property.seo?.metaDescription) {
    return property.seo.metaDescription.slice(0, 160);
  }

  const title = property.title || "Property";
  const city = property.city || "Bengaluru";
  const configs = buildConfigurationText(property);
  const start = formatPriceShort(
    property.priceRangeStart || property.price
  );
  const end = formatPriceShort(property.priceRangeEnd);
  const priceText =
    end && end !== start ? `${start} – ${end}` : start;
  const builder =
    property.developer?.name || property.builderName || "";

  const parts = [
    `${title} in ${city}`,
    configs ? configs : null,
    priceText ? `from ${priceText}` : null,
    "floor plans, amenities & location",
    builder ? `by ${builder}` : null,
    "on Urbanhousein",
  ].filter(Boolean);

  return parts.join(". ").replace(/\.\./g, ".").slice(0, 160);
}

export function buildPropertyTitle(property: PropertySeoRecord): string {
  if (property.seo?.metaTitle) {
    return property.seo.metaTitle.replace(/UrbanHouseIN/gi, "Urbanhousein");
  }

  const title = property.title || "Property";
  const city = property.city || "Bengaluru";
  const category = property.category
    ? property.category.charAt(0).toUpperCase() + property.category.slice(1)
    : "Property";

  return `${title} | ${category} in ${city} | Urbanhousein`;
}

export function buildPropertyKeywords(property: PropertySeoRecord): string[] {
  const title = property.title || "";
  const city = property.city || "Bengaluru";
  const category = property.category || "apartment";
  const configs = buildConfigurationText(property);
  const builder = property.developer?.name || property.builderName || "";

  const keywords = new Set<string>(
    [
      title,
      `${title} ${city}`,
      `${title} price`,
      `${title} floor plan`,
      `${title} ${category}`,
      `${title} reviews`,
      `${title} possession date`,
      configs ? `${configs} in ${city}` : null,
      configs ? `${title} ${configs}` : null,
      `${category} in ${city}`,
      `${city} real estate`,
      builder,
      builder ? `${builder} ${city}` : null,
      "Urbanhousein",
      "property for sale",
      "book site visit",
      property.seo?.keywords,
    ].filter(Boolean) as string[]
  );

  return Array.from(keywords);
}

function getOgImage(property: PropertySeoRecord): string {
  const image = property.images?.[0];
  if (!image) return `${SITE_URL}/images/og-default.jpg`;
  return image.startsWith("http") ? image : `${SITE_URL}${image}`;
}

export function buildPropertyMetadata(
  property: PropertySeoRecord | null,
  fallbackSlug?: string
): Metadata {
  if (!property) {
    return {
      title: "Property Not Found | Urbanhousein",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = getPropertyCanonicalUrl(property, fallbackSlug);
  const title = buildPropertyTitle(property);
  const description = buildPropertyDescription(property);
  const keywords = buildPropertyKeywords(property);
  const ogImage = getOgImage(property);
  const isIndexable = property.status !== "pending" && property.status !== "rejected";

  return {
    title,
    description,
    keywords,
    authors: [{ name: "Urbanhousein" }],
    creator: "Urbanhousein",
    publisher: "Urbanhousein",
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: isIndexable
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        }
      : { index: false, follow: false },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Urbanhousein",
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: property.title || "Property listing",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      site: "@urbanhousein",
      creator: "@urbanhousein",
    },
    other: {
      "geo.region": property.state || "IN-KA",
      "geo.placename": property.city || "Bengaluru",
    },
  };
}

export function buildPropertyStructuredData(
  property: PropertySeoRecord,
  fallbackSlug?: string
) {
  const canonicalUrl = getPropertyCanonicalUrl(property, fallbackSlug);
  const configs = buildConfigurationText(property);
  const price = property.priceRangeStart || property.price;
  const images = (property.images || []).filter(Boolean).slice(0, 5);

  const realEstateListing = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${canonicalUrl}#listing`,
    name: property.title,
    description: property.description || buildPropertyDescription(property),
    url: canonicalUrl,
    image: images.length ? images : undefined,
    datePosted: property.createdAt || undefined,
    dateModified: property.updatedAt || property.createdAt || undefined,
    offers: price
      ? {
          "@type": "Offer",
          price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: canonicalUrl,
        }
      : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
      addressRegion: property.state,
      postalCode: property.zipCode,
      addressCountry: "IN",
    },
    geo:
      property.latitude && property.longitude
        ? {
            "@type": "GeoCoordinates",
            latitude: property.latitude,
            longitude: property.longitude,
          }
        : undefined,
    numberOfRooms: property.bedrooms || undefined,
    floorSize:
      property.builtUpAreaRangeStart || property.builtUpAreaRangeEnd
        ? {
            "@type": "QuantitativeValue",
            minValue: property.builtUpAreaRangeStart,
            maxValue:
              property.builtUpAreaRangeEnd || property.builtUpAreaRangeStart,
            unitText: property.areaUnit || "sqft",
          }
        : undefined,
    amenityFeature: property.amenities?.slice(0, 12).map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    additionalProperty: configs
      ? [
          {
            "@type": "PropertyValue",
            name: "Configurations",
            value: configs,
          },
        ]
      : undefined,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${SITE_URL}/properties`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.city || "Bengaluru",
        item: `${SITE_URL}/properties?city=${encodeURIComponent(property.city || "Bengaluru")}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: property.title,
        item: canonicalUrl,
      },
    ],
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: buildPropertyTitle(property),
    description: buildPropertyDescription(property),
    isPartOf: {
      "@type": "WebSite",
      name: "Urbanhousein",
      url: SITE_URL,
    },
    about: {
      "@id": `${canonicalUrl}#listing`,
    },
    primaryImageOfPage: images[0] || undefined,
    inLanguage: "en-IN",
  };

  const organization = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Urbanhousein",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon-32x32.png`,
    areaServed: property.city || "Bengaluru",
  };

  return [realEstateListing, breadcrumb, webPage, organization];
}
