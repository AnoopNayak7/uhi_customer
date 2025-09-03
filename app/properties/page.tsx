import { Metadata } from "next";
import { PropertiesSEOContent } from "@/components/propertyListing/PropertiesSEOContent";
import { PropertiesPageClient } from "@/components/propertyListing/PropertiesPageClient";

// Enhanced SEO metadata for the properties page
export const metadata: Metadata = {
  title: "Properties for Sale & Rent in Bengaluru | Urbanhousein - Real Estate Listings",
  description: "Discover premium properties for sale and rent across Bengaluru. Browse apartments, villas, commercial spaces, and plots with detailed information, high-quality images, and expert guidance. Find your dream property today.",
  keywords: [
    "properties for sale",
    "properties for rent", 
    "real estate listings",
    "apartments for sale",
    "villas for sale",
    "commercial properties",
    "residential properties",
    "property search",
    "real estate India",
    "property listings",
    "buy property",
    "rent property",
    "property investment",
    "luxury properties",
    "affordable housing",
    "ready to move properties",
    "under construction projects",
    "property prices",
    "property trends",
    "real estate market",
    "property valuation",
    "property comparison",
    "Bengaluru properties",
    "Mumbai properties", 
    "Delhi properties",
    "Pune properties",
    "Hyderabad properties",
    "Chennai properties",
    "Kolkata properties",
    "Ahmedabad properties",
    "Gurgaon properties",
    "Noida properties",
    "property agents",
    "property developers",
    "verified properties",
    "property search tools",
    "real estate platform"
  ].join(", "),
  authors: [{ name: "Urbanhousein Team" }],
  creator: "Urbanhousein",
  publisher: "Urbanhousein",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://urbanhousein.com"),
  alternates: {
    canonical: "/properties",
  },
  openGraph: {
    title: "Properties for Sale & Rent in Bengaluru | Urbanhousein",
    description: "Discover premium properties for sale and rent across India. Browse apartments, villas, commercial spaces, and plots with detailed information and expert guidance.",
    url: "https://urbanhousein.com/properties",
    siteName: "Urbanhousein",
    images: [
      {
        url: "https://urbanhousein.com/og-image-properties.jpg",
        width: 1200,
        height: 630,
        alt: "Properties for Sale & Rent in Bengaluru - Urbanhousein",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Properties for Sale & Rent in Bengaluru | Urbanhousein",
    description: "Discover premium properties for sale and rent across Bengaluru. Browse apartments, villas, commercial spaces, and plots with detailed information.",
    images: ["https://urbanhousein.com/og-image-properties.jpg"],
    creator: "@urbanhousein",
    site: "@urbanhousein",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "Real Estate",
};

// Structured Data for Properties Page
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://urbanhousein.com/properties/#webpage",
      "url": "https://urbanhousein.com/properties",
      "name": "Properties for Sale & Rent in Bengaluru | Urbanhousein",
      "isPartOf": {
        "@id": "https://urbanhousein.com/#website"
      },
      "about": {
        "@id": "https://urbanhousein.com/#organization"
      },
      "description": "Discover premium properties for sale and rent across Bengaluru. Browse apartments, villas, commercial spaces, and plots with detailed information and expert guidance.",
      "breadcrumb": {
        "@id": "https://urbanhousein.com/properties/#breadcrumb"
      },
      "inLanguage": "en-IN"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://urbanhousein.com/properties/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://urbanhousein.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Properties",
          "item": "https://urbanhousein.com/properties"
        }
      ]
    },
    {
      "@type": "ItemList",
      "name": "Real Estate Properties",
      "description": "Comprehensive list of properties for sale and rent across India",
      "url": "https://urbanhousein.com/properties",
      "numberOfItems": "1000+",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "RealEstateListing",
            "name": "Properties for Sale",
            "description": "Browse properties available for purchase across India"
          }
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "item": {
            "@type": "RealEstateListing",
            "name": "Properties for Rent",
            "description": "Find rental properties in prime locations across India"
          }
        },
        {
          "@type": "ListItem",
          "position": 3,
          "item": {
            "@type": "RealEstateListing", 
            "name": "Commercial Properties",
            "description": "Commercial real estate listings for business and investment"
          }
        }
      ]
    },
    {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://urbanhousein.com/properties?search={search_term_string}&type={property_type}&city={city_name}"
      },
      "query-input": "required name=search_term_string"
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I search for properties on Urbanhousein?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can search properties by location, type (buy/rent), price range, property category, and other filters. Use our advanced search tools to find your perfect property."
          }
        },
        {
          "@type": "Question",
          "name": "What types of properties are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer apartments, villas, commercial spaces, residential plots, ready-to-move properties, and under-construction projects across major Indian cities."
          }
        },
        {
          "@type": "Question",
          "name": "Are the property listings verified?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we verify all property listings on our platform. We work with trusted developers and agents to ensure authentic and up-to-date property information."
          }
        },
        {
          "@type": "Question",
          "name": "Can I compare properties?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can compare up to 3 properties side by side using our property comparison tool to make informed decisions."
          }
        },
        {
          "@type": "Question",
          "name": "How do I contact property agents?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can contact agents directly through our platform. Each property listing has contact information and inquiry forms for easy communication."
          }
        }
      ]
    }
  ]
};

export default function PropertiesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <PropertiesPageClient />
      
      {/* SEO Content - Hidden from users but visible to search engines */}
      <PropertiesSEOContent />
    </>
  );
}