"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore, usePropertyStore } from '@/lib/store';
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
  Search
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

export default function PropertyComparisonPage() {
  const { user } = useAuthStore();
  const { compareList, addToCompare, removeFromCompare, clearCompare } = usePropertyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 2) {
      searchProperties();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchProperties = async () => {
    setLoading(true);
    try {
      const response:any = await apiClient.getProperties({ 
        search: searchTerm,
        limit: 5 
      });
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching properties:', error);
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
    // Simple scoring algorithm based on various factors
    let score = 0;
    score += Math.min(property.bedrooms * 10, 40);
    score += Math.min(property.bathrooms * 5, 20);
    score += Math.min((property.area / 100), 30);
    score += Math.random() * 10; // Random factor for demo
    return Math.round(score);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Premium Tool</h2>
              <p className="text-gray-600 mb-6">
                Please login to access the Property Comparison Tool
              </p>
              <Button asChild>
                <Link href="/auth/login">Login to Continue</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                <Badge className="bg-yellow-500 text-white">Premium Tool</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Property Comparison Tool
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Compare multiple properties side-by-side with detailed analysis and scoring
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Add Properties */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Properties to Compare</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search properties by title, location, or builder..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {searchResults.map((property) => (
                        <div key={property.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-md" />
                            <div>
                              <h4 className="font-medium text-gray-900">{property.title}</h4>
                              <p className="text-sm text-gray-600">{property.city} • {formatPrice(property.price)}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (compareList.length >= 3) {
                                toast.error('You can compare maximum 3 properties');
                                return;
                              }
                              addToCompare(property);
                              toast.success('Property added to comparison');
                            }}
                            disabled={compareList.some(p => p.id === property.id)}
                          >
                            {compareList.some(p => p.id === property.id) ? 'Added' : 'Add to Compare'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comparison Table */}
            {compareList.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Property Comparison ({compareList.length}/3)
                  </h2>
                  <Button variant="outline" onClick={clearCompare}>
                    Clear All
                  </Button>
                </div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {compareList.map((property, index) => (
                    <Card key={property.id} className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        onClick={() => removeFromCompare(property.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>

                      <div className="relative h-48">
                        <Image
                          src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&crop=center'}
                          alt={property.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-blue-500 text-white">
                            Property {index + 1}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                          {property.title}
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Price</span>
                            <span className="font-bold text-green-600">{formatPrice(property.price)}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Location</span>
                            <span className="text-sm">{property.city}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Bedrooms</span>
                            <span>{property.bedrooms} BHK</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Area</span>
                            <span>{property.area} {property.areaUnit}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Price/sqft</span>
                            <span>₹{Math.round(property.price / property.area).toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Score</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-bold">{getComparisonScore(property)}/100</span>
                              <Star className="w-4 h-4 text-yellow-500" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Detailed Comparison Table */}
                {compareList.length > 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3">Feature</th>
                              {compareList.map((property, index) => (
                                <th key={property.id} className="text-center p-3">
                                  Property {index + 1}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Price</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  {formatPrice(property.price)}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Price per sqft</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  ₹{Math.round(property.price / property.area).toLocaleString()}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Bedrooms</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  {property.bedrooms}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Bathrooms</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  {property.bathrooms}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Area</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  {property.area} {property.areaUnit}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Parking</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  {property.features?.includes('parking') ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Gym</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  {property.features?.includes('gym') ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr className="border-b">
                              <td className="p-3 font-medium">Swimming Pool</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  {property.features?.includes('swimming_pool') ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                  ) : (
                                    <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                                  )}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-3 font-medium">Overall Score</td>
                              {compareList.map((property) => (
                                <td key={property.id} className="text-center p-3">
                                  <div className="flex items-center justify-center space-x-1">
                                    <span className="font-bold">{getComparisonScore(property)}</span>
                                    <Star className="w-4 h-4 text-yellow-500" />
                                  </div>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {compareList.length > 1 && (
                  <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Comparison Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Best Value</h4>
                          <p className="text-sm text-gray-600">
                            Property with the lowest price per square foot offers the best value for money.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Most Features</h4>
                          <p className="text-sm text-gray-600">
                            Property with the highest number of amenities provides better lifestyle options.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Investment Potential</h4>
                          <p className="text-sm text-gray-600">
                            Consider location, connectivity, and future development plans for long-term growth.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Recommendation</h4>
                          <p className="text-sm text-gray-600">
                            Based on the comparison, we recommend the property with the highest overall score.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Start Comparing Properties
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Search and add properties to compare their features, prices, and amenities
                  </p>
                  <Button asChild>
                    <Link href="/properties">Browse Properties</Link>
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}