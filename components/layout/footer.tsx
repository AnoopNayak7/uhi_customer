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
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Blog', href: '/blog' },
    { label: 'Help Center', href: '/help' }
  ];

  const propertyTypes = [
    { label: `Apartments for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=apartment&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Houses for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=house&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Villas for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=villa&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Apartments for Rent in ${getDefaultCity()}`, href: `/properties?type=rent&category=apartment&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Commercial Properties in ${getDefaultCity()}`, href: `/properties?type=commercial&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` },
    { label: `Plots for Sale in ${getDefaultCity()}`, href: `/properties?type=sell&category=plot&city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}` }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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