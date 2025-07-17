"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, Star, IndianRupee, ChevronDown } from 'lucide-react';
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
    priceRange: '',
    minPrice: '',
    maxPrice: '',
    customPrice: false
  });

  // Price ranges based on property type
  const getPriceRanges = () => {
    if (searchForm.type === 'rent') {
      return [
        { label: '₹5K - ₹15K', value: '5000-15000' },
        { label: '₹15K - ₹25K', value: '15000-25000' },
        { label: '₹25K - ₹50K', value: '25000-50000' },
        { label: '₹50K - ₹75K', value: '50000-75000' },
        { label: '₹75K - ₹1L', value: '75000-100000' },
        { label: '₹1L - ₹2L', value: '100000-200000' },
        { label: '₹2L+', value: '200000-10000000' },
        { label: 'Custom Range', value: 'custom' }
      ];
    } else {
      return [
        { label: '₹10L - ₹25L', value: '1000000-2500000' },
        { label: '₹25L - ₹50L', value: '2500000-5000000' },
        { label: '₹50L - ₹75L', value: '5000000-7500000' },
        { label: '₹75L - ₹1Cr', value: '7500000-10000000' },
        { label: '₹1Cr - ₹2Cr', value: '10000000-20000000' },
        { label: '₹2Cr - ₹5Cr', value: '20000000-50000000' },
        { label: '₹5Cr+', value: '50000000-1000000000' },
        { label: 'Custom Range', value: 'custom' }
      ];
    }
  };

  const handlePriceRangeChange = (value:any) => {
    setSearchForm(prev => ({ 
      ...prev, 
      priceRange: value,
      customPrice: value === 'custom',
      minPrice: value === 'custom' ? prev.minPrice : '',
      maxPrice: value === 'custom' ? prev.maxPrice : ''
    }));
  };

  const formatPriceLabel = () => {
    if (searchForm.customPrice) {
      return 'Custom Range';
    }
    if (searchForm.priceRange) {
      const range = getPriceRanges().find(r => r.value === searchForm.priceRange);
      return range ? range.label : 'Price Range';
    }
    return 'Price Range';
  };

  const handleSearch = () => {
    const params:any = new URLSearchParams();
    Object.entries(searchForm).forEach(([key, value]) => {
      if (value && key !== 'customPrice') params.append(key, value);
    });
    
    let minPrice = 0;
    let maxPrice = 100000000;
    
    if (searchForm.customPrice) {
      minPrice = searchForm.minPrice ? parseInt(searchForm.minPrice) : 0;
      maxPrice = searchForm.maxPrice ? parseInt(searchForm.maxPrice) : 100000000;
    } else if (searchForm.priceRange) {
      const [min, max] = searchForm.priceRange.split('-').map(p => parseInt(p));
      minPrice = min;
      maxPrice = max;
    }
    
    updateSearchFilters({
      type: searchForm.type,
      city: searchForm.city,
      area: searchForm.location,
      bedrooms: searchForm.bhk,
      minPrice,
      maxPrice
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
        <Card className="max-w-6xl mx-auto p-6 shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Property Type Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            {PROPERTY_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSearchForm(prev => ({ 
                  ...prev, 
                  type: type.value, 
                  priceRange: '',
                  customPrice: false,
                  minPrice: '',
                  maxPrice: ''
                }))}
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
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* City Selection */}
            <div className="md:col-span-3">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Select value={searchForm.city} onValueChange={(value) => 
                  setSearchForm(prev => ({ ...prev, city: value }))
                }>
                  <SelectTrigger className="pl-10 h-12 bg-white border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-red-500/20">
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
            <div className="md:col-span-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Input
                  placeholder="Locality, landmark, project..."
                  value={searchForm.location}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10 h-12 bg-white border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>
            </div>

            {/* BHK Selection */}
            <div className="md:col-span-2">
              <Select value={searchForm.bhk} onValueChange={(value) => 
                setSearchForm(prev => ({ ...prev, bhk: value }))
              }>
                <SelectTrigger className="h-12 bg-white border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-red-500/20">
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

            {/* Price Range */}
            <div className="md:col-span-2">
              <div className="relative">
                <IndianRupee className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                <Select value={searchForm.priceRange} onValueChange={handlePriceRangeChange}>
                  <SelectTrigger className="pl-10 h-12 bg-white border-gray-200 hover:border-gray-300 focus:border-red-500 focus:ring-red-500/20">
                    <SelectValue placeholder="Price Range">
                      {formatPriceLabel()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {getPriceRanges().map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2">
              <Button 
                onClick={handleSearch}
                className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Custom Price Range Inputs */}
          {searchForm.customPrice && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price ({searchForm.type === 'rent' ? '₹/month' : '₹'})
                </label>
                <Input
                  placeholder={searchForm.type === 'rent' ? 'e.g., 5000' : 'e.g., 1000000'}
                  value={searchForm.minPrice}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, minPrice: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                  type="number"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price ({searchForm.type === 'rent' ? '₹/month' : '₹'})
                </label>
                <Input
                  placeholder={searchForm.type === 'rent' ? 'e.g., 50000' : 'e.g., 5000000'}
                  value={searchForm.maxPrice}
                  onChange={(e) => setSearchForm(prev => ({ ...prev, maxPrice: e.target.value }))}
                  className="h-10 bg-white border-gray-200 focus:border-red-500 focus:ring-red-500/20"
                  type="number"
                />
              </div>
              <div className="md:col-span-1 flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => setSearchForm(prev => ({ 
                    ...prev, 
                    customPrice: false, 
                    priceRange: '', 
                    minPrice: '', 
                    maxPrice: '' 
                  }))}
                  className="w-full h-10 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900"
                >
                  Clear Custom
                </Button>
              </div>
            </div>
          )}

          
        </Card>
      </div>
    </section>
  );
}