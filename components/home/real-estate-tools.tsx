import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calculator, MapPin, BookOpen } from 'lucide-react';
import Link from 'next/link';

export function RealEstateTools() {
  const tools = [
    {
      icon: TrendingUp,
      title: 'Price Trends',
      description: 'Track property prices & market analysis',
      href: '/tools/price-trends',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Calculator,
      title: 'Property Value',
      description: 'Calculate estimated property worth',
      href: '/tools/property-value',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: MapPin,
      title: 'Area Insights',
      description: 'Explore neighbourhood statistics',
      href: '/tools/area-insights',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: BookOpen,
      title: 'Investment Guide',
      description: 'Smart investment recommendations',
      href: '/tools/investment-guide',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Estate Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful tools and insights to help you make informed property decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card key={tool.title} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${tool.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className={`w-8 h-8 ${tool.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {tool.description}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={tool.href}>
                    Explore Tool
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Customer Support Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  For Customers
                </h3>
                <p className="text-gray-600 mb-6">
                  Get expert guidance from our property consultants and find your perfect home
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="bg-red-500 hover:bg-red-600">
                    Speak to Consultant
                  </Button>
                  <Button variant="outline">
                    Request Callback
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  For Business
                </h3>
                <p className="text-gray-600 mb-6">
                  Partner with us to showcase your properties to millions of potential buyers
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline">
                    List Your Property
                  </Button>
                  <Button variant="outline">
                    Become Partner
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}