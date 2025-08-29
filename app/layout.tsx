import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth/auth-provider";
import { LocationProvider } from "@/components/layout/location-provider";
import { LayoutWrapper } from "@/components/animations/layout-wrapper";
import { FavouritesSync } from "@/components/layout/favourites-sync";
import {
  WebVitals,
  PerformanceBudget,
} from "@/components/performance/web-vitals";

// Manrope - Primary font (closest to Airbnb Cereal)
// Optimized with font-display: swap for better performance
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "sans-serif",
  ],
  adjustFontFallback: true,
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "UrbanHouseIN - Find Your Dream Property | Real Estate Platform",
  description:
    "Discover your perfect property with UrbanHouseIN. Browse apartments, houses, villas, and commercial properties across India. Expert guidance, trusted platform.",
  keywords:
    "real estate, property, buy property, rent property, apartments, houses, villas, commercial property, India, Bangalore, Mumbai, Delhi",
  authors: [{ name: "UrbanHouseIN Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "UrbanHouseIN - Find Your Dream Property",
    description:
      "Discover your perfect property with UrbanHouseIN. Browse apartments, houses, villas, and commercial properties across India.",
    type: "website",
    locale: "en_IN",
    siteName: "UrbanHouseIN",
  },
  twitter: {
    card: "summary_large_image",
    title: "UrbanHouseIN - Find Your Dream Property",
    description:
      "Discover your perfect property with UrbanHouseIN. Browse apartments, houses, villas, and commercial properties across India.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/* Preload critical font weights */}
        <link
          rel="preload"
          href="/_next/static/media/manrope-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/manrope-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/_next/static/media/manrope-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${manrope.className} font-sans`}>
        <AuthProvider>
          <LocationProvider>
            <FavouritesSync />
            <LayoutWrapper>{children}</LayoutWrapper>
          </LocationProvider>
        </AuthProvider>
        <Toaster />
        <WebVitals />
        <PerformanceBudget />
      </body>
    </html>
  );
}
