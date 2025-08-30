"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  TrendingUp,
  Building,
  Users,
  GraduationCap,
  Hospital,
  ShoppingCart,
  Shield,
  Zap,
  Star,
  IndianRupee,
  Home,
  Briefcase,
  Baby,
  Utensils,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

const cities = [
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

export default function AreaInsightsPage() {
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [selectedArea, setSelectedArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [areaData, setAreaData] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    fetchAreasForCity();
  }, [selectedCity]);

  const fetchAreasForCity = async () => {
    try {
      const response: any = await apiClient.getToolsAreasForCity(selectedCity);
      
      if (response.success) {
        setAreas(response.data.areas || []);
        setSelectedArea("");
        setAreaData(null);
      } else {
        toast.error(response.message || 'Failed to fetch areas');
        setAreas([]);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error('Failed to fetch areas for the selected city');
      setAreas([]);
    }
  };

  const fetchAreaInsights = async () => {
    if (!selectedArea) {
      toast.error('Please select an area first');
      return;
    }

    setLoading(true);
    try {
      const response: any = await apiClient.getToolsAreaInsights(selectedCity, selectedArea);
      
      if (response.success) {
        setAreaData(response.data);
        toast.success('Area insights loaded successfully!');
      } else {
        toast.error(response.message || 'Failed to fetch area insights');
        setAreaData(null);
      }
    } catch (error) {
      console.error("Error fetching area insights:", error);
      toast.error('Failed to fetch area insights. Please try again.');
      setAreaData(null);
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

  return (
    <>
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-20 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
              <div className="absolute -bottom-10 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-purple-600 mb-6 animate-fade-in-up">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Discover Your Perfect Neighborhood
                </div>
                <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-fade-in-up animation-delay-200">
                  Area Insights
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
                  Explore comprehensive neighborhood statistics, demographics,
                  and livability scores with beautiful data visualization
                </p>
              </div>

              {/* Filters */}
              <Card className="max-w-4xl mx-auto backdrop-blur-sm bg-white/90 border-0 shadow-2xl shadow-purple-500/10 animate-fade-in-up animation-delay-600">
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                        City
                      </label>
                      <Select
                        value={selectedCity}
                        onValueChange={setSelectedCity}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 bg-white/80">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm">
                          {cities.map((city) => (
                            <SelectItem
                              key={city}
                              value={city}
                              className="hover:bg-purple-50"
                            >
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                                {city}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-purple-600 transition-colors duration-200">
                        Area/Locality
                      </label>
                      <Select
                        value={selectedArea}
                        onValueChange={setSelectedArea}
                        disabled={areas.length === 0}
                      >
                        <SelectTrigger className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-all duration-200 bg-white/80 disabled:opacity-50">
                          <SelectValue placeholder={areas.length === 0 ? "Loading areas..." : "Select area"} />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-sm">
                          {areas.map((area) => (
                            <SelectItem
                              key={area}
                              value={area}
                              className="hover:bg-purple-50"
                            >
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        onClick={fetchAreaInsights}
                        disabled={!selectedArea || loading}
                        className="w-full h-12 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                            Analyzing...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            Get Insights
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                          </div>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Results Section */}
          {areaData && (
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <Card className="group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-purple-50/30 animate-fade-in-up">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2 group-hover:text-purple-600 transition-colors duration-200">
                            Avg Price/sqft
                          </p>
                          <p className="text-3xl font-bold text-purple-600 mb-1">
                            ₹{areaData.overview.avgPrice.toLocaleString()}
                          </p>
                          <div className="flex items-center">
                            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                            <p className="text-sm text-green-600 font-medium">
                              +{areaData.overview.growth}% YoY
                            </p>
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 group-hover:scale-110">
                          <IndianRupee className="w-7 h-7 text-purple-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-2xl hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-green-50/30 animate-fade-in-up animation-delay-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2 group-hover:text-green-600 transition-colors duration-200">
                            Livability Score
                          </p>
                          <p className="text-3xl font-bold text-green-600 mb-1">
                            {areaData.livabilityScore.overall}/100
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            Excellent
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 group-hover:scale-110">
                          <Star className="w-7 h-7 text-green-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-blue-50/30 animate-fade-in-up animation-delay-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                            Safety Rating
                          </p>
                          <p className="text-3xl font-bold text-blue-600 mb-1">
                            {areaData.overview.safety}/100
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            Very Safe
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 group-hover:scale-110">
                          <Shield className="w-7 h-7 text-blue-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-orange-50/30 animate-fade-in-up animation-delay-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2 group-hover:text-orange-600 transition-colors duration-200">
                            Population
                          </p>
                          <p className="text-3xl font-bold text-orange-600 mb-1">
                            {(areaData.overview.population / 1000).toFixed(0)}K
                          </p>
                          <p className="text-sm text-gray-500 font-medium">
                            Residents
                          </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 group-hover:from-orange-200 group-hover:to-orange-300 transition-all duration-300 group-hover:scale-110">
                          <Users className="w-7 h-7 text-orange-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Price Analysis */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <Card className="group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/20 animate-fade-in-up animation-delay-400">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                          <Home className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                          Residential Pricing
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {areaData.priceAnalysis.residential.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className="group/item flex items-center justify-between p-4 bg-gradient-to-r from-white to-purple-50/50 rounded-xl border border-purple-100/50 hover:border-purple-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                            >
                              <div>
                                <span className="font-semibold text-gray-900 group-hover/item:text-purple-700 transition-colors duration-200">
                                  {item.type}
                                </span>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.range}
                                </p>
                              </div>
                              <span className="font-bold text-xl text-purple-600">
                                {formatPrice(item.avgPrice)}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/20 animate-fade-in-up animation-delay-500">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                          <Briefcase className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Commercial Rates
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {areaData.priceAnalysis.commercial.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className="group/item flex items-center justify-between p-4 bg-gradient-to-r from-white to-blue-50/50 rounded-xl border border-blue-100/50 hover:border-blue-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                            >
                              <span className="font-semibold text-gray-900 group-hover/item:text-blue-700 transition-colors duration-200">
                                {item.type}
                              </span>
                              <span className="font-bold text-xl text-blue-600">
                                ₹{item.rate.toLocaleString()}/{item.unit}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <Card className="group hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/20 animate-fade-in-up animation-delay-600">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Age Demographics
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-4 border border-blue-100/50">
                        <ResponsiveContainer width="100%" height={280}>
                          <PieChart>
                            <Pie
                              data={areaData.demographics.ageGroups}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={110}
                              paddingAngle={3}
                              dataKey="value"
                            >
                              {areaData.demographics.ageGroups.map(
                                (entry: any, index: number) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip
                              formatter={(value: any) => `${value}%`}
                              contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                border: "none",
                                borderRadius: "12px",
                                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                                backdropFilter: "blur(10px)",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-3">
                        {areaData.demographics.ageGroups.map(
                          (item: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center p-2 rounded-lg hover:bg-blue-50/50 transition-colors duration-200"
                            >
                              <div
                                className="w-4 h-4 rounded-full mr-3 shadow-sm"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {item.name}:{" "}
                                <span className="font-bold text-gray-900">
                                  {item.value}%
                                </span>
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-pink-50/20 animate-fade-in-up animation-delay-700">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-pink-100 to-pink-200 group-hover:from-pink-200 group-hover:to-pink-300 transition-all duration-300">
                          <Baby className="w-6 h-6 text-pink-600" />
                        </div>
                        <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                          Family Types
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {areaData.demographics.familyTypes.map(
                          (family: any, index: number) => (
                            <div key={index} className="group/family">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-gray-700 group-hover/family:text-pink-600 transition-colors duration-200">
                                  {family.name}
                                </span>
                                <span className="text-lg font-bold text-pink-600">
                                  {family.percentage}%
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full h-3 bg-pink-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${family.percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Infrastructure & Amenities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <Card className="group hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-yellow-50/20 animate-fade-in-up animation-delay-800">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-200 group-hover:from-yellow-200 group-hover:to-yellow-300 transition-all duration-300">
                          <Zap className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                          Infrastructure Quality
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="group/infra">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700 group-hover/infra:text-yellow-600 transition-colors duration-200">
                              Electricity
                            </span>
                            <span className="text-lg font-bold text-yellow-600">
                              {areaData.infrastructure.utilities.electricity}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-3 bg-yellow-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${areaData.infrastructure.utilities.electricity}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="group/infra">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700 group-hover/infra:text-blue-600 transition-colors duration-200">
                              Water Supply
                            </span>
                            <span className="text-lg font-bold text-blue-600">
                              {areaData.infrastructure.utilities.water}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${areaData.infrastructure.utilities.water}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="group/infra">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700 group-hover/infra:text-purple-600 transition-colors duration-200">
                              Internet
                            </span>
                            <span className="text-lg font-bold text-purple-600">
                              {areaData.infrastructure.utilities.internet}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${areaData.infrastructure.utilities.internet}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="group/infra">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-semibold text-gray-700 group-hover/infra:text-green-600 transition-colors duration-200">
                              Waste Management
                            </span>
                            <span className="text-lg font-bold text-green-600">
                              {areaData.infrastructure.utilities.waste}%
                            </span>
                          </div>
                          <div className="relative">
                            <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${areaData.infrastructure.utilities.waste}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-indigo-50/20 animate-fade-in-up animation-delay-900">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-3 text-xl font-bold">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 group-hover:from-indigo-200 group-hover:to-indigo-300 transition-all duration-300">
                          <Building className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Amenities Overview
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="group/amenity text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 hover:border-blue-300 hover:shadow-lg transition-all duration-200 hover:scale-105">
                          <GraduationCap className="w-8 h-8 text-blue-500 mx-auto mb-3 group-hover/amenity:scale-110 transition-transform duration-200" />
                          <div className="font-bold text-2xl text-gray-900 mb-1">
                            {areaData.amenities.education.schools}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Schools
                          </div>
                        </div>
                        <div className="group/amenity text-center p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl border border-red-200/50 hover:border-red-300 hover:shadow-lg transition-all duration-200 hover:scale-105">
                          <Hospital className="w-8 h-8 text-red-500 mx-auto mb-3 group-hover/amenity:scale-110 transition-transform duration-200" />
                          <div className="font-bold text-2xl text-gray-900 mb-1">
                            {areaData.amenities.healthcare.hospitals}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Hospitals
                          </div>
                        </div>
                        <div className="group/amenity text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl border border-green-200/50 hover:border-green-300 hover:shadow-lg transition-all duration-200 hover:scale-105">
                          <ShoppingCart className="w-8 h-8 text-green-500 mx-auto mb-3 group-hover/amenity:scale-110 transition-transform duration-200" />
                          <div className="font-bold text-2xl text-gray-900 mb-1">
                            {areaData.amenities.shopping.malls}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Malls
                          </div>
                        </div>
                        <div className="group/amenity text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/50 hover:border-orange-300 hover:shadow-lg transition-all duration-200 hover:scale-105">
                          <Utensils className="w-8 h-8 text-orange-500 mx-auto mb-3 group-hover/amenity:scale-110 transition-transform duration-200" />
                          <div className="font-bold text-2xl text-gray-900 mb-1">
                            {areaData.amenities.recreation.restaurants}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            Restaurants
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Price Trends */}
                <Card className="mb-12 group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50/20 animate-fade-in-up animation-delay-600">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300">
                        <TrendingUp className="w-7 h-7 text-purple-600" />
                      </div>
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        Price History - {areaData.overview.name}
                      </span>
                    </CardTitle>
                    <p className="text-gray-600 mt-2 ml-14">
                      Track property price movements over the past year
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl p-6 border border-purple-100/50">
                      <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={areaData.trends.priceHistory}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            strokeOpacity={0.5}
                          />
                          <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#6b7280", fontSize: 12 }}
                          />
                          <Tooltip
                            formatter={(value: any) => [
                              `₹${value.toLocaleString()}/sqft`,
                              "Price",
                            ]}
                            contentStyle={{
                              backgroundColor: "rgba(255, 255, 255, 0.95)",
                              border: "none",
                              borderRadius: "12px",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                              backdropFilter: "blur(10px)",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="url(#priceGradient)"
                            strokeWidth={4}
                            dot={{ fill: "#8b5cf6", strokeWidth: 3, r: 6 }}
                            activeDot={{
                              r: 8,
                              stroke: "#8b5cf6",
                              strokeWidth: 3,
                              fill: "#ffffff",
                            }}
                          />
                          <defs>
                            <linearGradient
                              id="priceGradient"
                              x1="0"
                              y1="0"
                              x2="1"
                              y2="0"
                            >
                              <stop offset="0%" stopColor="#8b5cf6" />
                              <stop offset="100%" stopColor="#3b82f6" />
                            </linearGradient>
                          </defs>
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Livability Score */}
                <Card className="group hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white to-green-50/20 animate-fade-in-up animation-delay-700">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center space-x-3 text-2xl font-bold">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300">
                        <Star className="w-7 h-7 text-green-600" />
                      </div>
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Livability Score Breakdown
                      </span>
                    </CardTitle>
                    <p className="text-gray-600 mt-2 ml-14">
                      Comprehensive analysis of neighborhood quality factors
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl p-6 border border-green-100/50">
                        <ResponsiveContainer width="100%" height={320}>
                          <RadarChart data={areaData.livabilityScore.factors}>
                            <PolarGrid stroke="#e5e7eb" strokeOpacity={0.5} />
                            <PolarAngleAxis
                              dataKey="name"
                              tick={{ fill: "#6b7280", fontSize: 12 }}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              domain={[0, 100]}
                              tick={false}
                              axisLine={false}
                            />
                            <Radar
                              name="Score"
                              dataKey="score"
                              stroke="url(#radarGradient)"
                              fill="url(#radarFillGradient)"
                              fillOpacity={0.2}
                              strokeWidth={3}
                              dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                            />
                            <defs>
                              <linearGradient
                                id="radarGradient"
                                x1="0"
                                y1="0"
                                x2="1"
                                y2="1"
                              >
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#059669" />
                              </linearGradient>
                              <radialGradient id="radarFillGradient">
                                <stop
                                  offset="0%"
                                  stopColor="#10b981"
                                  stopOpacity={0.3}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#059669"
                                  stopOpacity={0.1}
                                />
                              </radialGradient>
                            </defs>
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-6">
                        {areaData.livabilityScore.factors.map(
                          (factor: any, index: number) => (
                            <div key={index} className="group/factor">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-gray-700 group-hover/factor:text-green-600 transition-colors duration-200">
                                  {factor.name}
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  {factor.score}/{factor.max}
                                </span>
                              </div>
                              <div className="relative">
                                <div className="w-full h-3 bg-green-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 ease-out"
                                    style={{
                                      width: `${
                                        (factor.score / factor.max) * 100
                                      }%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* Default State */}
          {!areaData && !loading && (
            <section className="py-20 bg-gradient-to-b from-white to-gray-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="h-96 flex items-center justify-center border-0 bg-gradient-to-br from-white to-purple-50/30 shadow-2xl shadow-purple-500/10 animate-fade-in-up">
                  <div className="text-center">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      <MapPin className="relative w-20 h-20 text-purple-500 mx-auto animate-bounce" />
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                      Ready to Explore?
                    </h3>
                    <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                      Select a city and area above to discover comprehensive
                      neighborhood statistics, demographics, and insights
                    </p>
                    <div className="mt-8 flex justify-center space-x-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        Livability Scores
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                        Price Trends
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1 text-blue-400" />
                        Demographics
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </section>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
