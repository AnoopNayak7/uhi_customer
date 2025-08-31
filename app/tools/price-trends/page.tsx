"use client";

import { useState, useEffect, useCallback } from "react";
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

import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Building,
  Home,
  TreePine,
  Briefcase,
  Store,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Minus,
  Star,
  Target,
  Zap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { PageContent } from "@/components/animations/layout-wrapper";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
import { apiClient } from "@/lib/api";

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

const propertyTypes = [
  { value: "flats", label: "Apartment/Flat", icon: Building },
  { value: "houses", label: "Independent House", icon: Home },
  { value: "villas", label: "Villa", icon: Home },
  // { value: "plots", label: "Plot/Land", icon: TreePine },
  // { value: "offices", label: "Office Space", icon: Briefcase },
  // { value: "shops", label: "Shop/Retail", icon: Store },
];

const timeRanges = [
  { value: "1y", label: "Last 1 Year" },
  { value: "3y", label: "Last 3 Year" },
  { value: "5y", label: "Last 5 Years" },
  { value: "10y", label: "Last 10 Years" },
];

interface PriceTrendData {
  cityName: string;
  propertyType: string;
  timeRange: string;
  averagePricePerSqft: number;
  priceGrowth: number;
  marketStatus: string;
  bestAction: string;
  priceTrendGraph: Array<{
    year: string;
    price: number;
    growth: number;
    dataPoints: number;
  }>;
  topPerformingAreas: Array<{
    rank: number;
    name: string;
    zone: string;
    currentPrice: number;
    growthRate: number;
    coordinates: [number, number];
    highlights: string[];
    trendIndicator: string;
  }>;
  marketInsights: Array<{
    type: string;
    title: string;
    description: string;
    impact: string;
  }>;
  totalLocations: number;
  dataQuality: string;
  lastUpdated: string;
  areaPerformanceGraph?: Array<{
    areaName: string;
    currentPrice: number;
    growthRate: number;
    volatility: number;
  }>;
}

