"use client";

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Calculator, MapPin, BookOpen, Phone, Building, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { CITIES } from '@/lib/config';

export function RealEstateTools() {
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [consultationForm, setConsultationForm] = useState({
    name: '',
    phone: '',
    city: ''
  });
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    city: '',
    propertyTypes: '',
    experience: '',
    message: ''
  });

  const tools = [
    {
      icon: TrendingUp,
      title: 'Price Trends',
      description: 'Track property prices & market analysis',
      href: '/tools/price-trends',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Calculator,
      title: 'Property Value',
      description: 'Calculate estimated property worth',
      href: '/tools/property-value',
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: MapPin,
      title: 'Area Insights',
      description: 'Explore neighbourhood statistics',
      href: '/tools/area-insights',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: BookOpen,
      title: 'Investment Guide',
      description: 'Smart investment recommendations',
      href: '/tools/investment-guide',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50'
    }
  ];

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationForm.name || !consultationForm.phone || !consultationForm.city) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Here you would typically send the data to your API
      console.log('Consultation request:', consultationForm);
      toast.success('Consultation request submitted! Our team will contact you soon.');
      setConsultationForm({ name: '', phone: '', city: '' });
      setConsultationOpen(false);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.name || !partnerForm.email || !partnerForm.phone || !partnerForm.company) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      // Here you would typically send the data to your API
      console.log('Partnership request:', partnerForm);
      toast.success('Partnership request submitted! We will review and contact you soon.');
      setPartnerForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        city: '',
        propertyTypes: '',
        experience: '',
        message: ''
      });
      setPartnerOpen(false);
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
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
            Powerful tools and insights to help you make informed property decisions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Card key={tool.title} className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <CardContent className="p-6 text-center h-full flex flex-col">
                <div className={`w-16 h-16 ${tool.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className={`w-8 h-8 ${tool.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">
                  {tool.description}
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={tool.href}>
                    Explore Tool
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
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
                  Get expert guidance from our property consultants and find your perfect home
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Consultation Dialog */}
                  <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
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
                      <form onSubmit={handleConsultationSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="consultation-name">Full Name *</Label>
                          <Input
                            id="consultation-name"
                            placeholder="Enter your full name"
                            value={consultationForm.name}
                            onChange={(e) => setConsultationForm(prev => ({ ...prev, name: e.target.value }))}
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="consultation-phone">Phone Number *</Label>
                          <Input
                            id="consultation-phone"
                            placeholder="+91 9876543210"
                            value={consultationForm.phone}
                            onChange={(e) => setConsultationForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="mt-1"
                            required
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="consultation-city">City *</Label>
                          <Select 
                            value={consultationForm.city} 
                            onValueChange={(value) => setConsultationForm(prev => ({ ...prev, city: value }))}
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
                          <Button type="submit" className="flex-1 bg-red-500 hover:bg-red-600">
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
                  Partner with us to showcase your properties to millions of potential buyers
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/property/create">
                      List Your Property
                    </Link>
                  </Button>
                  
                  {/* Partnership Dialog */}
                  <Dialog open={partnerOpen} onOpenChange={setPartnerOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Building className="w-4 h-4 mr-2" />
                        Become Partner
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Building className="w-5 h-5 text-blue-500" />
                          <span>Partnership Application</span>
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handlePartnerSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="partner-name">Full Name *</Label>
                            <Input
                              id="partner-name"
                              placeholder="Enter your full name"
                              value={partnerForm.name}
                              onChange={(e) => setPartnerForm(prev => ({ ...prev, name: e.target.value }))}
                              className="mt-1"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="partner-email">Email Address *</Label>
                            <Input
                              id="partner-email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={partnerForm.email}
                              onChange={(e) => setPartnerForm(prev => ({ ...prev, email: e.target.value }))}
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="partner-phone">Phone Number *</Label>
                            <Input
                              id="partner-phone"
                              placeholder="+91 9876543210"
                              value={partnerForm.phone}
                              onChange={(e) => setPartnerForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="mt-1"
                              required
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="partner-company">Company Name *</Label>
                            <Input
                              id="partner-company"
                              placeholder="Your company name"
                              value={partnerForm.company}
                              onChange={(e) => setPartnerForm(prev => ({ ...prev, company: e.target.value }))}
                              className="mt-1"
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="partner-city">City</Label>
                            <Select 
                              value={partnerForm.city} 
                              onValueChange={(value) => setPartnerForm(prev => ({ ...prev, city: value }))}
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
                          
                          <div>
                            <Label htmlFor="partner-experience">Experience</Label>
                            <Select 
                              value={partnerForm.experience} 
                              onValueChange={(value) => setPartnerForm(prev => ({ ...prev, experience: value }))}
                            >
                              <SelectTrigger className="mt-1">
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
                        
                        <div>
                          <Label htmlFor="partner-property-types">Property Types</Label>
                          <Input
                            id="partner-property-types"
                            placeholder="e.g., Residential, Commercial, Plots"
                            value={partnerForm.propertyTypes}
                            onChange={(e) => setPartnerForm(prev => ({ ...prev, propertyTypes: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="partner-message">Message</Label>
                          <Textarea
                            id="partner-message"
                            placeholder="Tell us about your business and why you want to partner with us..."
                            value={partnerForm.message}
                            onChange={(e) => setPartnerForm(prev => ({ ...prev, message: e.target.value }))}
                            rows={3}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex space-x-3 pt-4">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setPartnerOpen(false)}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
                            Submit Application
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