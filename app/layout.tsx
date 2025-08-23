import "./globals.css";
import type { Metadata } from "next";
import { Inter, Lato, Montserrat, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/auth/auth-provider";
import { LayoutWrapper } from "@/components/animations/layout-wrapper";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

// Manrope - closest to Airbnb Cereal
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
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
    <html lang="en">
      <body className={manrope.className}>
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
