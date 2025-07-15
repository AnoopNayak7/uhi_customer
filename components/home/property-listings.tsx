import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Home, TreePine, Briefcase, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

export function PropertyListings() {
  const cities = [
    { name: 'Bangalore', properties: 1234, href: '/properties?city=Bangalore' },
    { name: 'Mumbai', properties: 2567, href: '/properties?city=Mumbai' },
    { name: 'Delhi', properties: 1890, href: '/properties?city=Delhi' },
    { name: 'Chennai', properties: 987, href: '/properties?city=Chennai' },
    { name: 'Hyderabad', properties: 1456, href: '/properties?city=Hyderabad' },
    { name: 'Pune', properties: 876, href: '/properties?city=Pune' }
  ];

  const propertyTypes = [
    {
      icon: Building,
      title: 'Properties in Bangalore',
      subtitle: 'Property for Sale in Bangalore',
      count: '15,000+ Properties',
      description: 'Properties in Mysore Road',
      link: '/properties?city=Bangalore',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    {
      icon: Home,
      title: 'Projects in Bangalore',
      subtitle: 'Flats in Bangalore',
      count: '800+ Projects',
      description: 'Flats in Sarjapur Road',
      link: '/properties?city=Bangalore&category=flat',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    {
      icon: TreePine,
      title: 'Plots in Bangalore',
      subtitle: 'Plots for Sale in Bangalore',
      count: '2,500+ Plots',
      description: 'Plots in Electronic City',
      link: '/properties?city=Bangalore&category=plot',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500'
    },
    {
      icon: Briefcase,
      title: 'Commercial in Bangalore',
      subtitle: 'Commercial Properties',
      count: '500+ Properties',
      description: 'Office Space in Whitefield',
      link: '/properties?city=Bangalore&type=commercial',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    {
      icon: Users,
      title: 'Co-living in Bangalore',
      subtitle: 'PG & Co-living Spaces',
      count: '1,200+ Spaces',
      description: 'PG in Koramangala',
      link: '/properties?city=Bangalore&type=pg_co_living',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-500'
    },
    {
      icon: Building,
      title: 'Builder Floors in Bangalore',
      subtitle: 'Builder Floor for Sale',
      count: '800+ Properties',
      description: 'Builder Floors in Indiranagar',
      link: '/properties?city=Bangalore&category=house',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Property listings across India
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover properties in top cities across India with comprehensive listings
          </p>
        </div>

        {/* Featured Cities */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
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
        </div>

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