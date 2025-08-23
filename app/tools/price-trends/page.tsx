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
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { PageContent } from "@/components/animations/layout-wrapper";
import { MotionWrapper } from "@/components/animations/motion-wrapper";

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
  { value: "flat", label: "Apartment/Flat", icon: Building },
  { value: "house", label: "Independent House", icon: Home },
  { value: "villa", label: "Villa", icon: Home },
  { value: "plot", label: "Plot/Land", icon: TreePine },
  { value: "office", label: "Office Space", icon: Briefcase },
  { value: "shop", label: "Shop/Retail", icon: Store },
];

const timeRanges = [
  { value: "6m", label: "Last 6 Months" },
  { value: "1y", label: "Last 1 Year" },
  { value: "2y", label: "Last 2 Years" },
  { value: "5y", label: "Last 5 Years" },
];

export default function PriceTrendsPage() {
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [selectedPropertyType, setSelectedPropertyType] = useState("flat");
  const [selectedTimeRange, setSelectedTimeRange] = useState("1y");
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<any>(null);

  useEffect(() => {
    fetchPriceTrends();
  }, [selectedCity, selectedPropertyType, selectedTimeRange]);

  const fetchPriceTrends = async () => {
    setLoading(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data based on selections
      const mockData = generateMockTrendData(
        selectedCity,
        selectedPropertyType,
        selectedTimeRange
      );
      setTrendData(mockData);
    } catch (error) {
      console.error("Error fetching price trends:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTrendData = (
    city: string,
    propertyType: string,
    timeRange: string
  ) => {
    const basePrice = {
      Bangalore: {
        flat: 6500,
        house: 8500,
        villa: 12000,
        plot: 4500,
        office: 9500,
        shop: 11000,
      },
      Mumbai: {
        flat: 18000,
        house: 22000,
        villa: 35000,
        plot: 25000,
        office: 28000,
        shop: 32000,
      },
      Delhi: {
        flat: 12000,
        house: 15000,
        villa: 25000,
        plot: 18000,
        office: 20000,
        shop: 24000,
      },
      Chennai: {
        flat: 5500,
        house: 7500,
        villa: 11000,
        plot: 4000,
        office: 8500,
        shop: 10000,
      },
      Hyderabad: {
        flat: 5000,
        house: 7000,
        villa: 10000,
        plot: 3500,
        office: 7500,
        shop: 9000,
      },
      Pune: {
        flat: 7000,
        house: 9000,
        villa: 13000,
        plot: 5000,
        office: 10000,
        shop: 12000,
      },
    };

    const currentPrice =
      basePrice[city as keyof typeof basePrice]?.[
        propertyType as keyof (typeof basePrice)["Bangalore"]
      ] || 6000;

    // Generate trend data
    const months =
      timeRange === "6m"
        ? 6
        : timeRange === "1y"
        ? 12
        : timeRange === "2y"
        ? 24
        : 60;
    const chartData = [];

    let previousPrice = currentPrice;
    for (let i = months; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const price = Math.round(currentPrice * (1 + variation * (i / months)));

      // Calculate month-over-month growth
      const monthGrowth =
        i === months
          ? 0
          : Math.round(((price - previousPrice) / previousPrice) * 100 * 10) /
            10;

      chartData.push({
        month: date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        price: price,
        avgPrice: price + Math.round((Math.random() - 0.5) * 500),
        growth: monthGrowth,
      });

      previousPrice = price;
    }

    // Calculate growth
    const firstPrice = chartData[0]?.price || currentPrice;
    const lastPrice = chartData[chartData.length - 1]?.price || currentPrice;
    const growth = ((lastPrice - firstPrice) / firstPrice) * 100;

    // Generate area-wise data
    const areas = getAreasForCity(city);
    const areaData = areas.map((area) => ({
      area: area.name,
      avgPrice: Math.round(currentPrice * area.multiplier),
      growth: Math.round((Math.random() - 0.3) * 20), // -6% to +14% growth
      properties: Math.round(Math.random() * 500 + 100),
    }));

    return {
      currentPrice,
      growth,
      chartData,
      areaData,
      insights: generateInsights(city, propertyType, growth),
    };
  };

  const getAreasForCity = (city: string) => {
    const cityAreas = {
      Bangalore: [
        { name: "Whitefield", multiplier: 1.2 },
        { name: "Koramangala", multiplier: 1.5 },
        { name: "Indiranagar", multiplier: 1.4 },
        { name: "Electronic City", multiplier: 0.9 },
        { name: "Sarjapur Road", multiplier: 1.1 },
        { name: "Hebbal", multiplier: 1.0 },
        { name: "JP Nagar", multiplier: 1.2 },
        { name: "Marathahalli", multiplier: 1.1 },
      ],
      Mumbai: [
        { name: "Bandra", multiplier: 2.0 },
        { name: "Andheri", multiplier: 1.3 },
        { name: "Powai", multiplier: 1.4 },
        { name: "Thane", multiplier: 0.8 },
        { name: "Navi Mumbai", multiplier: 0.9 },
        { name: "Malad", multiplier: 1.1 },
        { name: "Goregaon", multiplier: 1.2 },
        { name: "Kandivali", multiplier: 1.0 },
      ],
      Delhi: [
        { name: "Gurgaon", multiplier: 1.3 },
        { name: "Noida", multiplier: 1.1 },
        { name: "Dwarka", multiplier: 1.2 },
        { name: "Rohini", multiplier: 0.9 },
        { name: "Lajpat Nagar", multiplier: 1.4 },
        { name: "Vasant Kunj", multiplier: 1.5 },
        { name: "Greater Noida", multiplier: 0.8 },
        { name: "Faridabad", multiplier: 0.9 },
      ],
    };

    return cityAreas[city as keyof typeof cityAreas] || cityAreas["Bangalore"];
  };

  const generateInsights = (
    city: string,
    propertyType: string,
    growth: number
  ) => {
    return [
      `${
        propertyType.charAt(0).toUpperCase() + propertyType.slice(1)
      } prices in ${city} have ${
        growth > 0 ? "increased" : "decreased"
      } by ${Math.abs(growth).toFixed(1)}% in the selected period.`,
      `Best time to ${
        growth > 5 ? "sell" : "buy"
      } based on current market trends.`,
      `High demand areas are showing premium pricing compared to city average.`,
      `Infrastructure development is positively impacting property values in key locations.`,
    ];
  };

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
            {/* Header with month */}
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
                  Actual Price
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm"></div>
                  <span className="text-sm font-bold text-gray-900">
                    ₹{payload[0].value.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Market Average */}
              {payload[0].payload.avgPrice && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    Market Average
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-0.5 border-t-2 border-dashed border-gray-400"></div>
                    <span className="text-sm font-bold text-gray-700">
                      ₹{payload[0].payload.avgPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              {/* Price comparison */}
              {payload[0].payload.avgPrice && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    vs Market
                  </span>
                  <div className="flex items-center space-x-1">
                    {(() => {
                      const actualPrice = payload[0].value;
                      const avgPrice = payload[0].payload.avgPrice;
                      const difference =
                        ((actualPrice - avgPrice) / avgPrice) * 100;
                      const isHigher = difference > 0;

                      return (
                        <>
                          {isHigher ? (
                            <TrendingUp className="w-3 h-3 text-orange-500" />
                          ) : (
                            <TrendingDown className="w-3 h-3 text-blue-500" />
                          )}
                          <span
                            className={`text-xs font-semibold ${
                              isHigher ? "text-orange-600" : "text-blue-600"
                            }`}
                          >
                            {isHigher ? "+" : ""}
                            {difference.toFixed(1)}%
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Growth indicator if available */}
              {payload[0].payload.growth !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">
                    Monthly Growth
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
                                ₹{trendData.currentPrice.toLocaleString()}
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
                                  trendData.growth >= 0
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
                                {trendData.growth >= 0 ? "+" : ""}
                                {trendData.growth.toFixed(1)}%
                              </motion.p>
                            </div>
                            <motion.div
                              className={`p-3 rounded-full ${
                                trendData.growth >= 0
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
                              {trendData.growth >= 0 ? (
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
                                  trendData.growth > 5
                                    ? "text-green-600"
                                    : trendData.growth < -2
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
                                {trendData.growth > 5
                                  ? "Bull Market"
                                  : trendData.growth < -2
                                  ? "Bear Market"
                                  : "Stable Market"}
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
                                {trendData.growth > 5
                                  ? "Good to Sell"
                                  : trendData.growth < 0
                                  ? "Good to Buy"
                                  : "Hold & Watch"}
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
                              {trendData.growth > 0 ? (
                                <ArrowUp className="w-6 h-6 text-blue-500" />
                              ) : trendData.growth < 0 ? (
                                <ArrowDown className="w-6 h-6 text-blue-500" />
                              ) : (
                                <Minus className="w-6 h-6 text-blue-500" />
                              )}
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
                            Price Trend - {selectedCity} (
                            {selectedPropertyTypeData?.label})
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
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
                              data={trendData.chartData}
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
                                dataKey="month"
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

                              {/* Trend line (optional - shows average) */}
                              <Line
                                type="monotone"
                                dataKey="avgPrice"
                                stroke="#94a3b8"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                opacity={0.6}
                                animationDuration={2500}
                                animationEasing="ease-out"
                              />
                            </LineChart>
                          </ResponsiveContainer>

                          {/* Chart legend */}
                          <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
                              <span className="text-gray-600 font-medium">
                                Actual Price
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-0.5 border-t-2 border-dashed border-gray-400 rounded-full"></div>
                              <span className="text-gray-600 font-medium">
                                Market Average
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </MotionWrapper>

                  {/* Area-wise Pricing */}
                  <MotionWrapper variant="slideInUp" delay={1.4}>
                    <Card className="mb-8 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/30">
                      <CardHeader className="pb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
                              <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl font-bold text-gray-900">
                                Area-wise Pricing
                              </CardTitle>
                              <p className="text-sm text-gray-500 mt-1">
                                Compare prices across {selectedCity} localities
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                          {trendData.areaData.map(
                            (area: any, index: number) => (
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
                                    {area.area}
                                  </motion.h4>
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-sm">
                                      {index + 1}
                                    </span>
                                  </div>
                                </div>

                                {/* Price highlight */}
                                <motion.div
                                  className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 1.9 + index * 0.1 }}
                                >
                                  <div className="text-xs text-blue-600 font-medium mb-1">
                                    Average Price per sqft
                                  </div>
                                  <div className="text-2xl font-bold text-blue-700">
                                    ₹{area.avgPrice.toLocaleString()}
                                  </div>
                                </motion.div>

                                {/* Growth indicator */}
                                <motion.div
                                  className="mb-4"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 2.0 + index * 0.1 }}
                                >
                                  <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50">
                                    <span className="text-sm font-medium text-gray-600">
                                      YoY Growth
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      {area.growth >= 0 ? (
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <TrendingDown className="w-4 h-4 text-red-500" />
                                      )}
                                      <span
                                        className={`font-bold text-base ${
                                          area.growth >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {area.growth >= 0 ? "+" : ""}
                                        {area.growth}%
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>

                                {/* Properties count */}
                                <motion.div
                                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 2.1 + index * 0.1 }}
                                >
                                  <span className="text-sm font-medium text-gray-600">
                                    Available Properties
                                  </span>
                                  <div className="flex items-center space-x-2">
                                    <Building className="w-4 h-4 text-gray-500" />
                                    <span className="font-bold text-gray-900">
                                      {area.properties}
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
                                      area.growth >= 0
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${Math.min(
                                        Math.abs(area.growth) * 5,
                                        100
                                      )}%`,
                                    }}
                                    transition={{
                                      delay: 2.2 + index * 0.1,
                                      duration: 0.8,
                                    }}
                                  />
                                </div>
                              </motion.div>
                            )
                          )}
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
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900">
                              Market Insights
                            </CardTitle>
                            <p className="text-sm text-gray-500 mt-1">
                              Key trends and analysis for {selectedCity}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-6">
                          {trendData.insights.map(
                            (insight: string, index: number) => (
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
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                                      <span className="text-white font-bold text-sm">
                                        {index + 1}
                                      </span>
                                    </div>
                                    {index < trendData.insights.length - 1 && (
                                      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-gradient-to-b from-blue-200 to-transparent"></div>
                                    )}
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-gray-800 leading-relaxed font-medium text-base">
                                      {insight}
                                    </p>
                                    <div className="mt-2 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                      <span className="text-xs text-blue-600 font-medium">
                                        Market Analysis
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>

                        {/* Bottom accent */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-sm text-gray-600 font-medium">
                                Live Market Data
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Updated {new Date().toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </MotionWrapper>
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
