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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Calculator,
  MapPin,
  Building,
  Home,
  TreePine,
  Briefcase,
  Store,
  TrendingUp,
  IndianRupee,
  Square,
  Calendar,
  Award,
  AlertCircle,
  Settings,
  Loader2,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { PageContent } from "@/components/animations/layout-wrapper";
import { MotionWrapper } from "@/components/animations/motion-wrapper";
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

const propertyTypes = [
  { value: "flat", label: "Apartment/Flat", icon: Building },
  { value: "house", label: "Independent House", icon: Home },
  { value: "villa", label: "Villa", icon: Home },
  { value: "plot", label: "Plot/Land", icon: TreePine },
  { value: "office", label: "Office Space", icon: Briefcase },
  { value: "shop", label: "Shop/Retail", icon: Store },
];

const ageOptions = [
  { value: "new", label: "New (0-1 years)", multiplier: 1.0 },
  { value: "recent", label: "Recent (1-5 years)", multiplier: 0.95 },
  { value: "moderate", label: "Moderate (5-10 years)", multiplier: 0.85 },
  { value: "old", label: "Old (10-20 years)", multiplier: 0.75 },
  { value: "very_old", label: "Very Old (20+ years)", multiplier: 0.65 },
];

const furnishingOptions = [
  { value: "unfurnished", label: "Unfurnished", multiplier: 1.0 },
  { value: "semi_furnished", label: "Semi Furnished", multiplier: 1.1 },
  { value: "fully_furnished", label: "Fully Furnished", multiplier: 1.2 },
];

