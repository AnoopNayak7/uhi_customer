import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Phone, Mail } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-red-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <Badge className="bg-red-100 text-red-600 border-red-200 mb-4">
              Over 1 million+ homes for sale available on the website
            </Badge>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Let's Find a Home
              <span className="text-red-500 block">That's Perfect</span>
              <span className="block">Place For You!</span>
            </h2>
            
            <p className="text-gray-600 text-lg mb-8">
              Find houses for sale and for rent near you. Search by price, bedrooms, 
              bathrooms, property type, and more to find your ideal home.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-red-500 hover:bg-red-600" asChild>
                <Link href="/properties">
                  Search Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Us: +91 90000 00000
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">300+</div>
                <div className="text-sm text-gray-600">Satisfied Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">100+</div>
                <div className="text-sm text-gray-600">Property Options</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">10K+</div>
                <div className="text-sm text-gray-600">Trusted by Company</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Image */}
          <div className="relative">
            <Card className="overflow-hidden bg-white shadow-2xl">
              <div className="relative h-96">
                <Image
                  src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"
                  alt="Beautiful luxury home"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                
                {/* Floating Property Card */}
                <div className="absolute bottom-6 left-6 right-6">
                  <Card className="bg-white/95 backdrop-blur-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">Aesthetic Luxury Home</h3>
                      <Badge className="bg-green-100 text-green-600 border-green-200">
                        Available
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Modern design luxury in line stunning property
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-500">₹2.5 Cr</span>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}