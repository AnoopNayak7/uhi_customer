"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
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
  Building,
  Info,
  Clock,
  ChevronRight,
  ImageIcon,
  Wifi,
  Trees,
  Waves,
  Users,
  Zap,
  ShieldCheck,
  Camera,
  PlayCircle,
  Maximize2
} from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import TimeTravel from '@/components/TimeTravel';

// Dynamically import the Map and NearbyPlaces components to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const NearbyPlaces = dynamic(() => import('@/components/NearbyPlaces'), { ssr: false });

// Amenity icons mapping
const amenityIcons: { [key: string]: any } = {
  'Parking': Car,
  'Security': Shield,
  'Gym': Dumbbell,
  'Garden': Trees,
  'Swimming Pool': Waves,
  'Clubhouse': Users,
  'Power Backup': Zap,
  'Lift': Building,
  'WiFi': Wifi,
  'CCTV': ShieldCheck
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToFavourites, removeFromFavourites, favourites, addToViewed } = usePropertyStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReraDialog, setShowReraDialog] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id]);

  const fetchProperty = async (id: string) => {
    setLoading(true);
    try {
      const response: any = await apiClient.getProperty(id);
      if (response.success && response.data) {
        setProperty(response.data);
        addToViewed(response.data);
      } else {
        const mockPropertyWithId = { ...mockProperty, id };
        setProperty(mockPropertyWithId);
        addToViewed(mockPropertyWithId);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    const tabsElement = tabsRef.current;

    if (element && tabsElement) {
      const tabsHeight = tabsElement.offsetHeight;
      const headerHeight = 80; // Approximate header height
      const offset = headerHeight + tabsHeight + 20; // Add some padding

      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
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
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          {/* Back Button */}
          {/* <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button> */}

          {/* Image Gallery Section - New Layout */}
          <div className="mb-8 bg-white rounded-2xl overflow-hidden shadow-sm">
            <div className="relative">
              {/* Main Image Grid - 3 Images Layout */}
              <div className="grid grid-cols-3 gap-2 h-[400px]">
                {/* Large Main Image - Takes 2 columns */}
                <div className="col-span-2 relative group cursor-pointer" onClick={() => setCurrentImageIndex(0)}>
                  <div className="w-full h-full bg-gray-200 rounded-l-xl flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Property Image 1</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-l-xl" />
                </div>

                {/* Right Side - 2 Images Stacked */}
                <div className="flex flex-col gap-2">
                  {/* Top Right Image */}
                  <div className="relative group cursor-pointer flex-1" onClick={() => setCurrentImageIndex(1)}>
                    <div className="w-full h-full bg-gray-200 rounded-tr-xl flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                        <p className="text-gray-500 text-xs">Property Image 2</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-tr-xl" />
                  </div>

                  {/* Bottom Right Image with Overlay */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative group cursor-pointer flex-1">
                        <div className="w-full h-full bg-gray-200 rounded-br-xl flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                            <p className="text-gray-500 text-xs">Property Image 3</p>
                          </div>
                        </div>
                        {/* Show All Photos Overlay */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-br-xl">
                          <div className="text-white text-center">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <div className="text-sm font-semibold">Show all photos</div>
                            <div className="text-xs opacity-90">{images.length} images</div>
                          </div>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh]">
                      <div className="p-2">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-xl font-semibold">{property.title}</h2>
                          <div className="text-sm text-gray-500">{images.length} photos</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                          {images.map((image: any, index: any) => (
                            <div key={index} className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <div className="text-center">
                                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                  <p className="text-gray-500 text-sm">Property Image {index + 1}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4 mr-2" />
                      Show all photos
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="p-1">
                      <h2 className="text-xl font-semibold mb-4">{property.title}</h2>
                      <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                        {images.map((image: any, index: any) => (
                          <div key={index} className="relative h-48 w-full rounded-md overflow-hidden bg-gray-200">
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                <p className="text-gray-500 text-sm">Image {index + 1}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShare}
                  className="bg-white/90 backdrop-blur-sm"
                >
                  <Share2 className="w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleFavorite}
                  className={`bg-white/90 backdrop-blur-sm ${isFavorite ? 'text-red-500' : ''}`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
                </Button>
              </div>

              {/* Property Status Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-green-500 text-white border-0 px-3 py-1">
                  For {property.propertyType === 'sell' ? 'Sale' : 'Rent'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Header */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h1 className="text-xl font-bold text-gray-900 mb-3">
                  {property.title}
                </h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
                </div>
                <div className="text-2xl font-bold text-red-500 mb-6">
                  {formatPrice(property.price)}
                </div>

                {/* Key Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <Bed className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <div className="text-lg font-bold text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <Bath className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <div className="text-lg font-bold text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathrooms</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <Square className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <div className="text-lg font-bold text-gray-900">{property.area}</div>
                    <div className="text-sm text-gray-600">Sq. Ft.</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <Car className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                    <div className="text-lg font-bold text-gray-900">{property.parking || 1}</div>
                    <div className="text-sm text-gray-600">Parking</div>
                  </div>
                </div>
              </div>

              {/* RERA Status */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <span className="font-semibold text-gray-900">RERA Registered</span>
                      <p className="text-sm text-gray-600">Government approved project</p>
                    </div>
                  </div>
                  <Dialog open={showReraDialog} onOpenChange={setShowReraDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="p-1">
                        <h3 className="text-lg font-semibold mb-4">RERA Details</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-gray-600">RERA Number:</div>
                            <div className="text-sm font-medium">{property.reraNumber || 'PRM/KA/RERA/1251/446/2020'}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-gray-600">Status:</div>
                            <div className="text-sm font-medium text-green-600">{property.reraStatus || 'Approved'}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-sm text-gray-600">Validity:</div>
                            <div className="text-sm font-medium">31 Dec, 2025</div>
                          </div>
                          <div className="mt-4 text-xs text-gray-500">
                            RERA registration ensures that this property complies with all regulatory requirements and provides buyer protection under the Real Estate (Regulation and Development) Act.
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Sticky Tabs Navigation */}
              <div
                ref={tabsRef}
                className="sticky top-20 z-40 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6"
              >
                <div className="px-6 py-4">
                  <div className="flex space-x-8">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'amenities', label: 'Amenities' },
                      { id: 'details', label: 'Details' },
                      { id: 'location', label: 'Location' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-8">
                {/* Overview Section */}
                <section id="overview" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Overview</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </section>

                {/* Amenities Section */}
                <section id="amenities" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Amenities & Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(property.features || ['Parking', 'Security', 'Gym', 'Garden', 'Swimming Pool', 'Clubhouse', 'Power Backup', 'Lift']).map((feature: any, index: any) => {
                      const IconComponent = amenityIcons[feature] || Building;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-gray-800 font-medium text-sm">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Details Section */}
                <section id="details" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Property Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Property Type:</span>
                        <span className="font-medium text-gray-900">{property.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Year Built:</span>
                        <span className="font-medium text-gray-900">{property.yearBuilt || '2022'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">RERA Status:</span>
                        <span className="font-medium text-green-600">{property.reraStatus || 'Approved'}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Furnishing:</span>
                        <span className="font-medium text-gray-900">{property.furnishingStatus || 'Semi-Furnished'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Possession:</span>
                        <span className="font-medium text-gray-900">{property.possessionDate || 'Ready to Move'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Developer:</span>
                        <span className="font-medium text-gray-900">{property.developer || 'Prestige Group'}</span>
                      </div>
                    </div>
                  </div>
                </section>


                <section id="location" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">Location</h2>

                  {/* Address Information */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{property.address}</p>
                        <p className="text-sm text-gray-600">{property.city}, {property.state}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Building className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Nearby</p>
                        <p className="text-sm text-gray-600">Schools, Hospitals, Shopping Malls, Parks, Public Transport</p>
                      </div>
                    </div>
                  </div>

                  <NearbyPlaces
                  // @ts-ignore
                    center={[12.9716, 77.6412]}
                    locationName="Your Location Name"
                    radius={2}
                  />
                </section>

                {/* Time Travel Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <TimeTravel />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">Contact Agent</h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Property Agent</div>
                        <div className="text-sm text-gray-600">UrbanHouseIN</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-medium">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      <Button variant="outline" className="w-full py-3 rounded-xl font-medium border-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* EMI Calculator */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">EMI Calculator</h3>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Loan Amount</span>
                        <span className="text-lg font-bold text-gray-900">₹1,20,00,000</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-red-500 to-red-600 rounded-full w-3/4"></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Interest Rate</div>
                        <div className="text-lg font-bold text-gray-900">8.5%</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-sm text-gray-600 mb-1">Tenure</div>
                        <div className="text-lg font-bold text-gray-900">20 Years</div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200">
                      <div className="text-sm text-red-700 mb-1 font-medium">Monthly EMI</div>
                      <div className="text-2xl font-bold text-red-600">₹1,04,296</div>
                    </div>

                    <Button variant="outline" className="w-full py-3 rounded-xl font-medium border-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      Calculate EMI
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Properties */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">Similar Properties</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex space-x-4 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors cursor-pointer">
                        <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">Image</p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 text-sm mb-1">Similar Property {item}</div>
                          <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Bed className="w-3 h-3 mr-1" />
                              2 BHK
                            </span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Square className="w-3 h-3 mr-1" />
                              1200 sqft
                            </span>
                          </div>
                          <div className="text-sm font-bold text-red-500">₹85L</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 self-center" />
                      </div>
                    ))}

                    <Button variant="outline" className="w-full mt-4 py-2 rounded-xl font-medium border-gray-300">
                      View More Properties
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-gray-900">Property Insights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Listed
                      </span>
                      <span className="text-sm font-medium text-gray-900">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Views
                      </span>
                      <span className="text-sm font-medium text-gray-900">1,234</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600 flex items-center">
                        <Heart className="w-4 h-4 mr-2" />
                        Interested
                      </span>
                      <span className="text-sm font-medium text-gray-900">89 people</span>
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Verified Property</span>
                      </div>
                      <p className="text-xs text-green-700">
                        This property has been verified by our team and meets all quality standards.
                      </p>
                    </div>
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
  description: 'This stunning 3BHK apartment in Whitefield offers modern living with premium amenities. Located in a prime area with excellent connectivity to IT hubs and shopping centers. The property features spacious rooms, modern fittings, and access to world-class amenities including swimming pool, gym, and landscaped gardens. Perfect for families looking for a comfortable and luxurious lifestyle in one of Bangalore\'s most sought-after locations.',
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
  features: ['Parking', 'Security', 'Gym', 'Garden', 'Swimming Pool', 'Clubhouse', 'Power Backup', 'Lift', 'WiFi', 'CCTV'],
  location: [12.9716, 77.5946],
  images: [
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600',
    '/api/placeholder/800/600'
  ]
};