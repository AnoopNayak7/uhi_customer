"use client";

import Head from 'next/head';

export const HomePageSEO = () => {
  const metaTitle = "Urbanhousein - Find Your Dream Property in India | Real Estate Platform";
  const metaDescription = "Discover the best properties across India on Urbanhousein. Find apartments, villas, commercial properties with detailed insights, price trends, and expert guidance. Your trusted real estate partner.";
  const canonicalUrl = "https://urbanhousein.com";
  const ogImage = "https://urbanhousein.com/og-image-home.jpg";

  // Generate organization structured data
  const generateOrganizationData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Urbanhousein",
    "url": canonicalUrl,
    "logo": "https://urbanhousein.com/logo.png",
    "description": "Urbanhousein is a leading real estate platform helping you find the perfect property across India. Discover apartments, villas, and commercial properties with detailed insights and expert guidance.",
    "foundingDate": "2024",
    "sameAs": [
      "https://facebook.com/urbanhousein",
      "https://twitter.com/urbanhousein",
      "https://instagram.com/urbanhousein",
      "https://linkedin.com/company/urbanhousein"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9663024571",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["English", "Hindi", "Kannada"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Properties",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Property Search",
            "description": "Find properties across India"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Price Trends",
            "description": "Real estate market insights"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Area Insights",
            "description": "Neighborhood information"
          }
        }
      ]
    }
  });

  // Generate website structured data
  const generateWebsiteData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Urbanhousein",
    "url": canonicalUrl,
    "description": "Leading real estate platform in India",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://urbanhousein.com/properties?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Urbanhousein"
    }
  });

  // Generate local business structured data
  const generateLocalBusinessData = () => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Urbanhousein",
    "description": "Real estate platform serving India",
    "url": canonicalUrl,
    "telephone": "+91-XXXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 20.5937,
      "longitude": 78.9629
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Real Estate Services"
    }
  });

  // Generate FAQ structured data
  const generateFAQData = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I find properties on Urbanhousein?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can search properties by location, type, price range, and other filters. Use our advanced search tools to find your perfect property."
        }
      },
      {
        "@type": "Question",
        "name": "Are the properties verified on Urbanhousein?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we verify all properties listed on our platform. We work with trusted developers and agents to ensure quality listings."
        }
      },
      {
        "@type": "Question",
        "name": "Can I get price trends for specific areas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we provide detailed price trends and market insights for different areas and property types across India."
        }
      },
      {
        "@type": "Question",
        "name": "How do I contact property agents?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact agents directly through our platform. Each property listing has contact information and inquiry forms."
        }
      }
    ]
  });

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content="real estate, property, apartments, villas, commercial properties, India, real estate platform, property search, price trends, area insights, Urbanhousein" />
      <meta name="author" content="Urbanhousein" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Urbanhousein" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@urbanhousein" />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ef4444" />
      <meta name="msapplication-TileColor" content="#ef4444" />
      
      {/* Language and Region */}
      <meta name="language" content="English" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      
      {/* Business Information */}
      <meta name="business:contact_data:street_address" content="India" />
      <meta name="business:contact_data:country_name" content="India" />
      <meta name="business:contact_data:phone_number" content="+91-XXXXXXXXXX" />
      <meta name="business:contact_data:email" content="info@urbanhousein.com" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationData())
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateWebsiteData())
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateLocalBusinessData())
        }}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQData())
        }}
      />

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://urbanhousein-images-dev.s3.us-east-1.amazonaws.com" />
      <link rel="dns-prefetch" href="https://urbanhousein-images-dev.s3.us-east-1.amazonaws.com" />
      
      {/* Additional performance optimizations */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Head>
  );
};
