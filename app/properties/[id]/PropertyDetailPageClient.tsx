"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyAmenities } from "@/components/property/PropertyAmenities";
import { PropertyDetails } from "@/components/property/PropertyDetails";
import { PropertyLocation } from "@/components/property/PropertyLocation";
import { FloorPlans } from "@/components/property/FloorPlans";
import { BuilderInfo } from "@/components/property/BuilderInfo";
import { ContactAgent } from "@/components/property/ContactAgent";
import { PropertyInsights } from "@/components/property/PropertyInsights";
import { apiClient } from "@/lib/api";
import { usePropertyStore, useAuthStore } from "@/lib/store";
import { toast } from "sonner";

interface PropertyDetailPageClientProps {
  propertyId: string;
}

export function PropertyDetailPageClient({ propertyId }: PropertyDetailPageClientProps) {
  const router = useRouter();
  const { addToFavourites, removeFromFavourites, favourites, addToViewed } = usePropertyStore();
  const { user, addToRecentlyViewed } = useAuthStore();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProperty = async (id: string) => {
    setLoading(true);
    try {
      const response: any = await apiClient.getProperty(id);
      if (response.success && response.data) {
        setProperty(response.data);
        if (user) {
          addToViewed(response.data);
          addToRecentlyViewed(response.data);
        }
      } else {
        router.push('/properties');
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      router.push('/properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchProperty(propertyId);
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="text-center py-20">
              <p>Loading property...</p>
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
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
              <p className="text-gray-600 mb-6">The property you're looking for could not be found.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price?.toLocaleString() || ""}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="xl:col-span-2 space-y-4 sm:space-y-6">
              <PropertyHeader property={property} formatPrice={formatPrice} />
              
              <div className="space-y-4 sm:space-y-6">
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
              </div>
            </div>

            <div className="hidden xl:block space-y-6">
              <ContactAgent property={property} />
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