export default function PropertyValuePage() {
  const [selectedCity, setSelectedCity] = useState("Bangalore");
  const [selectedPropertyType, setSelectedPropertyType] = useState("flat");
  const [selectedArea, setSelectedArea] = useState("");
  const [builtUpArea, setBuiltUpArea] = useState(1200);
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [propertyAge, setPropertyAge] = useState("recent");
  const [furnishing, setFurnishing] = useState("semi_furnished");
  const [floor, setFloor] = useState(5);
  const [totalFloors, setTotalFloors] = useState(10);
  const [loading, setLoading] = useState(false);
  const [valuation, setValuation] = useState<any>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [areasLoading, setAreasLoading] = useState(false);

  useEffect(() => {
    fetchAreasForCity();
  }, [selectedCity]);

  const fetchAreasForCity = async () => {
    setAreasLoading(true);
    try {
      // Include prices for property value calculator
      const response: any = await apiClient.getToolsAreasForCity(selectedCity, { includePrices: true });
      
      if (response.success) {
        setAreas(response.data.areas || []);
        setSelectedArea("");
        setValuation(null);
      } else {
        toast.error(response.message || 'Failed to fetch areas');
        setAreas([]);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
      toast.error('Failed to fetch areas for the selected city');
      setAreas([]);
    } finally {
      setAreasLoading(false);
    }
  };

  const calculatePropertyValue = async () => {
    if (!selectedArea) {
      toast.error('Please select an area first');
      return;
    }

    setLoading(true);
    try {
      const response: any = await apiClient.getToolsPropertyValue({
        cityName: selectedCity,
        areaName: selectedArea,
        propertyType: selectedPropertyType,
        builtUpArea,
        bedrooms,
        bathrooms,
        propertyAge,
        furnishing,
        floor,
        totalFloors
      });

      if (response.success) {
        setValuation(response.data);
        toast.success('Property value calculated successfully!');
      } else {
        toast.error(response.message || 'Failed to calculate property value');
        setValuation(null);
      }
    } catch (error) {
      console.error("Error calculating property value:", error);
      toast.error('Failed to calculate property value. Please try again.');
      setValuation(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
    }
    return `₹${price.toLocaleString()}`;
  };

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  // Reusable form content component
  const PropertyDetailsForm = () => (
    <div className="space-y-6">
      {/* Location */}
      <div className="space-y-4">
        <div>
          <Label>City *</Label>
          <Select value={selectedCity} onValueChange={setSelectedCity} disabled>
            <SelectTrigger className="mt-1">
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
        </div>

        <div>
          <Label>Area/Locality *</Label>
          <Select 
            value={selectedArea} 
            onValueChange={setSelectedArea}
            disabled={areasLoading}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={areasLoading ? "Loading areas..." : "Select area"} />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.name} value={area.name}>
                  <div className="flex items-center justify-between w-full">
                    <span>{area.name}</span>
                    {area.basePrice > 0 && (
                      <Badge variant="outline" className="ml-2">
                        ₹{area.basePrice.toLocaleString()}/sqft
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <Label>Property Type *</Label>
        <Select
          value={selectedPropertyType}
          onValueChange={setSelectedPropertyType}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {propertyTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center">
                  <type.icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{type.label}</span>
                  <span className="sm:hidden">{type.label.split('/')[0]}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Area */}
      <div>
        <Label>Built-up Area (sqft) *</Label>
        <div className="mt-2">
          <Slider
            value={[builtUpArea]}
            onValueChange={(value) => setBuiltUpArea(value[0])}
            max={10000}
            min={300}
            step={50}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>300 sqft</span>
            <span className="font-medium">{builtUpArea.toLocaleString()} sqft</span>
            <span>10,000 sqft</span>
          </div>
          {/* Manual input for precise control */}
          <div className="mt-3">
            <Input
              type="number"
              value={builtUpArea}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                if (value >= 300 && value <= 10000) {
                  setBuiltUpArea(value);
                }
              }}
              min={300}
              max={10000}
              step={0.1}
              className="text-center"
              placeholder="Enter exact area"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms & Bathrooms */}
      {selectedPropertyType !== "plot" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Bedrooms</Label>
            <Select
              value={bedrooms.toString()}
              onValueChange={(value) => setBedrooms(parseInt(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} BHK
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Bathrooms</Label>
            <Select
              value={bathrooms.toString()}
              onValueChange={(value) => setBathrooms(parseInt(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Property Age */}
      <div>
        <Label>Property Age</Label>
        <Select value={propertyAge} onValueChange={setPropertyAge}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ageOptions.map((age) => (
              <SelectItem key={age.value} value={age.value}>
                {age.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Furnishing */}
      {selectedPropertyType !== "plot" && (
        <div>
          <Label>Furnishing Status</Label>
          <Select value={furnishing} onValueChange={setFurnishing}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {furnishingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Floor Details */}
      {selectedPropertyType !== "plot" && selectedPropertyType !== "house" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Floor</Label>
            <Input
              type="number"
              value={floor}
              onChange={(e) => setFloor(parseInt(e.target.value) || 1)}
              min={1}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Total Floors</Label>
            <Input
              type="number"
              value={totalFloors}
              onChange={(e) => setTotalFloors(parseInt(e.target.value) || 1)}
              min={1}
              className="mt-1"
            />
          </div>
        </div>
      )}

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => {
            calculatePropertyValue();
            setSheetOpen(false);
          }}
          disabled={!selectedArea || loading}
          className="w-full bg-green-500 hover:bg-green-600"
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculating...
            </div>
          ) : (
            <div className="flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Property Value
            </div>
          )}
        </Button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageContent>
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <MotionWrapper variant="fadeInUp" className="text-center mb-8">
                <motion.h1
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Property Value Calculator
                </motion.h1>
                <motion.p
                  className="text-xl text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Get accurate property valuations based on location, features,
                  and market conditions
                </motion.p>
              </MotionWrapper>
            </div>
          </section>

          {/* Calculator Section */}
          <section className="py-8 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Mobile: Bottom Sheet Trigger */}
              <MotionWrapper variant="slideInUp" className="lg:hidden mb-6">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600"
                        size="lg"
                      >
                        <Settings className="w-5 h-5 mr-2" />
                        Set Property Details
                      </Button>
                    </motion.div>
                  </SheetTrigger>
                  <SheetContent
                    side="bottom"
                    className="h-[85vh] overflow-y-auto"
                  >
                    <SheetHeader>
                      <SheetTitle className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5" />
                        <span>Property Details</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <PropertyDetailsForm />
                    </div>
                  </SheetContent>
                </Sheet>
              </MotionWrapper>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Desktop: Input Form Sidebar */}
                <MotionWrapper
                  variant="fadeInLeft"
                  className="hidden lg:block lg:col-span-1"
                >
                  <Card className="sticky top-8">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5" />
                        <span>Property Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <PropertyDetailsForm />
                    </CardContent>
                  </Card>
                </MotionWrapper>

                {/* Results */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {valuation ? (
                      <motion.div
                        className="space-y-4 lg:space-y-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Valuation Summary */}
                        <MotionWrapper variant="fadeInRight" delay={0.1}>
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                                <div className="flex items-center space-x-2">
                                  <IndianRupee className="w-5 h-5" />
                                  <span>Property Valuation</span>
                                </div>
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: 0.5,
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                >
                                  <Badge
                                    className={`${
                                      valuation.recommendation === "Fair Value"
                                        ? "bg-green-500"
                                        : valuation.recommendation ===
                                          "Underpriced"
                                        ? "bg-blue-500"
                                        : "bg-red-500"
                                    } text-white`}
                                  >
                                    {valuation.recommendation}
                                  </Badge>
                                </motion.div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
                                <motion.div
                                  className="text-center"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <p className="text-sm text-gray-600 mb-1">
                                    Estimated Value
                                  </p>
                                  <motion.p
                                    className="text-2xl lg:text-3xl font-bold text-green-600"
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      delay: 0.5,
                                      type: "spring",
                                      stiffness: 200,
                                    }}
                                  >
                                    {formatPrice(valuation.totalValue)}
                                  </motion.p>
                                </motion.div>
                                <motion.div
                                  className="text-center"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                >
                                  <p className="text-sm text-gray-600 mb-1">
                                    Price per sqft
                                  </p>
                                  <motion.p
                                    className="text-xl lg:text-2xl font-bold text-blue-600"
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      delay: 0.6,
                                      type: "spring",
                                      stiffness: 200,
                                    }}
                                  >
                                    ₹{valuation.pricePerSqft.toLocaleString()}
                                  </motion.p>
                                </motion.div>
                                <motion.div
                                  className="text-center"
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <p className="text-sm text-gray-600 mb-1">
                                    Confidence Level
                                  </p>
                                  <motion.p
                                    className="text-xl lg:text-2xl font-bold text-purple-600"
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                      delay: 0.7,
                                      type: "spring",
                                      stiffness: 200,
                                    }}
                                  >
                                    {valuation.confidence}%
                                  </motion.p>
                                </motion.div>
                              </div>

                              <motion.div
                                className="mt-4 lg:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                              >
                                <motion.div
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <span className="text-gray-600 text-sm">
                                    Market Trend
                                  </span>
                                  <span className="font-medium text-green-600 text-sm">
                                    {valuation.marketTrend}
                                  </span>
                                </motion.div>
                                <motion.div
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  whileHover={{ scale: 1.02 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 300,
                                  }}
                                >
                                  <span className="text-gray-600 text-sm">
                                    Area Growth
                                  </span>
                                  <span className="font-medium text-blue-600 text-sm">
                                    +{valuation.areaData.growth}% YoY
                                  </span>
                                </motion.div>
                              </motion.div>
                            </CardContent>
                          </Card>
                        </MotionWrapper>

                        {/* Valuation Breakdown */}
                        <motion.div
                          className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 }}
                        >
                          <MotionWrapper variant="fadeInLeft" delay={1.0}>
                            <Card>
                              <CardHeader>
                                <CardTitle>Valuation Breakdown</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <motion.div
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 1.2, duration: 0.5 }}
                                  className="h-64 lg:h-80"
                                >
                                  <ResponsiveContainer
                                    width="100%"
                                    height="100%"
                                  >
                                    <PieChart>
                                      <Pie
                                        data={valuation.breakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="percentage"
                                      >
                                        {valuation.breakdown.map(
                                          (entry: any, index: number) => (
                                            <Cell
                                              key={`cell-${index}`}
                                              fill={
                                                COLORS[index % COLORS.length]
                                              }
                                            />
                                          )
                                        )}
                                      </Pie>
                                      <Tooltip
                                        formatter={(value: any) => `${value}%`}
                                      />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </motion.div>
                                <div className="mt-4 space-y-2">
                                  {valuation.breakdown.map(
                                    (item: any, index: number) => (
                                      <motion.div
                                        key={index}
                                        className="flex items-center justify-between"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: 1.3 + index * 0.1,
                                        }}
                                      >
                                        <div className="flex items-center">
                                          <div
                                            className="w-3 h-3 rounded-full mr-2"
                                            style={{
                                              backgroundColor:
                                                COLORS[index % COLORS.length],
                                            }}
                                          />
                                          <span className="text-sm text-gray-600">
                                            {item.name}
                                          </span>
                                        </div>
                                        <span className="text-sm font-medium">
                                          {formatPrice(item.value)}
                                        </span>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </MotionWrapper>

                          <MotionWrapper variant="slideInUp" delay={1.1}>
                            <Card>
                              <CardHeader>
                                <CardTitle>Comparable Properties</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3 lg:space-y-4">
                                  {valuation.comparables.map(
                                    (comp: any, index: number) => (
                                      <motion.div
                                        key={index}
                                        className="p-3 lg:p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: 1.4 + index * 0.2,
                                        }}
                                        whileHover={{
                                          scale: 1.02,
                                          boxShadow:
                                            "0 4px 12px rgba(0,0,0,0.1)",
                                        }}
                                      >
                                        <div className="flex items-start justify-between mb-2 lg:mb-3">
                                          <h4 className="font-medium text-gray-900 text-xs lg:text-sm">
                                            {comp.title}
                                          </h4>
                                          {comp.microlocation && (
                                            <Badge variant="secondary" className="text-xs">
                                              {comp.microlocation}
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 lg:gap-3 text-xs">
                                          <div>
                                            <span className="text-gray-600">
                                              Area:{" "}
                                            </span>
                                            <span className="font-medium">
                                              {comp.area.toLocaleString()} sqft
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-gray-600">
                                              Price:{" "}
                                            </span>
                                            <span className="font-medium">
                                              {formatPrice(comp.price)}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-gray-600">
                                              Rate:{" "}
                                            </span>
                                            <span className="font-medium">
                                              ₹
                                              {comp.pricePerSqft.toLocaleString()}
                                              /sqft
                                            </span>
                                          </div>
                                          <div>
                                            <span className="text-gray-600">
                                              Age:{" "}
                                            </span>
                                            <span className="font-medium">
                                              {comp.age} years
                                            </span>
                                          </div>
                                        </div>
                                        {comp.originalPrice && (
                                          <div className="mt-2 pt-2 border-t border-gray-100">
                                            <span className="text-xs text-gray-500">
                                              Base Price: ₹{comp.originalPrice.toLocaleString()}/sqft
                                            </span>
                                          </div>
                                        )}
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </MotionWrapper>
                        </motion.div>

                        {/* Market Insights */}
                        <MotionWrapper variant="fadeInUp" delay={2.0}>
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5" />
                                <span>Market Insights</span>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <motion.div
                                    className="flex items-start space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.2 }}
                                  >
                                    <Award className="w-5 h-5 text-green-500 mt-0.5" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        Investment Potential
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {valuation.areaData.growth > 10
                                          ? "Excellent"
                                          : valuation.areaData.growth > 5
                                          ? "Good"
                                          : "Moderate"}{" "}
                                        growth potential based on area
                                        development and infrastructure projects.
                                      </p>
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="flex items-start space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.4 }}
                                  >
                                    <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        Best Time to Sell
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        {valuation.marketTrend ===
                                        "Strong Growth"
                                          ? "Current market conditions are favorable for selling"
                                          : "Consider holding for better market conditions"}
                                      </p>
                                    </div>
                                  </motion.div>
                                </div>

                                <div className="space-y-4">
                                  <motion.div
                                    className="flex items-start space-x-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.3 }}
                                  >
                                    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        Price Factors
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Location, property age, and furnishing
                                        status are key factors affecting the
                                        current valuation.
                                      </p>
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="flex items-start space-x-3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 2.5 }}
                                  >
                                    <Square className="w-5 h-5 text-purple-500 mt-0.5" />
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        Area Comparison
                                      </h4>
                                      <p className="text-sm text-gray-600">
                                        Your property is priced{" "}
                                        {valuation.recommendation.toLowerCase()}
                                        compared to similar properties in the
                                        area.
                                      </p>
                                    </div>
                                  </motion.div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </MotionWrapper>

                        {/* Dynamic Market Insights from API */}
                        {valuation.marketInsights && valuation.marketInsights.length > 0 && (
                          <motion.div
                            className="mt-6 pt-6 border-t border-gray-200"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 2.6 }}
                          >
                            <h4 className="font-medium text-gray-900 mb-4">AI-Generated Insights</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {valuation.marketInsights.map((insight: any, index: number) => (
                                <motion.div
                                  key={index}
                                  className={`p-4 rounded-lg border ${
                                    insight.impact === 'high' 
                                      ? 'border-green-200 bg-green-50' 
                                      : insight.impact === 'positive'
                                      ? 'border-blue-200 bg-blue-50'
                                      : 'border-gray-200 bg-gray-50'
                                  }`}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 2.7 + index * 0.1 }}
                                >
                                  <h5 className="font-medium text-gray-900 mb-2">{insight.title}</h5>
                                  <p className="text-sm text-gray-600">{insight.description}</p>
                                  <div className="mt-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`${
                                        insight.impact === 'high' 
                                          ? 'border-green-300 text-green-700' 
                                          : insight.impact === 'positive'
                                          ? 'border-blue-300 text-blue-700'
                                          : 'border-gray-300 text-gray-700'
                                      }`}
                                    >
                                      {insight.impact === 'high' ? 'High Impact' : 
                                       insight.impact === 'positive' ? 'Positive' : 'Neutral'}
                                    </Badge>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ) : (
                      <MotionWrapper variant="fadeInUp">
                        <Card className="h-96 flex items-center justify-center">
                          <div className="text-center">
                            <motion.div
                              animate={{
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            >
                              <Calculator className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            </motion.div>
                            <motion.h3
                              className="text-lg font-medium text-gray-900 mb-2"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              Property Value Calculator
                            </motion.h3>
                            <motion.p
                              className="text-gray-600"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              Fill in the property details to get an accurate
                              valuation
                            </motion.p>
                          </div>
                        </Card>
                      </MotionWrapper>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </section>
        </PageContent>
      </main>

      <Footer />
    </div>
  );
}
