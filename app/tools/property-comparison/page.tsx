"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore, usePropertyStore } from "@/lib/store";
import {
  BarChart3,
  Plus,
  X,
  Crown,
  Lock,
  MapPin,
  Bed,
  Bath,
  Square,
  IndianRupee,
  Calendar,
  Building,
  Star,
  CheckCircle,
  XCircle,
  Search,
  Home,
  ArrowRight,
  TrendingUp,
  Shield,
  Zap,
  Heart,
  Eye,
  GitCompare,
  ChevronLeft,
  ChevronRight,
  Map as MapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import ComparisonMap to avoid SSR issues
const ComparisonMap = dynamic(() => import("@/components/ComparisonMap"), {
  ssr: false,
});

export default function PropertyComparisonPage() {
  const { user } = useAuthStore();
  const { compareList, addToCompare, removeFromCompare, clearCompare } =
    usePropertyStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(
    null
  );
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const mapRef = useRef<any>(null);

  // Handle hydration - wait for store to be ready
  useEffect(() => {
    // Small delay to ensure store is properly hydrated
    const timer = setTimeout(() => {
      setIsHydrated(true);
      // Debug log to check if data is loaded
      console.log(
        "Hydration complete. Compare list length:",
        compareList.length
      );
    }, 100);

    return () => clearTimeout(timer);
  }, [compareList.length]);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchProperties();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]); // eslint-disable-line react-hooks/exhaustive-deps

  const searchProperties = async () => {
    setLoading(true);
    try {
      const response: any = await apiClient.getProperties({
        search: searchTerm,
        limit: 5,
      });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error("Error searching properties:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
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

  const getComparisonScore = (property: any) => {
    // Simple scoring algorithm based on price per sqft, bedrooms, and amenities
    const pricePerSqft = property.price / property.area;
    const amenityScore = (property.features?.length || 0) * 10;
    const bedroomScore = property.bedrooms * 20;
    return Math.min(
      100,
      Math.max(0, 100 - pricePerSqft / 1000 + amenityScore + bedroomScore)
    );
  };

  // Carousel functionality
  const itemsPerPage = 3;
  const totalPages = Math.ceil(compareList.length / itemsPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getVisibleProperties = () => {
    const startIndex = currentSlide * itemsPerPage;
    return compareList.slice(startIndex, startIndex + itemsPerPage);
  };

  // Get map center and markers
  // Geolocation functions
  const requestLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
        toast.success("Location captured successfully!");
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getMapData = () => {
    if (compareList.length === 0) {
      return {
        center: userLocation
          ? ([userLocation.latitude, userLocation.longitude] as [
            number,
            number
          ])
          : ([12.9716, 77.5946] as [number, number]), // Bangalore default
        markers: [],
      };
    }

    // Use user location as center if available, otherwise use first property
    let center: [number, number];
    if (userLocation) {
      center = [userLocation.latitude, userLocation.longitude];
    } else {
      const centerProperty =
        compareList.find((p) => p.latitude && p.longitude) || compareList[0];
      center =
        centerProperty.latitude && centerProperty.longitude
          ? [centerProperty.latitude, centerProperty.longitude]
          : [12.9716, 77.5946];
    }

    const markers = compareList
      .filter((property) => property.latitude && property.longitude)
      .map((property) => {
        const distance = userLocation
          ? calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            property.latitude!,
            property.longitude!
          )
          : null;

        return {
          id: property.id,
          position: [property.latitude, property.longitude] as [number, number],
          popupText: `${property.title} - ${formatPrice(property.price)}${distance ? ` (${distance.toFixed(1)} km away)` : ""
            }`,
        };
      });

    // Add user location marker if available
    if (userLocation) {
      markers.push({
        id: "user-location",
        position: [userLocation.latitude, userLocation.longitude],
        popupText: "Your Location",
      });
    }

    return { center, markers };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          {/* <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <GitCompare className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Property Comparison
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compare properties side by side to make informed decisions. Add up
              to 3 properties to get started.
            </p>
          </motion.div> */}

          

          {/* Location Prompt */}
          {isHydrated && compareList.length > 0 && !userLocation && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Get Distance Insights
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Allow location access to see distances from your
                          current location to each property
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={requestLocation}
                      disabled={locationLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {locationLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Getting Location...
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 mr-2" />
                          Get My Location
                        </>
                      )}
                    </Button>
                  </div>
                  {locationError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{locationError}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Map View */}
          {isHydrated && compareList.length > 0 && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center">
                    <MapIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Property Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-80 w-full relative overflow-hidden rounded-b-lg">
                    <ComparisonMap
                      center={getMapData().center}
                      zoom={12}
                      markers={getMapData().markers}
                      hoveredPropertyId={hoveredPropertyId}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Loading state during hydration */}
          {!isHydrated ? (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-2xl p-12 shadow-lg max-w-2xl mx-auto">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Loading Comparison Data...
                </h2>
                <p className="text-gray-600">
                  Please wait while we restore your property comparisons.
                </p>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Comparison Section */}
              {compareList.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="bg-white rounded-2xl p-12 shadow-lg max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <GitCompare className="w-12 h-12 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      No Properties to Compare
                    </h2>
                    <p className="text-gray-600 mb-8">
                      You haven&apos;t added any properties for comparison yet.
                      Browse our property listings and add properties to compare
                      their features, prices, and amenities side by side.
                    </p>

                    {/* Call to Action */}
                    <div className="mb-8">
                      <Button
                        size="lg"
                        className="bg-red-600 hover:bg-red-700 px-8 py-3 text-lg"
                        asChild
                      >
                        <Link href="/properties">
                          <Home className="w-5 h-5 mr-2" />
                          Browse Properties
                        </Link>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Search className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Search
                          </h3>
                          <p className="text-sm text-gray-600">
                            Find properties by name or location
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Plus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Add</h3>
                          <p className="text-sm text-gray-600">
                            Add up to 3 properties
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Compare
                          </h3>
                          <p className="text-sm text-gray-600">
                            Compare features side by side
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Comparison Header */}
                  <motion.div
                    className="flex items-center justify-between"
                    variants={itemVariants}
                  >
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        Property Comparison ({compareList.length}/3)
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Compare key features and make informed decisions
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={clearCompare}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </motion.div>

                  {/* Property Cards - Mobile Horizontal Scroll */}
                  <div className="block md:hidden">
                    <motion.div
                      className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar"
                      variants={itemVariants}
                    >
                      {compareList.map((property, index) => (
                        <motion.div
                          key={property.id}
                          className="flex-shrink-0 w-80 snap-start"
                          variants={itemVariants}
                          onHoverStart={() => setHoveredPropertyId(property.id)}
                          onHoverEnd={() => setHoveredPropertyId(null)}
                        >
                          <PropertyComparisonCard
                            property={property}
                            index={index}
                            onRemove={() => removeFromCompare(property.id)}
                            score={getComparisonScore(property)}
                            isHovered={hoveredPropertyId === property.id}
                            userLocation={userLocation}
                            distance={
                              userLocation &&
                                property.latitude &&
                                property.longitude
                                ? calculateDistance(
                                  userLocation.latitude,
                                  userLocation.longitude,
                                  property.latitude,
                                  property.longitude
                                )
                                : null
                            }
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Property Cards - Desktop Grid/Carousel */}
                  <div className="hidden md:block">
                    {compareList.length <= 3 ? (
                      // Regular grid for 3 or fewer properties
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={containerVariants}
                      >
                        {compareList.map((property, index) => (
                          <motion.div
                            key={property.id}
                            variants={itemVariants}
                            onHoverStart={() =>
                              setHoveredPropertyId(property.id)
                            }
                            onHoverEnd={() => setHoveredPropertyId(null)}
                          >
                            <PropertyComparisonCard
                              property={property}
                              index={index}
                              onRemove={() => removeFromCompare(property.id)}
                              score={getComparisonScore(property)}
                              isHovered={hoveredPropertyId === property.id}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      // Carousel for more than 3 properties
                      <motion.div variants={itemVariants}>
                        <div className="relative">
                          {/* Carousel Navigation */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-sm text-gray-600">
                              Showing {currentSlide * itemsPerPage + 1}-
                              {Math.min(
                                (currentSlide + 1) * itemsPerPage,
                                compareList.length
                              )}{" "}
                              of {compareList.length} properties
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={prevSlide}
                                disabled={totalPages <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </Button>
                              <div className="flex space-x-1">
                                {Array.from({ length: totalPages }).map(
                                  (_, index) => (
                                    <button
                                      key={index}
                                      onClick={() => setCurrentSlide(index)}
                                      className={`w-2 h-2 rounded-full transition-colors ${currentSlide === index
                                          ? "bg-blue-600"
                                          : "bg-gray-300"
                                        }`}
                                    />
                                  )
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={nextSlide}
                                disabled={totalPages <= 1}
                                className="h-8 w-8 p-0"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Carousel Content */}
                          <motion.div
                            className="grid grid-cols-3 gap-6"
                            key={currentSlide}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {getVisibleProperties().map((property, index) => (
                              <motion.div
                                key={property.id}
                                onHoverStart={() =>
                                  setHoveredPropertyId(property.id)
                                }
                                onHoverEnd={() => setHoveredPropertyId(null)}
                              >
                                <PropertyComparisonCard
                                  property={property}
                                  index={currentSlide * itemsPerPage + index}
                                  onRemove={() =>
                                    removeFromCompare(property.id)
                                  }
                                  score={getComparisonScore(property)}
                                  isHovered={hoveredPropertyId === property.id}
                                />
                              </motion.div>
                            ))}
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Detailed Comparison Table */}
                  <motion.div variants={itemVariants}>
                    <ComparisonTable
                      properties={compareList}
                      userLocation={userLocation}
                      calculateDistance={calculateDistance}
                    />
                  </motion.div>

                  {/* Recommendations */}
                  <motion.div variants={itemVariants}>
                    <RecommendationSection properties={compareList} />
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Property Comparison Card Component
function PropertyComparisonCard({
  property,
  index,
  onRemove,
  score,
  isHovered = false,
  userLocation,
  distance,
}: {
  property: any;
  index: number;
  onRemove: () => void;
  score: number;
  isHovered?: boolean;
  userLocation?: { latitude: number; longitude: number } | null;
  distance?: number | null;
}) {
  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <Card
      className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${isHovered ? "ring-2 ring-blue-500 ring-opacity-50 shadow-2xl" : ""
        }`}
    >
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-3 right-3 h-8 w-8 p-0 text-gray-400 hover:text-red-500 z-10 bg-white/80 backdrop-blur-sm rounded-full"
        onClick={onRemove}
      >
        <X className="w-4 h-4" />
      </Button>

      <div className="relative h-48">
        <Image
          src={
            property.images?.[0] ||
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center"
          }
          alt={property.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge className={`${getScoreColor(score)} border-0 font-semibold`}>
            Score: {Math.round(score)}
          </Badge>
        </div>

        <div className="absolute bottom-3 left-3 right-12">
          <h3 className="text-white font-bold text-lg line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">
              {property.address}, {property.city}
            </span>
          </div>
          {distance && (
            <div className="flex items-center text-white/90 text-xs mt-1">
              <div className="w-3 h-3 mr-1 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white/90 rounded-full"></div>
              </div>
              <span>{distance.toFixed(1)} km from your location</span>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Price */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-gray-500">Starting Price</div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <Bed className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div className="font-semibold text-gray-900">
                {property.bedrooms}
              </div>
              <div className="text-xs text-gray-600">Bedrooms</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <Bath className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <div className="font-semibold text-gray-900">
                {property.bathrooms}
              </div>
              <div className="text-xs text-gray-600">Bathrooms</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <Square className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div className="font-semibold text-gray-900">{property.area}</div>
              <div className="text-xs text-gray-600">{property.areaUnit}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <Link href={`/properties/${property.id}`}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Heart className="w-4 h-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Comparison Table Component
function ComparisonTable({
  properties,
  userLocation,
  calculateDistance,
}: {
  properties: any[];
  userLocation?: { latitude: number; longitude: number } | null;
  calculateDistance?: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => number;
}) {
  const comparisonFeatures = [
    {
      key: "price",
      label: "Price",
      format: (value: any) =>
        value ? `₹${(value / 10000000).toFixed(1)} Cr` : "N/A",
    },
    {
      key: "bedrooms",
      label: "Bedrooms",
      format: (value: any) => (value ? value.toString() : "N/A"),
    },
    {
      key: "bathrooms",
      label: "Bathrooms",
      format: (value: any) => (value ? value.toString() : "N/A"),
    },
    {
      key: "area",
      label: "Area",
      format: (value: any, property: any) =>
        value ? `${value} ${property.areaUnit || "sqft"}` : "N/A",
    },
    {
      key: "category",
      label: "Property Type",
      format: (value: any) => value || "N/A",
    },
    {
      key: "constructionStatus",
      label: "Construction Status",
      format: (value: any) => value || "Ready to Move",
    },
    {
      key: "furnishingStatus",
      label: "Furnishing",
      format: (value: any) => value || "Semi Furnished",
    },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          Detailed Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Location Insights Section */}
        {userLocation && calculateDistance && (
          <div className="mb-8">
            <LocationInsights
              properties={properties}
              userLocation={userLocation}
              calculateDistance={calculateDistance}
            />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">
                  Features
                </th>
                {properties.map((property, index) => (
                  <th
                    key={property.id}
                    className="text-center py-3 px-4 font-semibold text-gray-900"
                  >
                    Property {index + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature) => (
                <tr key={feature.key} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-700">
                    {feature.label}
                  </td>
                  {properties.map((property) => (
                    <td
                      key={property.id}
                      className="py-3 px-4 text-center text-gray-900"
                    >
                      {feature.format(property[feature.key] || "", property)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Recommendation Section Component
function RecommendationSection({ properties }: { properties: any[] }) {
  const getBestProperty = () => {
    if (properties.length === 0) return null;

    // Simple algorithm to find the best property based on price per sqft and features
    return properties.reduce((best, current) => {
      const bestScore =
        (best.features?.length || 0) * 10 - best.price / best.area;
      const currentScore =
        (current.features?.length || 0) * 10 - current.price / current.area;
      return currentScore > bestScore ? current : best;
    });
  };

  const bestProperty = getBestProperty();

  if (!bestProperty) return null;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
      <CardContent className="p-8">
        <div className="flex items-start space-x-6">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Crown className="w-8 h-8 text-yellow-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Our Recommendation
            </h3>
            <p className="text-gray-600 mb-4">
              Based on our analysis of price, features, and value for money, we
              recommend:
            </p>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {bestProperty.title}
              </h4>
              <div className="flex items-center text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>
                  {bestProperty.address}, {bestProperty.city}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-blue-600">
                  ₹{(bestProperty.price / 10000000).toFixed(1)} Cr
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href={`/properties/${bestProperty.id}`}>
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Location Insights Component
function LocationInsights({
  properties,
  userLocation,
  calculateDistance,
}: {
  properties: any[];
  userLocation: { latitude: number; longitude: number };
  calculateDistance: (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => number;
}) {
  const propertiesWithDistance = properties
    .filter((property) => property.latitude && property.longitude)
    .map((property) => ({
      ...property,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        property.latitude,
        property.longitude
      ),
    }))
    .sort((a, b) => a.distance - b.distance);

  const averageDistance =
    propertiesWithDistance.length > 0
      ? propertiesWithDistance.reduce((sum, p) => sum + p.distance, 0) /
      propertiesWithDistance.length
      : 0;

  const closestProperty = propertiesWithDistance[0];
  const farthestProperty =
    propertiesWithDistance[propertiesWithDistance.length - 1];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-green-600" />
          Location Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {averageDistance.toFixed(1)} km
            </div>
            <div className="text-sm text-gray-600">Average Distance</div>
          </div>

          {closestProperty && (
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {closestProperty.distance.toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600">
                Closest: {closestProperty.title.substring(0, 20)}...
              </div>
            </div>
          )}

          {farthestProperty && (
            <div className="text-center">
              <div className="bg-orange-100 p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {farthestProperty.distance.toFixed(1)} km
              </div>
              <div className="text-sm text-gray-600">
                Farthest: {farthestProperty.title.substring(0, 20)}...
              </div>
            </div>
          )}
        </div>

        {propertiesWithDistance.length > 0 && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Distance Summary
            </h4>
            <div className="space-y-2">
              {propertiesWithDistance.map((property, index) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${index === 0
                          ? "bg-green-500"
                          : index === propertiesWithDistance.length - 1
                            ? "bg-orange-500"
                            : "bg-blue-500"
                        }`}
                    ></div>
                    <span className="font-medium text-gray-900 truncate">
                      {property.title}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-600">
                    {property.distance.toFixed(1)} km
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
