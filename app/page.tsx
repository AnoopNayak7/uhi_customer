import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HomepageClient } from "@/components/home/homepage-client";
import { HomepageSEOContent } from "@/components/home/homepage-seo-content";

// Enhanced SEO metadata for the homepage
export const metadata: Metadata = {
  title: "UrbanHouseIN - Premium Real Estate Properties in India | Buy, Sell, Rent Properties",
  description: "Discover premium real estate properties across India with UrbanHouseIN. Find luxury apartments, modern villas, commercial spaces, and investment properties. Expert guidance, verified listings, and comprehensive market insights for your property journey.",
  keywords: [
    "real estate India",
    "property for sale",
    "apartments for sale",
    "villas for sale", 
    "commercial property",
    "property investment",
    "real estate platform",
    "property search",
    "luxury properties",
    "premium real estate",
    "property trends",
    "real estate market",
    "property valuation",
    "mortgage calculator",
    "investment calculator",
    "property comparison",
    "area insights",
    "price trends",
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
    "real estate agents",
    "property developers",
    "verified properties",
    "property listings",
    "real estate tools",
    "property market analysis"
  ].join(", "),
  authors: [{ name: "UrbanHouseIN Team" }],
  creator: "UrbanHouseIN",
  publisher: "UrbanHouseIN",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://urbanhousein.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "UrbanHouseIN - Premium Real Estate Properties in India",
    description: "Discover premium real estate properties across India with UrbanHouseIN. Find luxury apartments, modern villas, commercial spaces, and investment properties with expert guidance.",
    url: "https://urbanhousein.com",
    siteName: "UrbanHouseIN",
    images: [
      {
        url: "https://urbanhousein.com/og-image-home.jpg",
        width: 1200,
        height: 630,
        alt: "UrbanHouseIN - Premium Real Estate Properties in India",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanHouseIN - Premium Real Estate Properties in India",
    description: "Discover premium real estate properties across India with UrbanHouseIN. Find luxury apartments, modern villas, commercial spaces, and investment properties.",
    images: ["https://urbanhousein.com/og-image-home.jpg"],
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

// Structured Data for Real Estate
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://urbanhousein.com/#website",
      "url": "https://urbanhousein.com/",
      "name": "UrbanHouseIN",
      "description": "Premium real estate platform in India",
      "potentialAction": [
        {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://urbanhousein.com/properties?search={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      ],
      "inLanguage": "en-IN"
    },
    {
      "@type": "Organization",
      "@id": "https://urbanhousein.com/#organization",
      "name": "UrbanHouseIN",
      "url": "https://urbanhousein.com/",
      "logo": {
        "@type": "ImageObject",
        "inLanguage": "en-IN",
        "@id": "https://urbanhousein.com/#/schema/logo/image/",
        "url": "https://urbanhousein.com/logo.png",
        "contentUrl": "https://urbanhousein.com/logo.png",
        "width": 200,
        "height": 60,
        "caption": "UrbanHouseIN"
      },
      "image": {
        "@id": "https://urbanhousein.com/#/schema/logo/image/"
      },
      "description": "UrbanHouseIN is India's leading real estate platform, helping you find premium properties across the country with expert guidance and comprehensive market insights.",
      "foundingDate": "2024",
      "sameAs": [
        "https://www.facebook.com/urbanhousein",
        "https://www.twitter.com/urbanhousein",
        "https://www.instagram.com/urbanhousein",
        "https://www.linkedin.com/company/urbanhousein"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      }
    },
    {
      "@type": "WebPage",
      "@id": "https://urbanhousein.com/#webpage",
      "url": "https://urbanhousein.com/",
      "name": "UrbanHouseIN - Premium Real Estate Properties in India",
      "isPartOf": {
        "@id": "https://urbanhousein.com/#website"
      },
      "about": {
        "@id": "https://urbanhousein.com/#organization"
      },
      "description": "Discover premium real estate properties across India with UrbanHouseIN. Find luxury apartments, modern villas, commercial spaces, and investment properties.",
      "breadcrumb": {
        "@id": "https://urbanhousein.com/#breadcrumb"
      },
      "inLanguage": "en-IN"
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://urbanhousein.com/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://urbanhousein.com/"
        }
      ]
    },
    {
      "@type": "RealEstateAgent",
      "@id": "https://urbanhousein.com/#realestateagent",
      "name": "UrbanHouseIN",
      "description": "Leading real estate platform in India",
      "url": "https://urbanhousein.com/",
      "logo": "https://urbanhousein.com/logo.png",
      "image": "https://urbanhousein.com/og-image-home.jpg",
      "telephone": "+91-XXXXXXXXXX",
      "email": "info@urbanhousein.com",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "IN"
      },
      "areaServed": {
        "@type": "Country",
        "name": "India"
      },
      "serviceType": [
        "Property Sales",
        "Property Rentals", 
        "Property Investment",
        "Property Valuation",
        "Market Analysis",
        "Real Estate Consulting"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I find properties on UrbanHouseIN?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can search properties by location, type, price range, and other filters. Use our advanced search tools to find your perfect property across India."
          }
        },
        {
          "@type": "Question", 
          "name": "Are the properties verified on UrbanHouseIN?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we verify all properties listed on our platform. We work with trusted developers and agents to ensure quality listings and authentic property information."
          }
        },
        {
          "@type": "Question",
          "name": "Can I get price trends for specific areas?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, we provide detailed price trends and market insights for different areas and property types across India. Use our area insights tool for comprehensive market analysis."
          }
        },
        {
          "@type": "Question",
          "name": "What types of properties are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer luxury apartments, modern villas, commercial spaces, residential plots, investment properties, ready-to-move properties, and under-construction projects across India."
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

export default function HomePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <HomepageClient />
        <Footer />
      </div>
      
      {/* SEO Content - Hidden from users but visible to search engines */}
      <HomepageSEOContent />
    </>
  );
}