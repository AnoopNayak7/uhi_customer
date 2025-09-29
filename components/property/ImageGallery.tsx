"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Share2, ImageIcon, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PropertyGalleryImage,
  HeroImage,
} from "@/components/ui/optimized-image";
import { BLUR_DATA_URLS } from "@/lib/images";

interface ImageGalleryProps {
  property: any;
  isFavorite: boolean;
  handleShare: () => void;
  handleFavorite: () => void;
}

export const ImageGallery = ({
  property,
  isFavorite,
  handleShare,
  handleFavorite,
}: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [thumbnailPage, setThumbnailPage] = useState(0);

  // Use actual property images or fallback to placeholders
  const propertyImages =
    property.images && property.images.length > 0
      ? property.images
      : [
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80",
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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

  const handleImageError = (index: number) => {
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  const MainImageComponent = ({
    src,
    alt,
    index,
    className,
    ...props
  }: any) => {
    if (index === 0) {
      // First image is critical, load with priority
      return (
        <HeroImage
          src={src}
          alt={alt}
          className={className}
          fill
          blurDataURL={BLUR_DATA_URLS.property}
          fallbackSrc={propertyImages[1] || propertyImages[0]}
          index={index}
          onError={() => handleImageError(index)}
          {...props}
        />
      );
    }

    // Other images use lazy loading
    return (
      <PropertyGalleryImage
        src={src}
        alt={alt}
        className={className}
        fill
        blurDataURL={BLUR_DATA_URLS.property}
        fallbackSrc={propertyImages[0]}
        index={index}
        onError={() => handleImageError(index)}
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
          <div
            className="col-span-2 relative group cursor-pointer overflow-hidden rounded-l-lg"
            onClick={() => setCurrentImageIndex(0)}
          >
            <MainImageComponent
              src={propertyImages[0]}
              alt={`${property.title} - Main Image`}
              index={0}
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          </div>

          {/* Right Side Images */}
          <div className="flex flex-col gap-2">
            <div
              className="relative group cursor-pointer flex-1 overflow-hidden rounded-tr-lg"
              onClick={() => setCurrentImageIndex(1)}
            >
              <MainImageComponent
                src={propertyImages[1] || propertyImages[0]}
                alt={`${property.title} - Image 2`}
                index={1}
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <div className="relative group cursor-pointer flex-1 overflow-hidden rounded-br-lg">
                  <MainImageComponent
                    src={propertyImages[2] || propertyImages[0]}
                    alt={`${property.title} - Image 3`}
                    index={2}
                    className="transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="text-white text-center">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-xs font-medium">Show all photos</div>
                      <div className="text-xs opacity-90">
                        {propertyImages.length} images
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-6xl max-h-[90vh]">
                <div className="p-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{property.title}</h2>
                    <div className="text-sm text-gray-500">
                      {propertyImages.length} photos
                    </div>
                  </div>
                  
                  {/* Thumbnail Navigation */}
                  {totalPages > 1 && (
                    <div className="flex items-center space-x-2 mb-4 w-full">
                      <button
                        onClick={() => {
                          const newPage = Math.max(0, thumbnailPage - 1);
                          setThumbnailPage(newPage);
                          // Set current image to first image of new page
                          setCurrentImageIndex(newPage * thumbnailsPerPage);
                        }}
                        disabled={thumbnailPage === 0}
                        className={`flex-shrink-0 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200 z-10 ${
                          thumbnailPage === 0 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      
                      <div className="flex space-x-2 flex-1 justify-center">
                        {visibleThumbnails.map((image: any, index: any) => {
                          const actualIndex = startIndex + index;
                          return (
                            <button
                              key={actualIndex}
                              onClick={() => setCurrentImageIndex(actualIndex)}
                              className={`relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                currentImageIndex === actualIndex
                                  ? "border-red-500 scale-105"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <PropertyGalleryImage
                                src={image}
                                alt={`${property.title} - Thumbnail ${actualIndex + 1}`}
                                index={actualIndex}
                                fill
                                className="object-cover"
                                blurDataURL={BLUR_DATA_URLS.property}
                                fallbackSrc={propertyImages[0]}
                                onError={() => handleImageError(actualIndex)}
                              />
                            </button>
                          );
                        })}
                      </div>
                      
                      <button
                        onClick={() => {
                          const newPage = Math.min(totalPages - 1, thumbnailPage + 1);
                          setThumbnailPage(newPage);
                          // Set current image to first image of new page
                          setCurrentImageIndex(newPage * thumbnailsPerPage);
                        }}
                        disabled={thumbnailPage === totalPages - 1}
                        className={`flex-shrink-0 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-all duration-200 z-10 ${
                          thumbnailPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Image Counter */}
                  <div className="text-center mb-4">
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                      {currentImageIndex + 1} of {propertyImages.length}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                    {propertyImages.map((image: any, index: any) => (
                      <div
                        key={index}
                        className="relative h-48 w-full rounded-lg overflow-hidden cursor-pointer"
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <PropertyGalleryImage
                          src={image}
                          alt={`${property.title} - Image ${index + 1}`}
                          index={index}
                          fill
                          className="hover:scale-105 transition-transform duration-300"
                          blurDataURL={BLUR_DATA_URLS.property}
                          fallbackSrc={propertyImages[0]}
                          onError={() => handleImageError(index)}
                        />
                        {currentImageIndex === index && (
                          <div className="absolute inset-0 bg-red-500/20 border-2 border-red-500 rounded-lg" />
                        )}
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
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 backdrop-blur-sm text-xs h-8"
              >
                <Maximize2 className="w-3 h-3 mr-1" />
                Show all
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="p-1">
                <h2 className="text-lg font-semibold mb-4">{property.title}</h2>
                <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  {propertyImages.map((image: any, index: any) => (
                    <div
                      key={index}
                      className="relative h-40 w-full rounded-md overflow-hidden"
                    >
                      <PropertyGalleryImage
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        index={index}
                        fill
                        className="hover:scale-105 transition-transform duration-300"
                        blurDataURL={BLUR_DATA_URLS.property}
                        fallbackSrc={propertyImages[0]}
                        onError={() => handleImageError(index)}
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
            className={`bg-white/90 backdrop-blur-sm h-8 w-8 p-0 ${
              isFavorite ? "text-red-500" : ""
            }`}
          >
            <Heart className={`w-3 h-3 ${isFavorite ? "fill-red-500" : ""}`} />
          </Button>
        </div>

        {/* Property Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className="bg-green-500 text-white border-0 px-2 py-1 text-xs">
            For {property.propertyType === "sell" ? "Sale" : "Rent"}
          </Badge>
        </div>
      </div>
    </div>
  );
};
