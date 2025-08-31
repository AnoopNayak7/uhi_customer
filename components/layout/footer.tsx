"use client";

import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { APP_CONFIG } from '@/lib/config';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLocationData } from '@/hooks/use-location-data';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { getDefaultCity, getDefaultArea } = useLocationData();

  const popularCities = [
    'Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad', 'Pune'
  ];

  const quickLinks = [
    // { label: 'About Us', href: '/about' },
    // { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Blog', href: '/blog' },
    // { label: 'Help Center', href: '/help' }
  ];

  const propertyTypes = [
    { label: `Apartments for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=apartment&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Houses for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=house&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Villas for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=villa&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Apartments for Rent in ${getDefaultCity()}`, href: `/properties?type=rent&category=apartment&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Commercial Properties in ${getDefaultCity()}`, href: `/properties?type=commercial&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Plots for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=plot&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` }
  ];

  // Bengaluru-specific area links
  const bengaluruAreas = [
    { label: 'Flats in Whitefield', href: '/properties?city=Bengaluru&area=Whitefield' },
    { label: 'Flats near Yelahanka', href: '/properties?city=Bengaluru&area=Yelahanka' },
    { label: 'Flats in Electronic City', href: '/properties?city=Bengaluru&area=Electronic%20City' },
    { label: 'Flats in Marathahalli', href: '/properties?city=Bengaluru&area=Marathahalli' },
    { label: 'Flats in Sarjapur Road', href: '/properties?city=Bengaluru&area=Sarjapur%20Road' },
    { label: 'Flats in Bellandur', href: '/properties?city=Bengaluru&area=Bellandur' },
    { label: 'Flats in HSR Layout', href: '/properties?city=Bengaluru&area=HSR%20Layout' },
    { label: 'Flats in Koramangala', href: '/properties?city=Bengaluru&area=Koramangala' },
    { label: 'Flats in Indiranagar', href: '/properties?city=Bengaluru&area=Indiranagar' },
    { label: 'Flats in JP Nagar', href: '/properties?city=Bengaluru&area=JP%20Nagar' },
    { label: 'Flats in Bannerghatta Road', href: '/properties?city=Bengaluru&area=Bannerghatta%20Road' },
    { label: 'Flats in Kanakapura Road', href: '/properties?city=Bengaluru&area=Kanakapura%20Road' },
    { label: 'Flats in Mysore Road', href: '/properties?city=Bengaluru&area=Mysore%20Road' },
    { label: 'Flats in Tumkur Road', href: '/properties?city=Bengaluru&area=Tumkur%20Road' },
    { label: 'Flats in Old Airport Road', href: '/properties?city=Bengaluru&area=Old%20Airport%20Road' },
    { label: 'Flats in Hennur Road', href: '/properties?city=Bengaluru&area=Hennur%20Road' },
    { label: 'Flats in Hebbal', href: '/properties?city=Bengaluru&area=Hebbal' },
    { label: 'Flats in Yeshwanthpur', href: '/properties?city=Bengaluru&area=Yeshwanthpur' },
    { label: 'Flats in Rajajinagar', href: '/properties?city=Bengaluru&area=Rajajinagar' },
    { label: 'Flats in Malleshwaram', href: '/properties?city=Bengaluru&area=Malleshwaram' },
    { label: 'Flats in Basavanagudi', href: '/properties?city=Bengaluru&area=Basavanagudi' },
    { label: 'Flats in Jayanagar', href: '/properties?city=Bengaluru&area=Jayanagar' },
    { label: 'Flats in BTM Layout', href: '/properties?city=Bengaluru&area=BTM%20Layout' },
    { label: 'Flats in Banashankari', href: '/properties?city=Bengaluru&area=Banashankari' },
    { label: 'Flats in Vijayanagar', href: '/properties?city=Bengaluru&area=Vijayanagar' },
    { label: 'Flats in RR Nagar', href: '/properties?city=Bengaluru&area=RR%20Nagar' },
    { label: 'Flats in Kengeri', href: '/properties?city=Bengaluru&area=Kengeri' },
    { label: 'Flats in Magadi Road', href: '/properties?city=Bengaluru&area=Magadi%20Road' },
    { label: 'Flats in Peenya', href: '/properties?city=Bengaluru&area=Peenya' },
    { label: 'Flats in Nelamangala', href: '/properties?city=Bengaluru&area=Nelamangala' },
    { label: 'Flats in Domlur', href: '/properties?city=Bengaluru&area=Domlur' },
    { label: 'Flats in Ulsoor', href: '/properties?city=Bengaluru&area=Ulsoor' },
    { label: 'Flats in Frazer Town', href: '/properties?city=Bengaluru&area=Frazer%20Town' },
    { label: 'Flats in Richmond Town', href: '/properties?city=Bengaluru&area=Richmond%20Town' },
    { label: 'Flats in MG Road', href: '/properties?city=Bengaluru&area=MG%20Road' },
    { label: 'Flats in Brigade Road', href: '/properties?city=Bengaluru&area=Brigade%20Road' }
  ];

  // Additional Bengaluru-specific property links
  const bengaluruProperties = [
    { label: '2 BHK Flats in Whitefield', href: '/properties?city=Bengaluru&area=Whitefield&bedrooms=2' },
    { label: '3 BHK Flats in Electronic City', href: '/properties?city=Bengaluru&area=Electronic%20City&bedrooms=3' },
    { label: 'Villas in Sarjapur Road', href: '/properties?city=Bengaluru&area=Sarjapur%20Road&category=villa' },
    { label: 'Houses in Koramangala', href: '/properties?city=Bengaluru&area=Koramangala&category=house' },
    { label: 'Plots in Bannerghatta Road', href: '/properties?city=Bengaluru&area=Bannerghatta%20Road&category=plot' },
    { label: 'Ready to Move Flats', href: '/properties?city=Bengaluru&possessionStatus=ready_to_move' },
    { label: 'Under Construction Flats', href: '/properties?city=Bengaluru&possessionStatus=under_construction' },
    { label: 'Furnished Flats in Bengaluru', href: '/properties?city=Bengaluru&furnishingStatus=furnished' },
    { label: 'Budget Flats under 50L', href: '/properties?city=Bengaluru&maxPrice=5000000' },
    { label: 'Premium Flats above 1Cr', href: '/properties?city=Bengaluru&minPrice=10000000' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="w-32 h-32" footer={true} />
            </div>
            <p className="text-gray-300 text-sm">
              India's most trusted real estate platform. Find your perfect home with our 
              comprehensive property listings and expert guidance.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Cities</h3>
            <ul className="space-y-2">
              {popularCities.map((city) => (
                <li key={city}>
                  <Link
                    href={`/properties?city=${city}`}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    Properties in {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Types</h3>
            <ul className="space-y-2">
              {propertyTypes.map((type) => (
                <li key={type.label}>
                  <Link
                    href={type.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bengaluru Areas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Areas in Bengaluru</h3>
            <ul className="space-y-2">
              {bengaluruAreas.slice(0, 15).map((area) => (
                <li key={area.label}>
                  <Link
                    href={area.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {area.label}
                  </Link>
                </li>
              ))}
            </ul>
            {bengaluruAreas.length > 15 && (
              <div className="mt-3">
                <Link
                  href="/properties?city=Bengaluru"
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  View All Areas →
                </Link>
              </div>
            )}
          </div>

          {/* Bengaluru Properties */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Bengaluru Properties</h3>
            <ul className="space-y-2">
              {bengaluruProperties.map((property) => (
                <li key={property.label}>
                  <Link
                    href={property.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {property.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3">
              <Link
                href="/properties?city=Bengaluru"
                className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
              >
                View All Properties →
              </Link>
            </div>
          </div>

          {/* Quick Links & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 mb-6">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" />
                <span>support@urbanhousein.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+91 90000 00000</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>{getDefaultArea() ? `${getDefaultArea()}, ` : ''}{getDefaultCity()}, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} {APP_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}