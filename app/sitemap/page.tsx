import { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Home, TreePine, Briefcase, MapPin, FileText, Shield, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sitemap - urbanhousein | Complete Site Navigation',
  description: 'Complete sitemap of urbanhousein - Navigate through all property listings, areas, and services. Find apartments, houses, plots, and commercial properties in Bengaluru.',
  keywords: 'sitemap, urbanhousein, property navigation, bengaluru properties, real estate sitemap',
};

export default function SitemapPage() {
  const mainPages = [
    { title: 'Home', href: '/', description: 'Main homepage with property search and featured listings' },
    { title: 'Properties', href: '/properties', description: 'Browse all properties with advanced filters' },
    { title: 'Real estate Tools', href: '/tools/real-estate', description: 'Tools and resources for real estate agents and buyers' },
    { title: 'Home affordability Calculator', href: '/tools/home-affordability', description: 'Calculate your home affordability with our easy-to-use tool' },
    { title: 'Advanced Mortgage Calculator', href: '/tools/mortgage-calculator', description: 'Get detailed mortgage calculations with our advanced tool' },
    { title: 'AI Market Trend Predictor', href: '/tools/market-predictor', description: 'Predict real estate market trends with our AI tool' },
    { title: 'Property Value Calculator', href: '/tools/property-value', description: 'Estimate property values with our detailed tool' },
    { title: 'Area Insights', href: '/tools/area-insights', description: 'Explore comprehensive neighborhood statistics, demographics, and livability scores with beautiful data visualization' },
    // { title: 'Contact', href: '/contact', description: 'Get in touch with our real estate experts' },
  ];

  const propertyCategories = [
    { title: 'Apartments for Sale', href: '/properties?category=apartment&type=sell', icon: Building, description: 'Find apartments and flats for sale in Bengaluru' },
    { title: 'Houses for Sale', href: '/properties?category=house&type=sell', icon: Home, description: 'Discover houses and villas for sale' },
    { title: 'Plots for Sale', href: '/properties?category=plot&type=sell', icon: TreePine, description: 'Invest in residential plots and land' },
    { title: 'Commercial Properties', href: '/properties?type=commercial', icon: Briefcase, description: 'Office spaces and retail properties' },
    { title: 'Properties for Rent', href: '/properties?type=rent', icon: Building, description: 'Rental properties across Bengaluru' },
  ];

  const popularAreas = [
    { name: 'Whitefield', href: '/properties?city=Bengaluru&area=Whitefield', description: 'IT hub with premium properties' },
    { name: 'Electronic City', href: '/properties?city=Bengaluru&area=Electronic%20City', description: 'Affordable housing near tech parks' },
    { name: 'Sarjapur Road', href: '/properties?city=Bengaluru&area=Sarjapur%20Road', description: 'Growing residential corridor' },
    { name: 'Koramangala', href: '/properties?city=Bengaluru&area=Koramangala', description: 'Central location with established infrastructure' },
    { name: 'Indiranagar', href: '/properties?city=Bengaluru&area=Indiranagar', description: 'Upscale neighborhood with luxury properties' },
    { name: 'HSR Layout', href: '/properties?city=Bengaluru&area=HSR%20Layout', description: 'Planned residential area' },
    { name: 'JP Nagar', href: '/properties?city=Bengaluru&area=JP%20Nagar', description: 'Family-friendly locality' },
    { name: 'Bannerghatta Road', href: '/properties?city=Bengaluru&area=Bannerghatta%20Road', description: 'Emerging residential area' },
    { name: 'Marathahalli', href: '/properties?city=Bengaluru&area=Marathahalli', description: 'Affordable housing options' },
    { name: 'Bellandur', href: '/properties?city=Bengaluru&area=Bellandur', description: 'Lakeside properties' },
  ];

  const legalPages = [
    { title: 'Privacy Policy', href: '/privacy', icon: Shield, description: 'Our privacy practices and data protection' },
    { title: 'Terms of Service', href: '/terms', icon: FileText, description: 'Terms and conditions of using our platform' },
    { title: 'Help Center', href: '/help', icon: HelpCircle, description: 'Frequently asked questions and support' },
  ];

  const cities = [
    { name: 'Bengaluru', href: '/properties?city=Bengaluru', description: 'Primary market with comprehensive listings' },
    { name: 'Mumbai', href: '/properties?city=Mumbai', description: 'Coming soon - Premium properties' },
    { name: 'Delhi', href: '/properties?city=Delhi', description: 'Coming soon - Capital city properties' },
    { name: 'Chennai', href: '/properties?city=Chennai', description: 'Coming soon - South Indian properties' },
    { name: 'Hyderabad', href: '/properties?city=Hyderabad', description: 'Coming soon - IT hub properties' },
    { name: 'Pune', href: '/properties?city=Pune', description: 'Coming soon - Educational hub properties' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Sitemap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete navigation guide for urbanhousein. Find all properties, areas, and services in one place.
          </p>
        </div>

        {/* Main Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Main Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mainPages.map((page) => (
              <Card key={page.title} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    <Link href={page.href} className="hover:text-red-600 transition-colors">
                      {page.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">{page.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Property Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propertyCategories.map((category) => (
              <Card key={category.title} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <category.icon className="w-8 h-8 text-red-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link href={category.href} className="hover:text-red-600 transition-colors">
                        {category.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Areas in Bengaluru */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Areas in Bengaluru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularAreas.map((area) => (
              <Card key={area.name} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <MapPin className="w-5 h-5 text-red-500 mr-2" />
                    <h3 className="font-semibold text-gray-900">
                      <Link href={area.href} className="hover:text-red-600 transition-colors">
                        {area.name}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <Card key={city.name} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    <Link href={city.href} className="hover:text-red-600 transition-colors">
                      Properties in {city.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-600">{city.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal & Help Pages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal & Help</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {legalPages.map((page) => (
              <Card key={page.title} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <page.icon className="w-8 h-8 text-red-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link href={page.href} className="hover:text-red-600 transition-colors">
                        {page.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-gray-600">{page.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              About urbanhousein Sitemap
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Use Our Sitemap?</h3>
                <ul className="space-y-2">
                  <li>• Easy navigation to all property types</li>
                  <li>• Quick access to popular areas in Bengaluru</li>
                  <li>• Find specific property categories</li>
                  <li>• Access to legal and help pages</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Property Search Tips</h3>
                <ul className="space-y-2">
                  <li>• Use filters to narrow down your search</li>
                  <li>• Check multiple areas for best deals</li>
                  <li>• Compare different property types</li>
                  <li>• Contact our experts for guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
