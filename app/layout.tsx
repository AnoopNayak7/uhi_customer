import './globals.css';
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/components/auth/auth-provider';

const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'UrbanHouseIN - Find Your Dream Property | Real Estate Platform',
  description: 'Discover your perfect property with UrbanHouseIN. Browse apartments, houses, villas, and commercial properties across India. Expert guidance, trusted platform.',
  keywords: 'real estate, property, buy property, rent property, apartments, houses, villas, commercial property, India, Bangalore, Mumbai, Delhi',
  authors: [{ name: 'UrbanHouseIN Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'UrbanHouseIN - Find Your Dream Property',
    description: 'Discover your perfect property with UrbanHouseIN. Browse apartments, houses, villas, and commercial properties across India.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'UrbanHouseIN'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanHouseIN - Find Your Dream Property',
    description: 'Discover your perfect property with UrbanHouseIN. Browse apartments, houses, villas, and commercial properties across India.'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
        {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}