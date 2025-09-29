"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api";
import { usePropertyStore, useAuthStore } from "@/lib/store";
import { usePropertyImagePreloader } from "@/hooks/use-image-preloader";
import {
  Heart,
  Share2,
  Car,
  Shield,
  Dumbbell,
  Building,
  ChevronRight,
  ImageIcon,
  Wifi,
  Trees,
  Waves,
  Users,
  Zap,
  ShieldCheck,
  Maximize2,
  CalendarDays,
  User,
  CheckCircle,
  X,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyDetails } from "@/components/property/PropertyDetails";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { PriceTrends } from "@/components/property/PriceTrends";
import { FloorPlans } from "@/components/property/FloorPlans";
import { BuilderInfo } from "@/components/property/BuilderInfo";
import { ContactAgent } from "@/components/property/ContactAgent";
import { PropertyInsights } from "@/components/property/PropertyInsights";
import { PropertySEO } from "@/components/seo/PropertySEO";
import { toast } from "sonner";

// Dynamically import the Map and NearbyPlaces components to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const NearbyPlaces = dynamic(() => import("@/components/NearbyPlaces"), {
  ssr: false,
});

const ImageGallery = ({
  property,
  isFavorite,
  handleShare,
  handleFavorite,
}: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<any>({});
  const [showMobileGallery, setShowMobileGallery] = useState(false);
  const [thumbnailPage, setThumbnailPage] = useState(0);

  // Use actual property images or fallback to placeholders
  const propertyImages =
    property.images && property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop&crop=center&auto=format&q=85",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop&crop=center&auto=format&q=85",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop&crop=center&auto=format&q=85",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop&crop=center&auto=format&q=85",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop&crop=center&auto=format&q=85",
        ];

  // Calculate thumbnail pagination
  const thumbnailsPerPage = 7;
  const totalPages = Math.ceil(propertyImages.length / thumbnailsPerPage);
  const currentPage = Math.floor(currentImageIndex / thumbnailsPerPage);
  const startIndex = currentPage * thumbnailsPerPage;
  const endIndex = Math.min(startIndex + thumbnailsPerPage, propertyImages.length);
  const visibleThumbnails = propertyImages.slice(startIndex, endIndex);

  // Update thumbnail page when current image changes
  useEffect(() => {
    const newPage = Math.floor(currentImageIndex / thumbnailsPerPage);
    setThumbnailPage(newPage);
  }, [currentImageIndex, thumbnailsPerPage]);

  // Preload property images for better performance
  usePropertyImagePreloader(propertyImages);

  const handleImageError = (index: any) => {
    setImageErrors((prev: any) => ({ ...prev, [index]: true }));
  };

  const ImageWithFallback = ({
    src,
    alt,
    index,
    className,
    fill = false,
    ...props
  }: any) => {
    if (imageErrors[index]) {
      return (
        <div
          className={`bg-gray-200 flex items-center justify-center ${className}`}
        >
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
        style={{ objectFit: "cover" }}
        {...props}
      />
    );
  };

  return (
    <div className="mb-4 sm:mb-6">
      {/* Mobile Image Gallery */}
      <div className="block md:hidden">
        <div className="relative h-[280px] sm:h-[320px] bg-white rounded-xl overflow-hidden shadow-sm">
          <ImageWithFallback
            src={propertyImages[currentImageIndex]}
            alt={`${property.title} - Image ${currentImageIndex + 1}`}
            index={currentImageIndex}
            fill={true}
            className="transition-transform duration-300"
          />

          {/* Mobile Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {propertyImages.slice(0, 5).map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 active:scale-125 ${
                  currentImageIndex === index
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          {/* Mobile Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm text-xs h-8 px-3"
                >
                  <ImageIcon className="w-3 h-3 mr-1" />
                  {propertyImages.length}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] p-0">
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">{property.title}</h2>
                    <div className="text-sm text-gray-500">
                      {propertyImages.length} photos
                    </div>
                  </div>

                  {/* Carousel Container */}
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative h-[50vh] w-full bg-black">
                      <ImageWithFallback
                        src={propertyImages[currentImageIndex]}
                        alt={`${property.title} - Image ${
                          currentImageIndex + 1
                        }`}
                        index={currentImageIndex}
                        fill={true}
                        className="object-contain"
                        style={{ objectPosition: "center" }}
                      />

                      {/* Navigation Arrows */}
                      {propertyImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                currentImageIndex === 0
                                  ? propertyImages.length - 1
                                  : currentImageIndex - 1
                              )
                            }
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:bg-white active:scale-95"
                          >
                            <ChevronRight className="w-5 h-5 rotate-180" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                currentImageIndex === propertyImages.length - 1
                                  ? 0
                                  : currentImageIndex + 1
                              )
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:bg-white active:scale-95"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="p-4 bg-transparent backdrop-blur-sm">
                      <div className="flex items-center space-x-2 w-full">
                        {/* Left Arrow */}
                        {totalPages > 1 && (
                          <button
                            onClick={() => {
                              const newPage = Math.max(0, thumbnailPage - 1);
                              setThumbnailPage(newPage);
                              // Set current image to first image of new page
                              setCurrentImageIndex(newPage * thumbnailsPerPage);
                            }}
                            disabled={thumbnailPage === 0}
                            className={`flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-white active:scale-95 z-10 ${
                              thumbnailPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <ChevronRight className="w-4 h-4 rotate-180" />
                          </button>
                        )}
                        
                        <div className="flex space-x-2 flex-1 justify-center">
                          {visibleThumbnails.map((image: any, index: any) => {
                            const actualIndex = startIndex + index;
                            return (
                              <button
                                key={actualIndex}
                                onClick={() => setCurrentImageIndex(actualIndex)}
                                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                  currentImageIndex === actualIndex
                                    ? "border-red-500 scale-105"
                                    : "border-white/30 hover:border-white/50"
                                }`}
                              >
                                <ImageWithFallback
                                  src={image}
                                  alt={`${property.title} - Thumbnail ${
                                    actualIndex + 1
                                  }`}
                                  index={actualIndex}
                                  fill={true}
                                  className="object-cover"
                                />
                              </button>
                            );
                          })}
                        </div>
                        
                        {/* Right Arrow */}
                        {totalPages > 1 && (
                          <button
                            onClick={() => {
                              const newPage = Math.min(totalPages - 1, thumbnailPage + 1);
                              setThumbnailPage(newPage);
                              // Set current image to first image of new page
                              setCurrentImageIndex(newPage * thumbnailsPerPage);
                            }}
                            disabled={thumbnailPage === totalPages - 1}
                            className={`flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-white active:scale-95 z-10 ${
                              thumbnailPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      {/* Image Counter */}
                      <div className="text-center mt-2">
                        <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded-full">
                          {currentImageIndex + 1} of {propertyImages.length}
                        </span>
                      </div>
                    </div>
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
              className={`bg-white/90 backdrop-blur-sm h-8 w-8 p-0 ${
                isFavorite ? "text-red-500" : ""
              }`}
            >
              <Heart
                className={`w-3 h-3 ${isFavorite ? "fill-red-500" : ""}`}
              />
            </Button>
          </div>

          {/* Property Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-500 text-white border-0 px-2 py-1 text-xs">
              For {property.propertyType === "sell" ? "Sale" : "Rent"}
            </Badge>
          </div>

          {/* Mobile Swipe Navigation */}
          {propertyImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setCurrentImageIndex(Math.max(0, currentImageIndex - 1))
                }
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 active:scale-95 ${
                  currentImageIndex === 0 ? "opacity-50" : "hover:bg-white/90"
                }`}
                disabled={currentImageIndex === 0}
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    Math.min(propertyImages.length - 1, currentImageIndex + 1)
                  )
                }
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 active:scale-95 ${
                  currentImageIndex === propertyImages.length - 1
                    ? "opacity-50"
                    : "hover:bg-white/90"
                }`}
                disabled={currentImageIndex === propertyImages.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Desktop Image Gallery */}
      <div className="hidden md:block bg-white rounded-xl overflow-hidden shadow-sm">
        <div className="relative">
          {/* Main Image Grid */}
          <div className="grid grid-cols-4 gap-2 h-[350px] lg:h-[400px]">
            {/* Large Main Image */}
            <div
              className="col-span-2 relative group cursor-pointer overflow-hidden rounded-l-lg"
              onClick={() => setCurrentImageIndex(0)}
            >
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
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <div
                className="relative group cursor-pointer overflow-hidden"
                onClick={() => setCurrentImageIndex(1)}
              >
                <ImageWithFallback
                  src={propertyImages[1] || propertyImages[0]}
                  alt={`${property.title} - Image 2`}
                  index={1}
                  fill={true}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              <div
                className="relative group cursor-pointer overflow-hidden rounded-tr-lg"
                onClick={() => setCurrentImageIndex(2)}
              >
                <ImageWithFallback
                  src={propertyImages[2] || propertyImages[0]}
                  alt={`${property.title} - Image 3`}
                  index={2}
                  fill={true}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              <div
                className="relative group cursor-pointer overflow-hidden"
                onClick={() => setCurrentImageIndex(3)}
              >
                <ImageWithFallback
                  src={propertyImages[3] || propertyImages[0]}
                  alt={`${property.title} - Image 4`}
                  index={3}
                  fill={true}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative group cursor-pointer overflow-hidden rounded-br-lg">
                    <ImageWithFallback
                      src={propertyImages[4] || propertyImages[0]}
                      alt={`${property.title} - Image 5`}
                      index={4}
                      fill={true}
                      className="transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <div className="text-white text-center">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-xs font-medium">
                          Show all photos
                        </div>
                        <div className="text-xs opacity-90">
                          {propertyImages.length} images
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] p-0">
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <h2 className="text-lg font-semibold">
                        {property.title}
                      </h2>
                      <div className="text-sm text-gray-500">
                        {propertyImages.length} photos
                      </div>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative h-[60vh] w-full bg-black">
                        <ImageWithFallback
                          src={propertyImages[currentImageIndex]}
                          alt={`${property.title} - Image ${
                            currentImageIndex + 1
                          }`}
                          index={currentImageIndex}
                          fill={true}
                          className="object-contain"
                          style={{ objectPosition: "center" }}
                        />

                        {/* Navigation Arrows */}
                        {propertyImages.length > 1 && (
                          <>
                            <button
                              onClick={() =>
                                setCurrentImageIndex(
                                  currentImageIndex === 0
                                    ? propertyImages.length - 1
                                    : currentImageIndex - 1
                                )
                              }
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:bg-white active:scale-95"
                            >
                              <ChevronRight className="w-6 h-6 rotate-180" />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentImageIndex(
                                  currentImageIndex ===
                                    propertyImages.length - 1
                                    ? 0
                                    : currentImageIndex + 1
                                )
                              }
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:bg-white active:scale-95"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnail Navigation */}
                      <div className="p-4 bg-transparent backdrop-blur-sm">
                        <div className="flex items-center space-x-2 w-full">
                          {/* Left Arrow */}
                          {totalPages > 1 && (
                            <button
                              onClick={() => {
                                const newPage = Math.max(0, thumbnailPage - 1);
                                setThumbnailPage(newPage);
                                // Set current image to first image of new page
                                setCurrentImageIndex(newPage * thumbnailsPerPage);
                              }}
                              disabled={thumbnailPage === 0}
                              className={`flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-white active:scale-95 z-10 ${
                                thumbnailPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <ChevronRight className="w-4 h-4 rotate-180" />
                            </button>
                          )}
                          
                          <div className="flex space-x-2 flex-1 justify-center">
                            {visibleThumbnails.map((image: any, index: any) => {
                              const actualIndex = startIndex + index;
                              return (
                                <button
                                  key={actualIndex}
                                  onClick={() => setCurrentImageIndex(actualIndex)}
                                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                    currentImageIndex === actualIndex
                                      ? "border-red-500 scale-105"
                                      : "border-white/30 hover:border-white/50"
                                  }`}
                                >
                                  <ImageWithFallback
                                    src={image}
                                    alt={`${property.title} - Thumbnail ${
                                      actualIndex + 1
                                    }`}
                                    index={actualIndex}
                                    fill={true}
                                    className="object-cover"
                                  />
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Right Arrow */}
                          {totalPages > 1 && (
                            <button
                              onClick={() => {
                                const newPage = Math.min(totalPages - 1, thumbnailPage + 1);
                                setThumbnailPage(newPage);
                                // Set current image to first image of new page
                                setCurrentImageIndex(newPage * thumbnailsPerPage);
                              }}
                              disabled={thumbnailPage === totalPages - 1}
                              className={`flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-200 hover:bg-white active:scale-95 z-10 ${
                                thumbnailPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* Image Counter */}
                        <div className="text-center mt-2">
                          <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            {currentImageIndex + 1} of {propertyImages.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Desktop Floating Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm text-xs h-8 px-3"
                >
                  <Maximize2 className="w-3 h-3 mr-1" />
                  Show all
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[90vh] p-0">
                <div className="relative">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">{property.title}</h2>
                    <div className="text-sm text-gray-500">
                      {propertyImages.length} photos
                    </div>
                  </div>

                  {/* Carousel Container */}
                  <div className="relative">
                    {/* Main Image */}
                    <div className="relative h-[55vh] w-full bg-black">
                      <ImageWithFallback
                        src={propertyImages[currentImageIndex]}
                        alt={`${property.title} - Image ${
                          currentImageIndex + 1
                        }`}
                        index={currentImageIndex}
                        fill={true}
                        className="object-contain"
                        style={{ objectPosition: "center" }}
                      />

                      {/* Navigation Arrows */}
                      {propertyImages.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                currentImageIndex === 0
                                  ? propertyImages.length - 1
                                  : currentImageIndex - 1
                              )
                            }
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:bg-white active:scale-95"
                          >
                            <ChevronRight className="w-6 h-6 rotate-180" />
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex(
                                currentImageIndex === propertyImages.length - 1
                                  ? 0
                                  : currentImageIndex + 1
                              )
                            }
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg transition-all duration-200 hover:bg-white active:scale-95"
                          >
                            <ChevronRight className="w-6 h-6" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Thumbnail Navigation */}
                    <div className="p-4 bg-transparent backdrop-blur-sm">
                      <div className="flex justify-center">
                        <div className="flex space-x-2 overflow-x-auto scrollbar-hide max-w-full justify-center">
                          {propertyImages.map((image: any, index: any) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                currentImageIndex === index
                                  ? "border-red-500 scale-105"
                                  : "border-white/30 hover:border-white/50"
                              }`}
                            >
                              <ImageWithFallback
                                src={image}
                                alt={`${property.title} - Thumbnail ${
                                  index + 1
                                }`}
                                index={index}
                                fill={true}
                                className="object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
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
              className={`bg-white/90 backdrop-blur-sm h-8 w-8 p-0 ${
                isFavorite ? "text-red-500" : ""
              }`}
            >
              <Heart
                className={`w-3 h-3 ${isFavorite ? "fill-red-500" : ""}`}
              />
            </Button>
          </div>

          {/* Property Status Badge */}
          <div className="absolute top-4 left-4">
            <Badge className="bg-green-500 text-white border-0 px-2 py-1 text-xs">
              For {property.propertyType === "sell" ? "Sale" : "Rent"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

// Amenity icons mapping
const amenityIcons: { [key: string]: any } = {
  Parking: Car,
  Security: Shield,
  Gym: Dumbbell,
  Garden: Trees,
  "Swimming Pool": Waves,
  Clubhouse: Users,
  "Power Backup": Zap,
  Lift: Building,
  WiFi: Wifi,
  CCTV: ShieldCheck,
};

// Mock price history data for the graph
const priceHistoryData = [
  { year: "2020", price: 85, growth: 0 },
  { year: "2021", price: 92, growth: 8.2 },
  { year: "2022", price: 98, growth: 6.5 },
  { year: "2023", price: 108, growth: 10.2 },
  { year: "2024", price: 116, growth: 7.4 },
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

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
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
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            EMI Calculator
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs p-1 h-7 sm:h-8"
          >
            {isExpanded ? "Simple" : "Advanced"}
          </Button>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {/* Property Price Display */}
          <div className="p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-700 mb-1">Property Price</div>
            <div className="text-base sm:text-lg font-bold text-blue-800">
              {formatPrice(propertyPrice)}
            </div>
          </div>

          {/* Down Payment Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-gray-700">
                Down Payment
              </span>
              <div className="text-right">
                <div className="text-xs sm:text-sm font-bold text-gray-900">
                  {formatPrice(downPayment)}
                </div>
                <div className="text-xs text-gray-600">
                  ({downPaymentPercentage.toFixed(0)}%)
                </div>
              </div>
            </div>
            <input
              type="range"
              min={propertyPrice * 0.05} // Minimum 5%
              max={propertyPrice * 0.5} // Maximum 50%
              step={propertyPrice * 0.01} // 1% steps
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${
                  downPaymentPercentage * 2
                }%, #e5e7eb ${downPaymentPercentage * 2}%, #e5e7eb 100%)`,
              }}
            />
            {isExpanded && (
              <div className="mt-2">
                <input
                  type="number"
                  value={Math.round(downPayment)}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (
                      value >= propertyPrice * 0.05 &&
                      value <= propertyPrice * 0.5
                    ) {
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
          <div className="p-2 sm:p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-xs text-orange-700 mb-1">Loan Amount</div>
            <div className="text-base sm:text-lg font-bold text-orange-800">
              {formatPrice(loanAmount)}
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-gray-700">
                    Interest Rate
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {interestRate}% per annum
                  </span>
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
                  <span className="text-xs font-medium text-gray-700">
                    Tenure
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {tenure} years
                  </span>
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
                <div className="text-xs sm:text-sm font-bold text-gray-900">
                  {interestRate}%
                </div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-xs text-gray-600 mb-1">Tenure</div>
                <div className="text-xs sm:text-sm font-bold text-gray-900">
                  {tenure} Years
                </div>
              </div>
            </div>
          )}

          {/* EMI Result */}
          <div className="p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
            <div className="text-xs text-red-700 mb-1 font-medium">
              Monthly EMI
            </div>
            <div className="text-lg sm:text-xl font-bold text-red-600">
              {formatEMI(monthlyEMI)}
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Interest</span>
                <span className="text-xs sm:text-sm font-medium text-gray-900">
                  {formatPrice(totalInterest)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  Total Amount Payable
                </span>
                <span className="text-xs sm:text-sm font-bold text-gray-900">
                  {formatPrice(totalAmount)}
                </span>
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
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
          }
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .slider::-moz-range-thumb {
            height: 18px;
            width: 18px;
            border-radius: 50%;
            background: #ef4444;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            transition: all 0.2s ease;
          }
          .slider::-moz-range-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </CardContent>
    </Card>
  );
};

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToFavourites, removeFromFavourites, favourites, addToViewed } =
    usePropertyStore();
  const { user, addToRecentlyViewed } = useAuthStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [showReraDialog, setShowReraDialog] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const fetchProperty = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        const response: any = await apiClient.getProperty(id);
        if (response.success && response.data) {
          setProperty(response.data);
          // Only add to viewed if user is logged in
          if (user) {
            addToViewed(response.data);
            addToRecentlyViewed(response.data);
            // Also add to the new viewed properties API
            try {
              await apiClient.addViewedProperty(user.id, id);
            } catch (error) {
              console.error("Error adding to viewed properties:", error);
            }
          }
        } else {
          const mockPropertyWithId = { ...mockProperty, id };
          setProperty(mockPropertyWithId);
          if (user) {
            addToViewed(mockPropertyWithId);
            addToRecentlyViewed(mockPropertyWithId);
          }
        }
      } catch (error) {
        console.error("Error fetching property:", error);
        const mockPropertyWithId = { ...mockProperty, id };
        setProperty(mockPropertyWithId);
        if (user) {
          addToViewed(mockPropertyWithId);
          addToRecentlyViewed(mockPropertyWithId);
        }
      } finally {
        setLoading(false);
      }
    },
    [addToViewed, addToRecentlyViewed, user]
  );

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
    }
  }, [params.id, fetchProperty]);

  const handleFavorite = async () => {
    if (!property) return;

    if (!user) {
      toast.error("Please login to add favourites");
      return;
    }

    try {
      const isFavorite = favourites.some((p) => p.id === property.id);
      if (isFavorite) {
        await apiClient.removeFromFavourites(property.id);
        removeFromFavourites(property.id);
        toast.success("Property removed from favourites");
      } else {
        await apiClient.addToFavourites(property.id);
        addToFavourites(property);
        toast.success("Property added to favourites");
      }
    } catch (error) {
      console.error("Error updating favourite:", error);
      toast.error("Failed to update favourite");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.error("Could not copy text: ", error));
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error("Please login to book a visit");
        setIsSubmitting(false);
        return;
      }

      const response: any = await apiClient.bookPropertyVisit({
        propertyId: params.id as string,
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        date: bookingForm.date,
        time: bookingForm.time,
        message: bookingForm.message,
      });

      if (response.success) {
        setIsSubmitting(false);
        setBookingSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setBookingSuccess(false);
          setShowBookingModal(false);
          setBookingForm({
            name: "",
            email: "",
            phone: "",
            date: "",
            time: "",
            message: "",
          });
        }, 3000);
      } else {
        throw new Error(response.message || "Failed to book visit");
      }
    } catch (error) {
      console.error("Error booking visit:", error);
      toast.error("Failed to book visit. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextField?: string) => {
    if (e.key === "Enter" && nextField) {
      e.preventDefault();
      const nextElement = document.getElementById(nextField);
      if (nextElement) {
        nextElement.focus();
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      const yOffset = -140; // Account for header (80px) + sticky tabs (60px)
      const y =
        section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Handle scroll to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "overview",
        "amenities",
        "details",
        "location",
        "price-trends",
      ];
      let currentSection = sections[0];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 180) {
            // Account for header + sticky tabs + some padding
            currentSection = section;
          }
        }
      }

      setActiveTab(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price?.toLocaleString() || ""}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            {/* Image Gallery Skeleton */}
            <div className="mb-6 bg-white rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-3 gap-2 h-[350px]">
                <div className="col-span-2 relative">
                  <Skeleton className="h-full w-full rounded-l-lg" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="flex-1 rounded-tr-lg" />
                  <Skeleton className="flex-1 rounded-br-lg" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-5">
                {/* Property Header Skeleton */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="animate-pulse">
                    <Skeleton className="h-8 w-3/4 mb-3" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-10 w-32" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* RERA Card Skeleton */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="animate-pulse flex items-center justify-between">
                    <div className="flex items-center">
                      <Skeleton className="h-5 w-5 rounded mr-3" />
                      <div>
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-40" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>

                {/* Navigation Tabs Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="px-5 py-3">
                    <div className="animate-pulse flex space-x-6">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-4 w-16" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content Sections Skeleton */}
                <div className="space-y-6">
                  {/* Overview Section */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="animate-pulse">
                      <Skeleton className="h-5 w-24 mb-3" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  </div>

                  {/* Amenities Section */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="animate-pulse">
                      <Skeleton className="h-5 w-24 mb-4" />
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                          <div key={i} className="flex items-center">
                            <Skeleton className="h-4 w-4 rounded mr-2" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="animate-pulse">
                      <Skeleton className="h-5 w-24 mb-4" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="flex justify-between">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Location Section */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="animate-pulse">
                      <Skeleton className="h-5 w-24 mb-4" />
                      <Skeleton className="h-48 w-full rounded-lg" />
                    </div>
                  </div>

                  {/* Price Trends Section */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="animate-pulse">
                      <Skeleton className="h-5 w-32 mb-4" />
                      <Skeleton className="h-64 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                {/* Contact Agent Skeleton */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="animate-pulse">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <div className="flex items-center mb-4">
                      <Skeleton className="h-12 w-12 rounded-full mr-3" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>

                {/* EMI Calculator Skeleton */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="space-y-4">
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                      <Skeleton className="h-16 w-full rounded-lg" />
                    </div>
                  </div>
                </div>

                {/* Builder Info Skeleton */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="animate-pulse">
                    <Skeleton className="h-5 w-24 mb-4" />
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-10 w-10 rounded mr-3" />
                      <div>
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>

                {/* Property Insights Skeleton */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="animate-pulse">
                    <Skeleton className="h-5 w-32 mb-4" />
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center">
                          <Skeleton className="h-4 w-4 rounded mr-2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
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
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-3">
              Property Not Found
            </h1>
            <Button onClick={() => router.push("/properties")}>
              Back to Properties
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isFavorite = favourites.some((p) => p.id === property.id);
  const Propertyimages = property.images || [
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <ImageGallery
            property={property}
            isFavorite={isFavorite}
            handleShare={handleShare}
            handleFavorite={handleFavorite}
          />

          <PropertySEO property={property} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <PropertyHeader property={property} formatPrice={formatPrice} />

              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-green-600 mr-3" />
                    <div>
                      <span className="font-medium text-gray-900 text-sm sm:text-base">
                        RERA Registered
                      </span>
                      <p className="text-xs sm:text-sm text-gray-600">
                        Government approved project
                      </p>
                    </div>
                  </div>
                  <Dialog
                    open={showReraDialog}
                    onOpenChange={setShowReraDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <div className="p-1">
                        <h3 className="text-base font-semibold mb-3">
                          RERA Details
                        </h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs text-gray-600">
                              RERA Number:
                            </div>
                            <div className="text-[10px] font-medium">
                              {property.rera?.registrationNumber ||
                                "RERA Not received or not applied"}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs text-gray-600">Status:</div>
                            <div className="text-xs font-medium text-green-600">
                              {property.reraStatus || "Approved"}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-xs text-gray-600">
                              Validity:
                            </div>
                            <div className="text-xs font-medium">
                              31 Dec, 2025
                            </div>
                          </div>
                          <div className="mt-3 text-xs text-gray-500">
                            RERA registration ensures that this property
                            complies with all regulatory requirements and
                            provides buyer protection.
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Responsive Navigation Tabs */}
              <div
                ref={tabsRef}
                className="sticky top-16 sm:top-20 z-40 bg-white rounded-xl shadow-sm border border-gray-100 mb-4 sm:mb-6"
              >
                <div className="px-3 sm:px-5 py-3">
                  {/* Mobile Horizontal Scroll */}
                  <div className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide">
                    {[
                      { id: "overview", label: "Overview" },
                      { id: "amenities", label: "Amenities" },
                      { id: "details", label: "Details" },
                      { id: "location", label: "Location" },
                      // { id: "price-trends", label: "Price Trends" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)}
                        className={`pb-2 px-1 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? "border-red-500 text-red-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content Sections */}
              <div className="space-y-4 sm:space-y-6">
                {/* Overview Section */}
                <section
                  id="overview"
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100"
                >
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                    Overview
                  </h2>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {property.description}
                  </p>
                </section>

                <div id="amenities">
                  <PropertyAmenities amenities={property.amenities} />
                </div>

                <FloorPlans floorPlans={property.floorPlans} />

                <div id="details">
                  <PropertyDetails property={property} />
                </div>

                <div id="location">
                  <PropertyLocation property={property} />
                </div>

                {/* <div id="price-trends">
                  <PriceTrends
                    priceHistoryData={priceHistoryData}
                    formatPrice={formatPrice}
                  />
                </div> */}
              </div>
            </div>

            {/* Mobile: Bottom Sheet Style Sidebar */}
            <div className="xl:hidden">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100 space-y-4">
                <ContactAgent property={property} />
                <EMICalculator propertyPrice={property.price} />
              </div>
            </div>

            {/* Desktop: Traditional Sidebar */}
            <div className="hidden xl:block space-y-6">
              <ContactAgent property={property} />
              <EMICalculator propertyPrice={property.price} />
              <BuilderInfo property={property} />
              <PropertyInsights property={property} />
            </div>
          </div>

          {/* Mobile: Additional Sections */}
          <div className="xl:hidden mt-6 space-y-4">
            <BuilderInfo property={property} />
            <PropertyInsights property={property} />
          </div>
        </div>
      </main>

      {/* Floating Book Visit Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 px-6 py-3 rounded-full font-semibold text-sm flex items-center space-x-2 group">
              <CalendarDays className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              <span>Book Visit</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-0 p-0 overflow-hidden">
            {!bookingSuccess ? (
              <>
                <DialogHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 pb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <CalendarDays className="w-6 h-6" />
                      </div>
                      <div>
                        <DialogTitle className="text-xl font-bold">
                          Book a Visit
                        </DialogTitle>
                        <p className="text-red-100 text-sm mt-1">
                          Schedule your property tour
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <User className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Personal Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={bookingForm.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, "email")}
                          className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label
                            htmlFor="email"
                            className="text-sm font-medium text-gray-700"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={bookingForm.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, "phone")}
                            className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-medium text-gray-700"
                          >
                            Phone
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 98765 43210"
                            value={bookingForm.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            onKeyDown={(e) => handleKeyDown(e, "date")}
                            className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visit Schedule */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Visit Schedule
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="date"
                          className="text-sm font-medium text-gray-700"
                        >
                          Preferred Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingForm.date}
                          onChange={(e) =>
                            handleInputChange("date", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, "time")}
                          min={new Date().toISOString().split("T")[0]}
                          className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="time"
                          className="text-sm font-medium text-gray-700"
                        >
                          Preferred Time
                        </Label>
                        <select
                          id="time"
                          value={bookingForm.time}
                          onChange={(e) =>
                            handleInputChange("time", e.target.value)
                          }
                          onKeyDown={(e) => handleKeyDown(e, "message")}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-red-500 transition-colors bg-white"
                          required
                        >
                          <option value="">Select time</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                          <option value="18:00">6:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Additional Message */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
                    >
                      Additional Message (Optional)
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Any specific requirements or questions..."
                      value={bookingForm.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(e)}
                      className="border-gray-200 focus:border-red-500 focus:ring-red-500 rounded-lg transition-colors resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Booking Visit...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <CalendarDays className="w-4 h-4" />
                          <span>Confirm Visit</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Visit Booked Successfully!
                  </h3>
                  <p className="text-gray-600">
                    We&apos;ll contact you shortly to confirm your visit
                    details.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {new Date(bookingForm.date).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {bookingForm.time}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span>{" "}
                      {bookingForm.phone}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  This modal will close automatically in a few seconds...
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}
const mockProperty = {
  id: "1",
  title: "Luxury 3BHK Apartment in Whitefield",
  description:
    "This stunning 3BHK apartment in Whitefield offers modern living with premium amenities. Located in a prime area with excellent connectivity to IT hubs and shopping centers. The property features spacious rooms, modern fittings, and access to world-class amenities including swimming pool, gym, and landscaped gardens. Perfect for families looking for a comfortable and luxurious lifestyle in one of Bangalore's most sought-after locations.",
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
    "WiFi",
    "CCTV",
  ],
  location: [12.9716, 77.5946],
  images: [
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
    "/api/placeholder/800/600",
  ],
};
