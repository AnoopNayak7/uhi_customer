"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  TrendingUp,
  Calculator,
  MapPin,
  BookOpen,
  Phone,
  Building,
  Users,
  Award,
  Crown,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CITIES } from "@/lib/config";
import { apiClient } from "@/lib/api";

export function RealEstateTools() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    phone: "",
    city: "",
  });
  const [partnerForm, setPartnerForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    propertyTypes: "",
    experience: "",
    message: "",
    website: "",
    employeeCount: "",
    annualRevenue: "",
    targetMarkets: "",
  });

  const tools = [
    {
      icon: TrendingUp,
      title: "Price Trends",
      description: "Track property prices & market analysis",
      href: "/tools/price-trends",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Calculator,
      title: "Property Value",
      description: "Calculate estimated property worth",
      href: "/tools/property-value",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: MapPin,
      title: "Area Insights",
      description: "Explore neighbourhood statistics",
      href: "/tools/area-insights",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: BookOpen,
      title: "Investment Guide",
      description: "Smart investment recommendations",
      href: "/tools/investment-guide",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !consultationForm.name ||
      !consultationForm.phone ||
      !consultationForm.city
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Here you would typically send the data to your API
      console.log("Consultation request:", consultationForm);
      toast.success(
        "Consultation request submitted! Our team will contact you soon."
      );
      setConsultationForm({ name: "", phone: "", city: "" });
      setConsultationOpen(false);
    } catch (error) {
      toast.error("Failed to submit request. Please try again.");
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !partnerForm.name ||
      !partnerForm.email ||
      !partnerForm.phone ||
      !partnerForm.company
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit to the new API
      const response = await apiClient.createBusinessPartnership(partnerForm);
      
      if (response && typeof response === 'object' && 'success' in response && response.success) {
        const responseData = response as { success: boolean; data: { applicationNumber: string; estimatedResponseTime: string } };
        toast.success(
          `Partnership application submitted successfully! Application Number: ${responseData.data.applicationNumber}. Our team will contact you within ${responseData.data.estimatedResponseTime}.`
        );
        
        // Reset form
        setPartnerForm({
          name: "",
          email: "",
          phone: "",
          company: "",
          city: "",
          propertyTypes: "",
          experience: "",
          message: "",
          website: "",
          employeeCount: "",
          annualRevenue: "",
          targetMarkets: "",
        });
        
        setPartnerOpen(false);
      } else {
        const errorMessage = response && typeof response === 'object' && 'message' in response ? String(response.message) : "Failed to submit application";
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Partnership submission error:", error);
      
      if (error.message?.includes("already pending")) {
        toast.error("An application with this email is already pending review. Please wait for our team to contact you.");
      } else if (error.message?.includes("Invalid phone")) {
        toast.error("Please enter a valid Indian mobile number (e.g., +91 9876543210)");
      } else if (error.message?.includes("Invalid email")) {
        toast.error("Please enter a valid email address");
      } else {
        toast.error("Failed to submit partnership application. Please try again or contact support.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Real Estate Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Powerful tools and insights to help you make informed property
            decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card
              key={tool.title}
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
            >
              <CardContent className="p-6 text-center h-full flex flex-col">
                <div
                  className={`w-16 h-16 ${tool.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <tool.icon className={`w-8 h-8 ${tool.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {tool.description}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={tool.href}>Explore Tool</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Explore More Tools Button */}
        <div className="text-center mt-12">
          <div className="inline-flex flex-col items-center">
            <p className="text-gray-600 mb-4">
              Looking for more advanced tools and features?
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link href="/tools/real-estate">
                <Crown className="w-5 h-5 mr-2" />
                Explore Real-estate Tools
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Customer Support Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  For Customers
                </h3>
                <p className="text-gray-600 mb-6">
                  Get expert guidance from our property consultants and find
                  your perfect home
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Consultation Dialog */}
                  <Dialog
                    open={consultationOpen}
                    onOpenChange={setConsultationOpen}
                  >
                    <DialogTrigger asChild>
                      <Button className="bg-red-500 hover:bg-red-600">
                        <Phone className="w-4 h-4 mr-2" />
                        Speak to Consultant
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Phone className="w-5 h-5 text-red-500" />
                          <span>Request Consultation</span>
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleConsultationSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="consultation-name">Full Name *</Label>
                          <Input
                            id="consultation-name"
                            placeholder="Enter your full name"
                            value={consultationForm.name}
                            onChange={(e) =>
                              setConsultationForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="consultation-phone">
                            Phone Number *
                          </Label>
                          <Input
                            id="consultation-phone"
                            placeholder="+91 9876543210"
                            value={consultationForm.phone}
                            onChange={(e) =>
                              setConsultationForm((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="consultation-city">City *</Label>
                          <Select
                            value={consultationForm.city}
                            onValueChange={(value) =>
                              setConsultationForm((prev) => ({
                                ...prev,
                                city: value,
                              }))
                            }
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select your city" />
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

                        <div className="flex space-x-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConsultationOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 bg-red-500 hover:bg-red-600"
                          >
                            Submit Request
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  For Business
                </h3>
                <p className="text-gray-600 mb-6">
                  Partner with us to showcase your properties to millions of
                  potential buyers
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Partnership Dialog */}
                  <Dialog open={partnerOpen} onOpenChange={setPartnerOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-red-500 hover:bg-red-600 text-white">
                        <Building className="w-4 h-4 mr-2" />
                        Become Partner
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                          <Building className="w-5 h-5 text-red-500" />
                          <span>Business Partnership Application</span>
                        </DialogTitle>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2">
                          Join our network of trusted real estate partners and reach millions of potential buyers
                        </p>
                      </DialogHeader>
                      <form
                        onSubmit={handlePartnerSubmit}
                        className="space-y-4 sm:space-y-6"
                      >
                        {/* Basic Information */}
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-semibold text-gray-900 border-b pb-2 text-sm sm:text-base">Basic Information</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label htmlFor="partner-name" className="text-sm">Full Name *</Label>
                              <Input
                                id="partner-name"
                                placeholder="Enter your full name"
                                value={partnerForm.name}
                                onChange={(e) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                  }))
                                }
                                className="mt-1 h-10 sm:h-11"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="partner-email" className="text-sm">
                                Email Address *
                              </Label>
                              <Input
                                id="partner-email"
                                type="email"
                                placeholder="your.email@company.com"
                                value={partnerForm.email}
                                onChange={(e) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                  }))
                                }
                                className="mt-1 h-10 sm:h-11"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label htmlFor="partner-phone" className="text-sm">
                                Phone Number *
                              </Label>
                              <Input
                                id="partner-phone"
                                placeholder="+91 9876543210"
                                value={partnerForm.phone}
                                onChange={(e) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                  }))
                                }
                                className="mt-1 h-10 sm:h-11"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="partner-company" className="text-sm">
                                Company Name *
                              </Label>
                              <Input
                                id="partner-company"
                                placeholder="Your Company Ltd."
                                value={partnerForm.company}
                                onChange={(e) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    company: e.target.value,
                                  }))
                                }
                                className="mt-1 h-10 sm:h-11"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Business Details */}
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-semibold text-gray-900 border-b pb-2 text-sm sm:text-base">Business Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label htmlFor="partner-city" className="text-sm">City</Label>
                              <Select
                                value={partnerForm.city}
                                onValueChange={(value) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    city: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="mt-1 h-10 sm:h-11">
                                  <SelectValue placeholder="Select your city" />
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

                            <div>
                              <Label htmlFor="partner-experience" className="text-sm">
                                Experience
                              </Label>
                              <Select
                                value={partnerForm.experience}
                                onValueChange={(value) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    experience: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="mt-1 h-10 sm:h-11">
                                  <SelectValue placeholder="Years of experience" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="0-1">0-1 years</SelectItem>
                                  <SelectItem value="1-3">1-3 years</SelectItem>
                                  <SelectItem value="3-5">3-5 years</SelectItem>
                                  <SelectItem value="5-10">5-10 years</SelectItem>
                                  <SelectItem value="10+">10+ years</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                              <Label htmlFor="partner-website" className="text-sm">Website</Label>
                              <Input
                                id="partner-website"
                                type="url"
                                placeholder="https://yourcompany.com"
                                value={partnerForm.website}
                                onChange={(e) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    website: e.target.value,
                                  }))
                                }
                                className="mt-1 h-10 sm:h-11"
                              />
                            </div>

                            <div>
                              <Label htmlFor="partner-employee-count" className="text-sm">Company Size</Label>
                              <Select
                                value={partnerForm.employeeCount}
                                onValueChange={(value) =>
                                  setPartnerForm((prev) => ({
                                    ...prev,
                                    employeeCount: value,
                                  }))
                                }
                              >
                                <SelectTrigger className="mt-1 h-10 sm:h-11">
                                  <SelectValue placeholder="Number of employees" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-10">1-10 employees</SelectItem>
                                  <SelectItem value="11-50">11-50 employees</SelectItem>
                                  <SelectItem value="51-200">51-200 employees</SelectItem>
                                  <SelectItem value="201-500">201-500 employees</SelectItem>
                                  <SelectItem value="500+">500+ employees</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="partner-property-types" className="text-sm">
                              Property Types
                            </Label>
                            <Input
                              id="partner-property-types"
                              placeholder="e.g., Residential, Commercial, Plots, Villas"
                              value={partnerForm.propertyTypes}
                              onChange={(e) =>
                                setPartnerForm((prev) => ({
                                  ...prev,
                                  propertyTypes: e.target.value,
                                }))
                              }
                              className="mt-1 h-10 sm:h-11"
                            />
                          </div>

                          <div>
                            <Label htmlFor="partner-annual-revenue" className="text-sm">Annual Revenue (Optional)</Label>
                            <Select
                              value={partnerForm.annualRevenue}
                              onValueChange={(value) =>
                                setPartnerForm((prev) => ({
                                  ...prev,
                                  annualRevenue: value,
                                }))
                              }
                            >
                              <SelectTrigger className="mt-1 h-10 sm:h-11">
                                <SelectValue placeholder="Select revenue range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="<1Cr">Less than ₹1 Crore</SelectItem>
                                <SelectItem value="1-5Cr">₹1-5 Crores</SelectItem>
                                <SelectItem value="5-25Cr">₹5-25 Crores</SelectItem>
                                <SelectItem value="25-100Cr">₹25-100 Crores</SelectItem>
                                <SelectItem value="100Cr+">₹100+ Crores</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="partner-target-markets" className="text-sm">Target Markets</Label>
                            <Input
                              id="partner-target-markets"
                              placeholder="e.g., Bangalore, Mumbai, Delhi, Tier-2 cities"
                              value={partnerForm.targetMarkets}
                              onChange={(e) =>
                                setPartnerForm((prev) => ({
                                  ...prev,
                                  targetMarkets: e.target.value,
                                }))
                              }
                              className="mt-1 h-10 sm:h-11"
                            />
                          </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-3 sm:space-y-4">
                          <h4 className="font-semibold text-gray-900 border-b pb-2 text-sm sm:text-base">Additional Information</h4>
                          <div>
                            <Label htmlFor="partner-message" className="text-sm">Why Partner With Us?</Label>
                            <Textarea
                              id="partner-message"
                              placeholder="Tell us about your business goals, target audience, and why you want to partner with UrbanHouseIN..."
                              value={partnerForm.message}
                              onChange={(e) =>
                                setPartnerForm((prev) => ({
                                  ...prev,
                                  message: e.target.value,
                                }))
                              }
                              rows={3}
                              className="mt-1 resize-none"
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setPartnerOpen(false)}
                            className="flex-1 h-11"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="flex-1 bg-red-500 hover:bg-red-600 h-11" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Application"
                            )}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
