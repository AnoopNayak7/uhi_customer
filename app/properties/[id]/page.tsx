"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
  Maximize2,
  TrendingUp,
  Award,
  Building2,
  Star
} from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PropertyHeader } from '@/components/property/PropertyHeader';
import { PropertyAmenities } from '@/components/property/PropertyAmenities';
import { PropertyDetails } from '@/components/property/PropertyDetails';
import { PropertyLocation } from '@/components/property/PropertyLocation';
import { PriceTrends } from '@/components/property/PriceTrends';
import { FloorPlans } from '@/components/property/FloorPlans';
import { BuilderInfo } from '@/components/property/BuilderInfo';
import { ContactAgent } from '@/components/property/ContactAgent';
import { SimilarProperties } from '@/components/property/SimilarProperties';
import { PropertyInsights } from '@/components/property/PropertyInsights';

// Dynamically import the Map and NearbyPlaces components to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const NearbyPlaces = dynamic(() => import('@/components/NearbyPlaces'), { ssr: false });

const ImageGallery = ({ property, isFavorite, handleShare, handleFavorite }:any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<any>({});

  // Use actual property images or fallback to placeholders
  const propertyImages = property.images && property.images.length > 0 
    ? property.images 
    : [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
      ];

  const handleImageError = (index:any) => {
    setImageErrors((prev: any) => ({ ...prev, [index]: true }));
  };

  const ImageWithFallback = ({ src, alt, index, className, fill = false, ...props }:any) => {
    if (imageErrors[index]) {
      return (
        <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="text-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Property Image {index + 1}</p>
          </div>
        </div>
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        className={className}
        onError={() => handleImageError(index)}
        fill={fill}
        style={{ objectFit: 'cover' }}
        {...props}
      />
    );
  };

  return (
    <div className="mb-6 bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative">
        {/* Main Image Grid */}
        <div className="grid grid-cols-3 gap-2 h-[350px]">
          {/* Large Main Image */}
          <div className="col-span-2 relative group cursor-pointer overflow-hidden rounded-l-lg" onClick={() => setCurrentImageIndex(0)}>
            <ImageWithFallback
              src={propertyImages[0]}
              alt={`${property.title} - Main Image`}
              index={0}
              fill={true}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>

          {/* Right Side Images */}
          <div className="flex flex-col gap-2">
            <div className="relative group cursor-pointer flex-1 overflow-hidden rounded-tr-lg" onClick={() => setCurrentImageIndex(1)}>
              <ImageWithFallback
                src={propertyImages[1] || propertyImages[0]}
                alt={`${property.title} - Image 2`}
                index={1}
                fill={true}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer flex-1 overflow-hidden rounded-br-lg">
                  <ImageWithFallback
                    src={propertyImages[2] || propertyImages[0]}
                    alt={`${property.title} - Image 3`}
                    index={2}
                    fill={true}
                    className="transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-white text-center">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-xs font-medium">Show all photos</div>
                      <div className="text-xs opacity-90">{propertyImages.length} images</div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh]">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{property.title}</h2>
                    <div className="text-sm text-gray-500">{propertyImages.length} photos</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    {propertyImages.map((image: any, index: any) => (
                      <div key={index} className="relative h-48 w-full rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          index={index}
                          fill={true}
                          className="hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="bg-white/90 backdrop-blur-sm text-xs h-8">
                <Maximize2 className="w-3 h-3 mr-1" />
                Show all
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="p-1">
                <h2 className="text-lg font-semibold mb-4">{property.title}</h2>
                <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  {propertyImages.map((image:any, index:any) => (
                    <div key={index} className="relative h-40 w-full rounded-md overflow-hidden">
                      <ImageWithFallback
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        index={index}
                        fill={true}
                        className="hover:scale-105 transition-transform duration-300"
                      />
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
            className="bg-white/90 backdrop-blur-sm h-8 w-8 p-0"
          >
            <Share2 className="w-3 h-3" />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleFavorite}
            className={`bg-white/90 backdrop-blur-sm h-8 w-8 p-0 ${isFavorite ? 'text-red-500' : ''}`}
          >
            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500' : ''}`} />
          </Button>
        </div>

        {/* Property Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-green-500 text-white border-0 px-2 py-1 text-xs">
            For {property.propertyType === 'sell' ? 'Sale' : 'Rent'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

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

// Mock price history data for the graph
const priceHistoryData = [
  { year: '2020', price: 85, growth: 0 },
  { year: '2021', price: 92, growth: 8.2 },
  { year: '2022', price: 98, growth: 6.5 },
  { year: '2023', price: 108, growth: 10.2 },
  { year: '2024', price: 116, growth: 7.4 },
];

// EMI Calculator Component
const EMICalculator = ({ propertyPrice }: { propertyPrice: number }) => {
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.1); // 10% default
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [isExpanded, setIsExpanded] = useState(false);

  const loanAmount = propertyPrice - downPayment;
  const downPaymentPercentage = (downPayment / propertyPrice) * 100;

  // EMI Calculation
  const calculateEMI = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / (12 * 100);
    const numberOfPayments = tenure * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return emi;
  };

  const monthlyEMI = calculateEMI();
  const totalAmount = monthlyEMI * tenure * 12;
  const totalInterest = totalAmount - loanAmount;

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${Math.round(price).toLocaleString()}`;
  };

  const formatEMI = (emi: number) => {
    return `₹${Math.round(emi).toLocaleString()}`;
  };

  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">EMI Calculator</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs p-1"
          >
            {isExpanded ? 'Simple' : 'Advanced'}
          </Button>
        </div>

        <div className="space-y-4">
          {/* Property Price Display */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 mb-1">Property Price</div>
            <div className="text-lg font-bold text-blue-800">{formatPrice(propertyPrice)}</div>
          </div>

          {/* Down Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">Down Payment</span>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900">{formatPrice(downPayment)}</div>
                <div className="text-xs text-gray-600">({downPaymentPercentage.toFixed(0)}%)</div>
              </div>
            </div>
            <input
              type="range"
              min={propertyPrice * 0.05} // Minimum 5%
              max={propertyPrice * 0.5}  // Maximum 50%
              step={propertyPrice * 0.01} // 1% steps
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${downPaymentPercentage * 2}%, #e5e7eb ${downPaymentPercentage * 2}%, #e5e7eb 100%)`
              }}
            />
            {isExpanded && (
              <div className="mt-2">
                <input
                  type="number"
                  value={Math.round(downPayment)}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= propertyPrice * 0.05 && value <= propertyPrice * 0.5) {
                      setDownPayment(value);
                    }
                  }}
                  className="w-full p-2 text-xs border border-gray-300 rounded-md"
                  placeholder="Enter down payment amount"
                />
              </div>
            )}
          </div>

          {/* Loan Amount Display */}
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-700 mb-1">Loan Amount</div>
            <div className="text-lg font-bold text-orange-800">{formatPrice(loanAmount)}</div>
          </div>

          {isExpanded && (
            <>
              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">Interest Rate</span>
                  <span className="text-sm font-bold text-gray-900">{interestRate}% per annum</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="15"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>6%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* Tenure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">Tenure</span>
                  <span className="text-sm font-bold text-gray-900">{tenure} years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 years</span>
                  <span>30 years</span>
                </div>
              </div>
            </>
          )}

          {!isExpanded && (
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Interest Rate</div>
                <div className="text-sm font-bold text-gray-900">{interestRate}%</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Tenure</div>
                <div className="text-sm font-bold text-gray-900">{tenure} Years</div>
              </div>
            </div>
          )}

          {/* EMI Result */}
          <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
            <div className="text-xs text-red-700 mb-1 font-medium">Monthly EMI</div>
            <div className="text-xl font-bold text-red-600">{formatEMI(monthlyEMI)}</div>
          </div>

          {isExpanded && (
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Interest</span>
                <span className="text-sm font-medium text-gray-900">{formatPrice(totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Amount Payable</span>
                <span className="text-sm font-bold text-gray-900">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          )}

          {/* <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="py-2 text-xs font-medium border-gray-300">
              <Calendar className="w-3 h-3 mr-2" />
              Schedule
            </Button>
            <Button className="py-2 text-xs font-medium bg-red-500 hover:bg-red-600">
              Apply Loan
            </Button>
          </div> */}
        </div>

        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}</style>
      </CardContent>
    </Card>
  );
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
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.error('Could not copy text: ', error));
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -100; // Adjust this value based on your header height
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Handle scroll to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'amenities', 'details', 'location', 'price-trends'];
      let currentSection = sections[0];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150) { // Adjust this value based on your header height
            currentSection = section;
          }
        }
      }

      setActiveTab(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-[350px] w-full rounded-xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-5">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
                <Skeleton className="h-60 w-full rounded-xl" />
              </div>
              <div className="space-y-5">
                <Skeleton className="h-80 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
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
            <h1 className="text-xl font-bold text-gray-900 mb-3">Property Not Found</h1>
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
  const Propertyimages = property.images || [
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
          <ImageGallery
            property={property}
            isFavorite={isFavorite}
            handleShare={handleShare}
            handleFavorite={handleFavorite}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <PropertyHeader 
                property={property} 
                formatPrice={formatPrice} 
              />

              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-900 text-sm">RERA Registered</span>
                      <p className="text-xs text-gray-600">Government approved project</p>
                    </div>
                  </div>
                  <Dialog open={showReraDialog} onOpenChange={setShowReraDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs h-8">
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="p-1">
                        <h3 className="text-base font-semibold mb-3">RERA Details</h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs text-gray-600">RERA Number:</div>
                            <div className="text-[10px] font-medium">{property.rera.registrationNumber || 'RERA Not received or not applied'}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs text-gray-600">Status:</div>
                            <div className="text-xs font-medium text-green-600">{property.reraStatus || 'Approved'}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs text-gray-600">Validity:</div>
                            <div className="text-xs font-medium">31 Dec, 2025</div>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            RERA registration ensures that this property complies with all regulatory requirements and provides buyer protection.
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div
                ref={tabsRef}
                className="sticky top-20 z-40 bg-white rounded-xl shadow-sm border border-gray-100 mb-5"
              >
                <div className="px-5 py-3">
                  <div className="flex space-x-6">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'amenities', label: 'Amenities' },
                      { id: 'details', label: 'Details' },
                      { id: 'location', label: 'Location' },
                      { id: 'price-trends', label: 'Price Trends' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`pb-2 px-1 text-xs font-medium border-b-2 transition-colors ${activeTab === tab.id
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
              <div className="space-y-6">
                {/* Overview Section */}
                <section id="overview" className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h2 className="text-base font-semibold mb-3 text-gray-900">Overview</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </section>

                <PropertyAmenities 
                  amenities={property.amenities} 
                />

                <FloorPlans floorPlans={property.floorPlans} />

                <PropertyDetails property={property} />

                <PropertyLocation property={property} />

                <PriceTrends 
                  priceHistoryData={priceHistoryData} 
                  formatPrice={formatPrice} 
                />

                
              </div>
            </div>

            <div className="space-y-5">
              <ContactAgent property={property} />
              <EMICalculator propertyPrice={property.price} />
              <BuilderInfo property={property} />
              <PropertyInsights property={property} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
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