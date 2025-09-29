"use client";

import {
  useState,
  useEffect,
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
} from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { apiClient } from "@/lib/api";
import { usePropertyStore } from "@/lib/store";
import { trackPropertyView, trackUserInteraction } from "@/components/analytics/GoogleAnalytics";
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
  ChevronLeft,
  ChevronRight,
  Star,
  Maximize2,
  CheckCircle,
  Calculator,
  MessageCircle,
  Trees,
  Waves,
  Users,
  Wifi,
  BarChart3,
} from "lucide-react";
import Image from "next/image";

interface PropertyDetailClientProps {
  params: { id: string };
}

export default function PropertyDetailClient({
  params,
}: PropertyDetailClientProps) {
  const router = useRouter();
  const {
    addToFavourites,
    removeFromFavourites,
    favourites,
    addToViewed,
    addToCompare,
    removeFromCompare,
    compareList,
  } = usePropertyStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id);
    }
  }, [params.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProperty = async (id: string) => {
    setLoading(true);
    try {
      const response: any = await apiClient.getProperty(id);
      const propertyData = response.data || mockProperty;
      setProperty(propertyData);
      addToViewed(propertyData);
      
      // Track property view
      trackPropertyView(propertyData.id, propertyData.title);
    } catch (error) {
      console.error("Error fetching property:", error);
      setProperty(mockProperty);
      addToViewed(mockProperty);
      
      // Track property view even for mock data
      trackPropertyView(mockProperty.id, mockProperty.title);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = () => {
    if (!property) return;

    const isFavorite = favourites.some((p) => p.id === property.id);
    if (isFavorite) {
      removeFromFavourites(property.id);
      trackUserInteraction("remove_favorite", "property");
    } else {
      addToFavourites(property);
      trackUserInteraction("add_favorite", "property");
    }
  };

  const handleCompare = () => {
    if (!property) return;

    const isInCompare = compareList.some((p) => p.id === property.id);
    if (isInCompare) {
      removeFromCompare(property.id);
      trackUserInteraction("remove_compare", "property");
    } else {
      if (compareList.length >= 3) {
        alert("You can compare maximum 3 properties");
        return;
      }
      addToCompare(property);
      trackUserInteraction("add_compare", "property");
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

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + property.images.length) % property.images.length
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="h-96 bg-gray-200 rounded-2xl mb-6"></div>
                  <div className="h-32 bg-gray-200 rounded-2xl"></div>
                </div>
                <div>
                  <div className="h-64 bg-gray-200 rounded-2xl"></div>
                </div>
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
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center bg-white rounded-2xl p-12 shadow-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Home className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Property Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The property you&apos;re looking for doesn&apos;t exist or has
              been removed.
            </p>
            <Button
              onClick={() => router.push("/properties")}
              className="bg-primary hover:bg-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorite = favourites.some((p) => p.id === property.id);
  const images = property.images || [
    "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1616137148922-d8e78b6bb4c0?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&crop=center",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Enhanced Image Gallery */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="relative h-[500px] rounded-2xl overflow-hidden group mb-6">
                  <Image
                    src={
                      images[currentImageIndex] ||
                      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt={property.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Property Status Badge */}
                  <div className="absolute top-6 left-6">
                    <Badge className="bg-emerald-500/90 backdrop-blur-md text-white border-0 px-4 py-2 text-sm font-medium">
                      For {property.propertyType === "sell" ? "Sale" : "Rent"}
                    </Badge>
                  </div>

                  {/* Image Counter */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-6 right-6 flex space-x-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCompare}
                      className={`backdrop-blur-md transition-all duration-300 ${
                        compareList.some((p) => p.id === property.id)
                          ? "bg-blue-500/90 text-white hover:bg-blue-600/90"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <BarChart3
                        className={`w-4 h-4 ${
                          compareList.some((p) => p.id === property.id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleFavorite}
                      className={`backdrop-blur-md transition-all duration-300 ${
                        isFavorite
                          ? "bg-red-500/90 text-white hover:bg-red-600/90"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite ? "fill-current" : ""
                        }`}
                      />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/20 backdrop-blur-md text-white rounded-full hover:bg-black/40 transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>

                  <button className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md text-gray-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-white transition-all duration-300 flex items-center gap-2">
                    <Maximize2 className="w-4 h-4" />
                    View all photos
                  </button>
                </div>

                {/* Enhanced Thumbnail Gallery */}
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {images.map((image: any, index: any) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
                        currentImageIndex === index
                          ? "ring-2 ring-red-600 ring-offset-2"
                          : "hover:opacity-80 hover:scale-105"
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

              {/* Enhanced Property Details */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">4.8</span>
                  <span className="text-gray-500">(47 reviews)</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {property.title}
                </h1>

                <div className="text-sm flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {property.address}, {property.city}, {property.state}
                  </span>
                </div>

                <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent mb-6">
                  {formatPrice(property.price)}
                </div>

                {/* Enhanced Key Features */}
                <div className={`grid gap-4 ${property.category?.toLowerCase() === 'plot' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
                  {property.category?.toLowerCase() !== 'plot' && (
                    <>
                      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                        <Bed className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                        <div className="text-2xl font-bold text-gray-900">
                          {property.bedrooms}
                        </div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                      <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
                        <Bath className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                        <div className="text-2xl font-bold text-gray-900">
                          {property.bathrooms}
                        </div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                    </>
                  )}
                  <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-300">
                    <Square className="w-8 h-8 mx-auto mb-3 text-emerald-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.area}
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.areaUnit}
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-300">
                    <Building className="w-8 h-8 mx-auto mb-3 text-orange-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {property.category}
                    </div>
                    <div className="text-sm text-gray-600">Type</div>
                  </div>
                </div>
              </div>

              {/* Enhanced Description */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  About this property
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {property.description ||
                    "This beautiful property offers modern living with all the amenities you need. Located in a prime area with excellent connectivity and infrastructure."}
                </p>
              </div>

              {/* Enhanced Features & Amenities */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(
                    property.features || [
                      "Parking",
                      "Security",
                      "Gym",
                      "Garden",
                      "Swimming Pool",
                      "Clubhouse",
                    ]
                  ).map(
                    (
                      feature:
                        | string
                        | number
                        | boolean
                        | ReactElement<any, string | JSXElementConstructor<any>>
                        | Iterable<ReactNode>
                        | ReactPortal
                        | PromiseLikeOfReactNode
                        | null
                        | undefined,
                      index: Key | null | undefined
                    ) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-gray-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Enhanced Property Details */}
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Property Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium text-gray-900">
                        {property.category}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">
                        Construction Status:
                      </span>
                      <span className="font-medium text-gray-900">
                        {property.constructionStatus || "Ready to Move"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Furnishing:</span>
                      <span className="font-medium text-gray-900">
                        {property.furnishingStatus || "Semi Furnished"}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Total Area:</span>
                      <span className="font-medium text-gray-900">
                        {property.area} {property.areaUnit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Possession:</span>
                      <span className="font-medium text-gray-900">
                        {property.possessionDate || "Immediate"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-gray-600">Facing:</span>
                      <span className="font-medium text-gray-900">East</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-6">
              {/* Enhanced Contact Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-7">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Contact Agent
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                        <Home className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-base font-bold text-gray-900">
                          Property Agent
                        </div>
                        <div className="text-gray-600 text-sm">
                          Urbanhousein
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">4.9</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-700 hover:to-red-700 py-3 text-sm font-medium">
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now
                      </Button>
                      {/* <Button variant="outline" className="w-full py-3 text-sm font-medium border-2 hover:bg-gray-50">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Send Message
                      </Button> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced EMI Calculator */}
              {/* <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">EMI Calculator</h3>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount
                      </label>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatPrice(property.price * 0.8)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        (80% of property value)
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Monthly EMI
                      </label>
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ₹{Math.round((property.price * 0.8 * 0.009) / 1000)}K
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        @ 9% for 20 years
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full py-3 text-base font-medium border-2 hover:bg-gray-50">
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate EMI
                    </Button>
                  </div>
                </CardContent>
              </Card> */}

              {/* Enhanced Similar Properties */}
              {/* <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Similar Properties</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                        <div className="w-20 h-16 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/photo-${1560518883 + item}-ce09059eeffa?w=200&h=150&fit=crop`}
                            alt={`Similar property ${item}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">Similar Property {item}</div>
                          <div className="text-sm text-gray-600 mb-2">2 BHK • 1200 sqft</div>
                          <div className="text-lg font-bold text-blue-600">₹85L</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const mockProperty = {
  id: "1",
  title: "Luxury 3BHK Apartment in Whitefield",
  description:
    "This stunning 3BHK apartment in Whitefield offers modern living with premium amenities. Located in a prime area with excellent connectivity to IT hubs and shopping centers.",
  price: 11600000,
  address: "Electronic City Phase II",
  city: "Bangalore",
  state: "Karnataka",
  bedrooms: 3,
  bathrooms: 2,
  area: 1067,
  areaUnit: "sqft",
  category: "Apartment",
  propertyType: "sell",
  constructionStatus: "Ready to Move",
  furnishingStatus: "Semi Furnished",
  possessionDate: "Immediate",
  features: [
    "Parking",
    "Security",
    "Gym",
    "Garden",
    "Swimming Pool",
    "Clubhouse",
    "Power Backup",
    "Lift",
  ],
  images: [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1616137148922-d8e78b6bb4c0?w=1200&h=800&fit=crop&crop=center",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop&crop=center",
  ],
};
