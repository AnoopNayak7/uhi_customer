import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Home, TreePine, Briefcase, Users, MapPin, TrendingUp, Star } from 'lucide-react';
import Link from 'next/link';

export function PropertyListings() {
  // Static data for better SEO and page source rendering
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
      title: 'Properties in Bengaluru',
      subtitle: 'Property for Sale in Bengaluru',
      count: '15,000+ Properties',
      description: 'Discover premium properties across Bengaluru including apartments, houses, villas, and more. Find your dream home in the most sought-after locations.',
      seoDescription: 'Buy properties in Bengaluru - Find apartments, houses, villas for sale in Whitefield, Electronic City, Sarjapur Road, Koramangala, Indiranagar and more areas.',
      link: '/properties?city=Bengaluru',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'text-blue-600',
      features: ['Verified Properties', 'Best Deals', 'Location Insights']
    },
    {
      icon: Home,
      title: 'Flats in Bengaluru',
      subtitle: 'Apartments & Flats for Sale',
      count: '800+ Projects',
      description: 'Explore modern apartments and flats in Bengaluru\'s top residential areas. From 1BHK to luxury penthouses, find your perfect living space.',
      seoDescription: 'Buy flats in Bengaluru - 1BHK, 2BHK, 3BHK apartments for sale in premium projects. Ready to move and under construction properties available.',
      link: '/properties?city=Bengaluru&category=apartment',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'text-green-600',
      features: ['Ready to Move', 'Under Construction', 'Premium Projects']
    },
    {
      icon: TreePine,
      title: 'Plots in Bengaluru',
      subtitle: 'Residential Plots for Sale',
      count: '2,500+ Plots',
      description: 'Invest in residential plots across Bengaluru\'s developing areas. Build your dream home from scratch with our verified plot listings.',
      seoDescription: 'Buy residential plots in Bengaluru - Investment plots, ready to build land, and agricultural land for sale in emerging localities.',
      link: '/properties?city=Bengaluru&category=plot',
      bgColor: 'bg-gradient-to-br from-orange-50 to-orange-100',
      iconColor: 'text-orange-600',
      features: ['Investment Ready', 'Clear Title', 'Development Potential']
    },
    {
      icon: Briefcase,
      title: 'Commercial Properties',
      subtitle: 'Office Space & Retail',
      count: '500+ Properties',
      description: 'Find commercial properties including office spaces, retail shops, and warehouses in Bengaluru\'s prime business districts.',
      seoDescription: 'Buy commercial properties in Bengaluru - Office spaces, retail shops, warehouses, and industrial properties for business investment.',
      link: '/properties?city=Bengaluru&type=commercial',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconColor: 'text-purple-600',
      features: ['Prime Location', 'High ROI', 'Business Ready']
    }
    // Builder Floors commented out as requested
    // {
    //   icon: Building,
    //   title: 'Builder Floors in Bengaluru',
    //   subtitle: 'Builder Floor for Sale',
    //   count: '800+ Properties',
    //   description: 'Exclusive builder floor properties in prime Bengaluru locations. Perfect for those seeking spacious living with modern amenities.',
    //   link: '/properties?city=Bengaluru&category=house',
    //   bgColor: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    //   iconColor: 'text-indigo-600',
    //   features: ['Spacious Layout', 'Prime Location', 'Modern Design']
    // }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Property Listings in Bengaluru
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Currently launching in Bengaluru with comprehensive property listings. More cities coming soon!
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

        {/* Property Types Grid - 4 cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {propertyTypes.map((type) => (
            <Card key={type.title} className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6 h-full flex flex-col">
                {/* Icon and Header */}
                <div className={`w-16 h-16 ${type.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <type.icon className={`w-8 h-8 ${type.iconColor}`} />
                </div>
                
                {/* Title and Subtitle */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                  {type.title}
                </h3>
                
                <p className="text-gray-600 mb-4 font-medium">
                  {type.subtitle}
                </p>
                
                {/* Property Count Badge */}
                {/* <div className="flex items-center mb-4">
                  <TrendingUp className="w-4 h-4 text-red-500 mr-2" />
                  <span className="text-sm font-semibold text-red-600">
                    {type.count}
                  </span>
                </div> */}
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">
                  {type.description}
                </p>
                
                {/* Features List */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {type.features.map((feature, index) => (
                      <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* CTA Button */}
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105" 
                  asChild
                >
                  <Link href={type.link} className="flex items-center justify-center">
                    <span>View Properties</span>
                    <TrendingUp className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* SEO Content Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Find Your Dream Property in Bengaluru
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Popular Areas in Bengaluru</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Whitefield:</strong> IT hub with premium apartments and villas</li>
                  <li>• <strong>Electronic City:</strong> Affordable housing near tech parks</li>
                  <li>• <strong>Sarjapur Road:</strong> Growing residential corridor with modern projects</li>
                  <li>• <strong>Koramangala:</strong> Central location with established infrastructure</li>
                  <li>• <strong>Indiranagar:</strong> Upscale neighborhood with luxury properties</li>
                  <li>• <strong>HSR Layout:</strong> Planned residential area with good connectivity</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Property Investment Guide</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• <strong>Ready to Move:</strong> Immediate possession properties</li>
                  <li>• <strong>Under Construction:</strong> Pre-launch and early bird offers</li>
                  <li>• <strong>Resale Properties:</strong> Established neighborhoods</li>
                  <li>• <strong>New Projects:</strong> Latest amenities and modern designs</li>
                  <li>• <strong>Investment Properties:</strong> High rental yield areas</li>
                  <li>• <strong>Luxury Properties:</strong> Premium locations and amenities</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Why Choose UrbanHousein for Bengaluru Properties?</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Verified Listings:</strong> All properties are thoroughly verified for authenticity</span>
                </div>
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Expert Guidance:</strong> Professional real estate consultants to help you</span>
                </div>
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span><strong>Best Deals:</strong> Negotiated rates and exclusive offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}