"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Home, TreePine, Briefcase, Users, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useLocationData } from '@/hooks/use-location-data';

export function PropertyListings() {
  const { getDefaultCity, getDefaultArea } = useLocationData();
  
  const cities = [
    { name: 'Bengaluru', properties: 1234, href: '/properties?city=Bengaluru' },
    { name: 'Mumbai', properties: 2567, href: '/properties?city=Mumbai' },
    { name: 'Delhi', properties: 1890, href: '/properties?city=Delhi' },
    { name: 'Chennai', properties: 987, href: '/properties?city=Chennai' },
    { name: 'Hyderabad', properties: 1456, href: '/properties?city=Hyderabad' },
    { name: 'Pune', properties: 876, href: '/properties?city=Pune' }
  ];

  const propertyTypes = [
    {
      icon: Building,
      title: `Properties in ${getDefaultCity()}`,
      subtitle: `Property for Sale in ${getDefaultCity()}`,
      count: '15,000+ Properties',
      description: getDefaultArea() ? `Properties in ${getDefaultArea()}` : `Properties in ${getDefaultCity()}`,
      link: `/properties?city=${getDefaultCity()}${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}`,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      icon: Home,
      title: `Projects in ${getDefaultCity()}`,
      subtitle: `Flats in ${getDefaultCity()}`,
      count: '800+ Projects',
      description: getDefaultArea() ? `Flats in ${getDefaultArea()}` : `Flats in ${getDefaultCity()}`,
      link: `/properties?city=${getDefaultCity()}&category=apartment${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}`,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      icon: TreePine,
      title: `Plots in ${getDefaultCity()}`,
      subtitle: `Plots for Sale in ${getDefaultCity()}`,
      count: '2,500+ Plots',
      description: getDefaultArea() ? `Plots in ${getDefaultArea()}` : `Plots in ${getDefaultCity()}`,
      link: `/properties?city=${getDefaultCity()}&category=plot${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}`,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      icon: Briefcase,
      title: `Commercial in ${getDefaultCity()}`,
      subtitle: 'Commercial Properties',
      count: '500+ Properties',
      description: getDefaultArea() ? `Office Space in ${getDefaultArea()}` : `Office Space in ${getDefaultCity()}`,
      link: `/properties?city=${getDefaultCity()}&type=commercial${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}`,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      icon: Building,
      title: `Builder Floors in ${getDefaultCity()}`,
      subtitle: 'Builder Floor for Sale',
      count: '800+ Properties',
      description: getDefaultArea() ? `Builder Floors in ${getDefaultArea()}` : `Builder Floors in ${getDefaultCity()}`,
      link: `/properties?city=${getDefaultCity()}&category=house${getDefaultArea() ? `&area=${getDefaultArea()}` : ''}`,
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getDefaultCity() === 'Bengaluru' 
              ? 'Property listings in Bengaluru' 
              : `Property listings in ${getDefaultCity()}`
            }
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getDefaultCity() === 'Bengaluru' 
              ? 'Currently launching in Bengaluru with comprehensive property listings. More cities coming soon!'
              : `Discover properties in ${getDefaultCity()} with our comprehensive listings`
            }
          </p>
        </div>

        {/* Featured Cities */}
        {/* <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {cities.map((city) => (
            <Link key={city.name} href={city.href}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <MapPin className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">{city.name}</h3>
                  <p className="text-sm text-gray-600">{city.properties} Properties</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div> */}

        {/* Property Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propertyTypes.map((type) => (
            <Card key={type.title} className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden">
              <CardContent className="p-6">
                <div className={`w-12 h-12 ${type.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <type.icon className={`w-6 h-6 ${type.iconColor}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {type.title}
                </h3>
                
                <p className="text-gray-600 mb-3">
                  {type.subtitle}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-red-500">
                    {type.count}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4">
                  {type.description}
                </p>
                
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={type.link}>
                    View Properties
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}