export default function PriceTrendsPage() {
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [selectedPropertyType, setSelectedPropertyType] = useState("villas");
  const [selectedTimeRange, setSelectedTimeRange] = useState("5y");
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<PriceTrendData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPriceTrends();
  }, [selectedCity, selectedPropertyType, selectedTimeRange]);

  const fetchPriceTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      // Map frontend property types to backend property types
      const propertyTypeMap: { [key: string]: string } = {
        flats: "apartments",
        houses: "independent_houses",
        villas: "villas",
        plots: "all",
        offices: "all",
        shops: "all",
      };

      const backendPropertyType =
        propertyTypeMap[selectedPropertyType] || "all";

      // Convert city name to lowercase for backend API
      const backendCityName = selectedCity.toLowerCase();

      console.log("Fetching price trends with:", {
        city: backendCityName,
        propertyType: backendPropertyType,
        timeRange: selectedTimeRange,
      });

      const response: any = await apiClient.getToolsPriceTrends(
        backendCityName,
        backendPropertyType,
        selectedTimeRange
      );

      console.log("API Response:", response);

      if (response.success) {
        console.log("Trend data received:", response.data);
        console.log("Price trend graph:", response.data.priceTrendGraph);

        // Always set the trend data if API succeeds, even if chart data is empty
        setTrendData(response.data);

        // Show warning if no chart data, but don't prevent other sections from showing
        if (
          !response.data.priceTrendGraph ||
          response.data.priceTrendGraph.length === 0
        ) {
          console.warn(
            "API returned empty priceTrendGraph, chart will show no data message"
          );
        }
      } else {
        setError(response.message || "Failed to fetch price trends");
      }
    } catch (error) {
      console.error("Error fetching price trends:", error);
      setError("Failed to fetch price trends. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load data only once when component mounts with default values
  useEffect(() => {
    fetchPriceTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - runs only once on mount

  const selectedPropertyTypeData = propertyTypes.find(
    (type) => type.value === selectedPropertyType
  );

  // Custom modern tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-xl p-4 min-w-[200px]"
          style={{
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div className="space-y-3">
            {/* Header with year */}
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-semibold text-gray-900">
                {label}
              </span>
            </div>

            {/* Price information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">
                  Price per sqft
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm"></div>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{payload[0].value.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Growth indicator */}
              {payload[0].payload.growth !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    Annual Growth
                  </span>
                  <div className="flex items-center space-x-1">
                    {payload[0].payload.growth >= 0 ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs font-semibold ${
                        payload[0].payload.growth >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {payload[0].payload.growth >= 0 ? "+" : ""}
                      {payload[0].payload.growth}%
                    </span>
                  </div>
                </div>
              )}

              {/* Data points */}
              {payload[0].payload.dataPoints && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    Data Points
                  </span>
                  <span className="text-xs font-semibold text-gray-700">
                    {payload[0].payload.dataPoints}
                  </span>
                </div>
              )}
            </div>

            {/* Property type indicator */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                {selectedPropertyTypeData && (
                  <>
                    <selectedPropertyTypeData.icon className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-500 font-medium">
                      {selectedPropertyTypeData.label} in {selectedCity}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageContent>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <MotionWrapper variant="fadeInUp" className="text-center mb-8">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Property Price Trends
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Track real estate price movements and market trends across
                  major Indian cities
                </motion.p>
              </MotionWrapper>

              {/* Filters */}
              <MotionWrapper variant="slideInUp" delay={0.6}>
                <Card className="max-w-4xl mx-auto">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          City
                        </Label>
                        <Select
                          value={selectedCity}
                          onValueChange={setSelectedCity}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {city}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                      >
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Property Type
                        </Label>
                        <Select
                          value={selectedPropertyType}
                          onValueChange={setSelectedPropertyType}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center">
                                  <type.icon className="w-4 h-4 mr-2" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                      >
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          Time Range
                        </Label>
                        <Select
                          value={selectedTimeRange}
                          onValueChange={setSelectedTimeRange}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timeRanges.map((range) => (
                              <SelectItem key={range.value} value={range.value}>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {range.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        className="flex items-end"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full"
                        >
                          <Button
                            onClick={fetchPriceTrends}
                            disabled={loading}
                            className="w-full bg-blue-500 hover:bg-blue-600"
                          >
                            <motion.span
                              animate={
                                loading
                                  ? { opacity: [1, 0.5, 1] }
                                  : { opacity: 1 }
                              }
                              transition={
                                loading ? { duration: 1, repeat: Infinity } : {}
                              }
                            >
                              {loading ? "Loading..." : "Update Trends"}
                            </motion.span>
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>
            </div>
          </section>

          {/* Error State */}
          {error && (
            <motion.section
              className="py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <TrendingDown className="w-6 h-6 text-red-500" />
                      <h3 className="text-lg font-semibold text-red-800">
                        Error Loading Data
                      </h3>
                    </div>
                    <p className="text-red-700 mb-4">{error}</p>
                    <Button
                      onClick={fetchPriceTrends}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          )}

          {/* Results Section */}
          <AnimatePresence>
            {trendData && (
              <motion.section
                className="py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Overview Cards */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Average Price/sqft
                              </p>
                              <motion.p
                                className="text-2xl font-bold text-gray-900"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.5,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              >
                                ₹
                                {trendData.averagePricePerSqft.toLocaleString()}
                              </motion.p>
                            </div>
                            <motion.div
                              className="p-3 rounded-full bg-blue-50"
                              initial={{ rotate: -180, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{
                                delay: 0.6,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              {selectedPropertyTypeData && (
                                <selectedPropertyTypeData.icon className="w-6 h-6 text-blue-500" />
                              )}
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Price Growth
                              </p>
                              <motion.p
                                className={`text-2xl font-bold ${
                                  trendData.priceGrowth >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.6,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              >
                                {trendData.priceGrowth >= 0 ? "+" : ""}
                                {trendData.priceGrowth.toFixed(1)}%
                              </motion.p>
                            </div>
                            <motion.div
                              className={`p-3 rounded-full ${
                                trendData.priceGrowth >= 0
                                  ? "bg-green-50"
                                  : "bg-red-50"
                              }`}
                              initial={{ rotate: -180, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{
                                delay: 0.7,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              {trendData.priceGrowth >= 0 ? (
                                <TrendingUp className="w-6 h-6 text-green-500" />
                              ) : (
                                <TrendingDown className="w-6 h-6 text-red-500" />
                              )}
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Market Status
                              </p>
                              <motion.p
                                className={`text-lg font-bold ${
                                  trendData.marketStatus === "Hot Market"
                                    ? "text-green-600"
                                    : trendData.marketStatus === "Cold Market"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.7,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              >
                                {trendData.marketStatus}
                              </motion.p>
                            </div>
                            <motion.div
                              className="p-3 rounded-full bg-gray-50"
                              initial={{ rotate: -180, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{
                                delay: 0.8,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              <BarChart3 className="w-6 h-6 text-gray-600" />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 mb-1">
                                Best Action
                              </p>
                              <motion.p
                                className="text-lg font-bold text-blue-600"
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.8,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              >
                                {trendData.bestAction}
                              </motion.p>
                            </div>
                            <motion.div
                              className="p-3 rounded-full bg-blue-50"
                              initial={{ rotate: -180, scale: 0 }}
                              animate={{ rotate: 0, scale: 1 }}
                              transition={{
                                delay: 0.9,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              <Target className="w-6 h-6 text-blue-500" />
                            </motion.div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>

                  {/* Price Trend Chart */}
                  <MotionWrapper variant="slideInUp" delay={1.0}>
                    <Card className="mb-8">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <TrendingUp className="w-5 h-5" />
                          <span>
                            Price Trend - {trendData.cityName} (
                            {selectedPropertyTypeData?.label})
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {trendData.priceTrendGraph &&
                        trendData.priceTrendGraph.length > 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.2, duration: 0.5 }}
                            className="relative"
                          >
                            {/* Chart background with subtle gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 rounded-lg -m-2"></div>

                            <ResponsiveContainer width="100%" height={400}>
                              <LineChart
                                data={trendData.priceTrendGraph}
                                margin={{
                                  top: 20,
                                  right: 30,
                                  left: 20,
                                  bottom: 20,
                                }}
                              >
                                {/* Modern grid with subtle styling */}
                                <CartesianGrid
                                  strokeDasharray="2 4"
                                  stroke="#e2e8f0"
                                  strokeOpacity={0.6}
                                  horizontal={true}
                                  vertical={false}
                                />

                                {/* Enhanced X-axis */}
                                <XAxis
                                  dataKey="year"
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fontSize: 12,
                                    fill: "#64748b",
                                    fontWeight: 500,
                                  }}
                                  dy={10}
                                />

                                {/* Enhanced Y-axis */}
                                <YAxis
                                  axisLine={false}
                                  tickLine={false}
                                  tick={{
                                    fontSize: 12,
                                    fill: "#64748b",
                                    fontWeight: 500,
                                  }}
                                  tickFormatter={(value) =>
                                    `₹${(value / 1000).toFixed(0)}K`
                                  }
                                  dx={-10}
                                />

                                {/* Gradient definitions */}
                                <defs>
                                  <linearGradient
                                    id="priceGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                  >
                                    <stop
                                      offset="0%"
                                      stopColor="#3b82f6"
                                      stopOpacity={0.3}
                                    />
                                    <stop
                                      offset="50%"
                                      stopColor="#3b82f6"
                                      stopOpacity={0.1}
                                    />
                                    <stop
                                      offset="100%"
                                      stopColor="#3b82f6"
                                      stopOpacity={0.05}
                                    />
                                  </linearGradient>
                                  <linearGradient
                                    id="lineGradient"
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                  >
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="50%" stopColor="#1d4ed8" />
                                    <stop offset="100%" stopColor="#1e40af" />
                                  </linearGradient>
                                  <filter id="glow">
                                    <feGaussianBlur
                                      stdDeviation="3"
                                      result="coloredBlur"
                                    />
                                    <feMerge>
                                      <feMergeNode in="coloredBlur" />
                                      <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                  </filter>
                                </defs>

                                {/* Area fill for gradient effect */}
                                <Area
                                  type="monotone"
                                  dataKey="price"
                                  stroke="none"
                                  fill="url(#priceGradient)"
                                  fillOpacity={1}
                                />

                                {/* Custom tooltip */}
                                <Tooltip content={<CustomTooltip />} />

                                {/* Main price line with gradient and glow */}
                                <Line
                                  type="monotone"
                                  dataKey="price"
                                  stroke="url(#lineGradient)"
                                  strokeWidth={4}
                                  dot={{
                                    fill: "#ffffff",
                                    stroke: "#3b82f6",
                                    strokeWidth: 3,
                                    r: 6,
                                    filter: "url(#glow)",
                                  }}
                                  activeDot={{
                                    r: 8,
                                    fill: "#3b82f6",
                                    stroke: "#ffffff",
                                    strokeWidth: 3,
                                    filter: "url(#glow)",
                                  }}
                                  animationDuration={2000}
                                  animationEasing="ease-out"
                                />
                              </LineChart>
                            </ResponsiveContainer>

                            {/* Chart legend */}
                            <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                                <span className="text-gray-600 font-medium">
                                  Price per sqft
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-600 font-medium">
                                  Annual Growth
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-center py-16 text-gray-500">
                            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">
                              No chart data available
                            </p>
                            <p className="text-sm">
                              Please try different filters or check back later
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </MotionWrapper>

                  {/* Top Performing Areas */}
                  <MotionWrapper variant="slideInUp" delay={1.4}>
                    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
                      <CardHeader className="pb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                              <Star className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-900">
                                Top Performing Areas
                              </CardTitle>
                              <p className="text-sm text-gray-500 mt-1">
                                Best performing localities in{" "}
                                {trendData.cityName}
                              </p>
                            </div>
                          </div>
                          <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Price per sqft</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full ml-3"></div>
                            <span>Growth %</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {trendData.topPerformingAreas.map((area, index) => (
                            <motion.div
                              key={index}
                              className="group relative bg-white/70 backdrop-blur-sm border border-gray-100/50 rounded-2xl p-6 hover:bg-white hover:border-blue-200/50 transition-all duration-300 hover:shadow-xl"
                              initial={{ opacity: 0, y: 20, scale: 0.9 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ delay: 1.6 + index * 0.1 }}
                              whileHover={{
                                scale: 1.03,
                                y: -4,
                              }}
                            >
                              {/* Area name with ranking */}
                              <div className="flex items-center justify-between mb-4">
                                <motion.h4
                                  className="font-bold text-gray-900 text-lg leading-tight"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1.8 + index * 0.1 }}
                                >
                                  {area.name}
                                </motion.h4>
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                  <span className="text-white font-bold text-sm">
                                    {area.rank}
                                  </span>
                                </div>
                              </div>

                              {/* Zone */}
                              <motion.div
                                className="mb-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.9 + index * 0.1 }}
                              >
                                <div className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50/50">
                                  <MapPin className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-600">
                                    {area.zone}
                                  </span>
                                </div>
                              </motion.div>

                              {/* Price highlight */}
                              <motion.div
                                className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.0 + index * 0.1 }}
                              >
                                <div className="text-xs text-blue-600 font-medium mb-1">
                                  Current Price per sqft
                                </div>
                                <div className="text-2xl font-bold text-blue-700">
                                  ₹{area.currentPrice.toLocaleString()}
                                </div>
                              </motion.div>

                              {/* Growth indicator */}
                              <motion.div
                                className="mb-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.1 + index * 0.1 }}
                              >
                                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                                  <span className="text-sm font-medium text-gray-600">
                                    Growth Rate
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    {area.growthRate >= 0 ? (
                                      <TrendingUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4 text-red-500" />
                                    )}
                                    <span
                                      className={`font-bold text-base ${
                                        area.growthRate >= 0
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {area.growthRate >= 0 ? "+" : ""}
                                      {area.growthRate}%
                                    </span>
                                  </div>
                                </div>
                              </motion.div>

                              {/* Highlights */}
                              <motion.div
                                className="mb-4"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.2 + index * 0.1 }}
                              >
                                <div className="space-y-2">
                                  <span className="text-sm font-medium text-gray-600">
                                    Highlights:
                                  </span>
                                  <div className="flex flex-wrap gap-1">
                                    {area.highlights.map((highlight, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                                      >
                                        {highlight}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>

                              {/* Trend indicator */}
                              <motion.div
                                className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 2.3 + index * 0.1 }}
                              >
                                <span className="text-sm font-medium text-gray-600">
                                  Trend
                                </span>
                                <div className="flex items-center space-x-2">
                                  {area.trendIndicator === "rising" ? (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                  )}
                                  <span
                                    className={`text-sm font-semibold capitalize ${
                                      area.trendIndicator === "rising"
                                        ? "text-green-600"
                                        : "text-red-600"
                                    }`}
                                  >
                                    {area.trendIndicator}
                                  </span>
                                </div>
                              </motion.div>

                              {/* Hover indicator */}
                              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              </div>

                              {/* Growth bar indicator */}
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 rounded-b-2xl overflow-hidden">
                                <motion.div
                                  className={`h-full ${
                                    area.growthRate >= 0
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${Math.min(
                                      Math.abs(area.growthRate) * 3,
                                      100
                                    )}%`,
                                  }}
                                  transition={{
                                    delay: 2.4 + index * 0.1,
                                    duration: 0.8,
                                  }}
                                />
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </MotionWrapper>

                  {/* Market Insights */}
                  <MotionWrapper variant="fadeInUp" delay={2.0}>
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
                      <CardHeader className="pb-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                              Market Insights
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                              Key trends and analysis for {trendData.cityName}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-6">
                          {trendData.marketInsights.map((insight, index) => (
                            <motion.div
                              key={index}
                              className="group relative"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 2.2 + index * 0.2 }}
                            >
                              <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/60 border border-gray-100/50 hover:bg-white/80 hover:border-blue-200/50 transition-all duration-300 hover:shadow-md">
                                <motion.div
                                  className="relative flex-shrink-0 mt-0.5"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: 2.3 + index * 0.2,
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                                      insight.impact === "high"
                                        ? "bg-gradient-to-br from-red-500 to-red-600"
                                        : insight.impact === "medium"
                                        ? "bg-gradient-to-br from-yellow-500 to-orange-600"
                                        : "bg-gradient-to-br from-green-500 to-green-600"
                                    }`}
                                  >
                                    <span className="text-white font-bold text-sm">
                                      {index + 1}
                                    </span>
                                  </div>
                                  {index <
                                    trendData.marketInsights.length - 1 && (
                                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-200 to-transparent"></div>
                                  )}
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 mb-2">
                                    {insight.title}
                                  </h4>
                                  <p className="text-gray-700 leading-relaxed text-sm">
                                    {insight.description}
                                  </p>
                                  <div className="mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        insight.impact === "high"
                                          ? "bg-red-400"
                                          : insight.impact === "medium"
                                          ? "bg-yellow-400"
                                          : "bg-green-400"
                                      }`}
                                    ></div>
                                    <span
                                      className={`text-xs font-medium capitalize ${
                                        insight.impact === "high"
                                          ? "text-red-600"
                                          : insight.impact === "medium"
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {insight.impact} Impact
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Bottom accent */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-gray-600 font-medium">
                                Data Quality: {trendData.dataQuality}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Last Updated:{" "}
                              {new Date(
                                trendData.lastUpdated
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </MotionWrapper>
                </div>
              </motion.section>
            )}

            {/* No Data Message */}
            {!loading && !trendData && error && (
              <motion.section
                className="py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-12 text-center">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrendingUp className="w-10 h-10 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-blue-900 mb-4">
                        Data Not Available Yet
                      </h3>
                      <p className="text-blue-700 text-lg mb-6 max-w-2xl mx-auto">
                        {error}
                      </p>
                      <div className="flex items-center justify-center space-x-4 text-sm text-blue-600">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>We're actively collecting data</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Your preference is noted</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Check back soon!</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
