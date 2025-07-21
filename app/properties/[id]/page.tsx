"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { apiClient } from '@/lib/api';
import { usePropertyStore } from '@/lib/store';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Bath, 
  Bed, 
  Square, 
  Car, 
  Shield, 
  Dumbbell,
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Home,
  Building
} from 'lucide-react';
import Image from 'next/image';

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToFavourites, removeFromFavourites, favourites, addToViewed } = usePropertyStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    setLoading(true);
    try {
      const response:any = await apiClient.getProperty(id);
      if (response.success && response.data) {
        setProperty(response.data);
        addToViewed(response.data);
      } else {
        // Use mock data if API fails
        const mockPropertyWithId = { ...mockProperty, id };
        setProperty(mockPropertyWithId);
        addToViewed(mockPropertyWithId);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      // Fallback to mock data with the correct ID
      const mockPropertyWithId = { ...mockProperty, id };
      setProperty(mockPropertyWithId);
      addToViewed(mockPropertyWithId);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    if (!property) return;
    
    const isFavorite = favourites.some(p => p.id === property.id);
    if (isFavorite) {
      removeFromFavourites(property.id);
    } else {
      addToFavourites(property);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full mb-6" />
                <Skeleton className="h-32 w-full" />
              </div>
              <div>
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
            <Button onClick={() => router.push('/properties')}>
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorite = favourites.some(p => p.id === property.id);
  const images = property.images || [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&crop=center'
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Image Gallery */}
              <div className="mb-8">
                <div className="relative h-96 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-green-500 text-white border-0">
                      For {property.propertyType === 'sell' ? 'Sale' : 'Rent'}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleFavorite}
                      className={isFavorite ? 'text-red-500' : ''}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Thumbnail Gallery */}
                <div className="flex space-x-2 overflow-x-auto">
                  {images.map((image:any, index:any) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-20 h-16 rounded-md overflow-hidden flex-shrink-0 ${
                        currentImageIndex === index ? 'ring-2 ring-red-500' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Property image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </div>
                  <div className="text-3xl font-bold text-red-500 mb-4">
                    {formatPrice(property.price)}
                  </div>
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Square className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.area}</div>
                    <div className="text-sm text-gray-600">{property.areaUnit}</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Building className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                    <div className="font-semibold">{property.category}</div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                </div>

                <Separator />

                {/* Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">
                    {property.description || 'This beautiful property offers modern living with all the amenities you need. Located in a prime area with excellent connectivity and infrastructure.'}
                  </p>
                </div>

                {/* Features & Amenities */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(property.features || ['Parking', 'Security', 'Gym', 'Garden', 'Swimming Pool', 'Clubhouse']).map((feature:any, index:any) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Property Details */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium">{property.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Construction Status:</span>
                        <span className="font-medium">{property.constructionStatus || 'Ready to Move'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Furnishing:</span>
                        <span className="font-medium">{property.furnishingStatus || 'Semi Furnished'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Area:</span>
                        <span className="font-medium">{property.area} {property.areaUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Possession:</span>
                        <span className="font-medium">{property.possessionDate || 'Immediate'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Facing:</span>
                        <span className="font-medium">East</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Contact Agent</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Home className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">Property Agent</div>
                        <div className="text-sm text-gray-600">UrbanHouseIN</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Button className="w-full bg-red-500 hover:bg-red-600">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* EMI Calculator */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">EMI Calculator</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loan Amount
                      </label>
                      <div className="text-lg font-semibold text-gray-900">
                        {formatPrice(property.price * 0.8)}
                      </div>
                      <div className="text-sm text-gray-600">
                        (80% of property value)
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated EMI
                      </label>
                      <div className="text-xl font-bold text-red-500">
                        ₹{Math.round((property.price * 0.8 * 0.009) / 1000)}K/month
                      </div>
                      <div className="text-sm text-gray-600">
                        @ 9% for 20 years
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      <Calendar className="w-4 h-4 mr-2" />
                      Calculate EMI
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Properties */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Similar Properties</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex space-x-3">
                        <div className="w-16 h-12 bg-gray-200 rounded-md flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Similar Property {item}</div>
                          <div className="text-xs text-gray-600">2 BHK • 1200 sqft</div>
                          <div className="text-sm font-semibold text-red-500">₹85L</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Mock property data
const mockProperty = {
  id: '1',
  title: 'Luxury 3BHK Apartment in Whitefield',
  description: 'This stunning 3BHK apartment in Whitefield offers modern living with premium amenities. Located in a prime area with excellent connectivity to IT hubs and shopping centers.',
  price: 11600000,
  address: 'Electronic City Phase II',
  city: 'Bangalore',
  state: 'Karnataka',
  bedrooms: 3,
  bathrooms: 2,
  area: 1067,
  areaUnit: 'sqft',
  category: 'Apartment',
  propertyType: 'sell',
  constructionStatus: 'Ready to Move',
  furnishingStatus: 'Semi Furnished',
  possessionDate: 'Immediate',
  features: ['Parking', 'Security', 'Gym', 'Garden', 'Swimming Pool', 'Clubhouse', 'Power Backup', 'Lift'],
  images: [
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&crop=center'
  ]
};