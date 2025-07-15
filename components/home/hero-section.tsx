"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, Star } from 'lucide-react';
import { PROPERTY_TYPES, CITIES, BHK_OPTIONS } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { useSearchStore } from '@/lib/store';

export function HeroSection() {
  const router = useRouter();
  const { updateSearchFilters } = useSearchStore();
  const [searchForm, setSearchForm] = useState({
    type: 'sell',
    city: '',
    location: '',
    bhk: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    updateSearchFilters({
      type: searchForm.type,
      city: searchForm.city,
      area: searchForm.location,
      bedrooms: searchForm.bhk,
      minPrice: searchForm.minPrice ? parseInt(searchForm.minPrice) : 0,
      maxPrice: searchForm.maxPrice ? parseInt(searchForm.maxPrice) : 100000000
    });
    
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-r from-gray-50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Badge variant="outline" className="text-red-500 border-red-200 bg-red-50">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Trusted by 1000+ customers
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your
            <span className="text-red-500 block">Dream Home</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover exceptional properties with our AI-powered search. 
            Your perfect home is just a few clicks away.
          </p>
        </div>

        {/* Advanced Search Card */}
        <Card className="max-w-5xl mx-auto p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Property Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSearchForm(prev => ({ ...prev, type: type.value }))}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  searchForm.type === type.value
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* City Selection */}
            <div className="md:col-span-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Select value={searchForm.city} onValueChange={(value) => 
                  setSearchForm(prev => ({ ...prev, city: value }))
                }>
                  <SelectTrigger className="pl-10 h-12">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for locality, landmark, project or builder"
                  value={searchForm.location}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            {/* BHK Selection */}
            <div>
              <Select value={searchForm.bhk} onValueChange={(value) => 
                setSearchForm(prev => ({ ...prev, bhk: value }))
              }>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="BHK" />
                </SelectTrigger>
                <SelectContent>
                  {BHK_OPTIONS.map((bhk) => (
                    <SelectItem key={bhk.value} value={bhk.value}>
                      {bhk.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <div>
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap items-center justify-between mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Min Price"
                value={searchForm.minPrice}
                onChange={(e) => setSearchForm(prev => ({ ...prev, minPrice: e.target.value }))}
                className="w-32"
                type="number"
              />
              <Input
                placeholder="Max Price"
                value={searchForm.maxPrice}
                onChange={(e) => setSearchForm(prev => ({ ...prev, maxPrice: e.target.value }))}
                className="w-32"
                type="number"
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}