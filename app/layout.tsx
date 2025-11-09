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
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ThemeManager } from "@/components/gtm/theme-manager";
import { DynamicBanner } from "@/components/gtm/dynamic-banner";
import { UserTracker } from "@/components/gtm/user-tracker";
import { FestivalAnimations } from "@/components/gtm/festival-animations";

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
  title: "Urbanhousein - Find Your Dream Property | Real Estate Platform",
  description:
    "Discover your perfect property with Urbanhousein. Browse apartments, houses, villas, and commercial properties across India. Expert guidance, trusted platform.",
  keywords:
    "real estate, property, buy property, rent property, apartments, houses, villas, commercial property, India, Bangalore, Mumbai, Delhi",
  authors: [{ name: "Urbanhousein Team" }],
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  robots: "index, follow",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "Urbanhousein - Find Your Dream Property",
    description:
      "Discover your perfect property with Urbanhousein. Browse apartments, houses, villas, and commercial properties across India.",
    type: "website",
    locale: "en_IN",
    siteName: "Urbanhousein",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urbanhousein - Find Your Dream Property",
    description:
      "Discover your perfect property with Urbanhousein. Browse apartments, houses, villas, and commercial properties across India.",
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
        {/* Google Tag Manager */}
        {/* eslint-disable-next-line @next/next/next-script-for-ga */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KVLFHQBW');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Favicon - Multiple formats for maximum compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="icon"
          href="/favicon-16x16.png"
          type="image/png"
          sizes="16x16"
        />
        <link
          rel="icon"
          href="/favicon-32x32.png"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="/sitemap.xml"
        />
        <meta name="fast2sms" content="hXJm1SOZmniVyY6DGucUOlUtilaN9xuF" />

        {/* Force favicon refresh and prevent caching */}
        <meta
          http-equiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <meta name="format-detection" content="telephone=no" />

        {/* Favicon debugging script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            // Check if favicon is loaded
            window.addEventListener('load', function() {
              const favicon = document.querySelector('link[rel="icon"]');
              if (favicon) {
                console.log('Favicon found:', favicon.href);
                // Test favicon loading
                const img = new Image();
                img.onload = function() {
                  console.log('Favicon loaded successfully');
                };
                img.onerror = function() {
                  console.log('Favicon failed to load');
                };
                img.src = favicon.href;
              } else {
                console.log('No favicon found');
              }
            });
          `,
          }}
        />

        {/* Additional favicon meta tags for better compatibility */}
        <meta name="msapplication-TileColor" content="#dc2626" />
        <meta name="msapplication-TileImage" content="/favicon-32x32.png" />
        <meta name="theme-color" content="#dc2626" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-KVLFHQBW"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AuthProvider>
          <LocationProvider>
            <ThemeManager />
            <UserTracker />
            <DynamicBanner />
            <FestivalAnimations />
            <FavouritesSync />
            <LayoutWrapper>{children}</LayoutWrapper>
          </LocationProvider>
        </AuthProvider>
        <Toaster />
        <WebVitals />
        <PerformanceBudget />
        {(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-80WS6JHGEK") && (
          <GoogleAnalytics
            measurementId={
              process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-80WS6JHGEK"
            }
          />
        )}
      </body>
    </html>
  );
}
