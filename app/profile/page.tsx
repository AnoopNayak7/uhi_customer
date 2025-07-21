"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save,
  Calculator,
  TrendingUp,
  Home,
  Target,
  BarChart3,
  Crown,
  Lock,
  Star,
  Zap,
  Shield,
  Award,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { CITIES } from '@/lib/config';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const response:any = await apiClient.updateProfile(data);
      if (response.success) {
        updateUser(data);
        toast.success('Profile updated successfully!');
        setEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const premiumTools = [
    {
      id: 'mortgage-calculator',
      title: 'Advanced Mortgage Calculator',
      description: 'Calculate EMI, interest rates, and loan eligibility with detailed breakdowns',
      icon: Calculator,
      href: '/tools/mortgage-calculator',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      premium: true
    },
    {
      id: 'property-comparison',
      title: 'Property Comparison Tool',
      description: 'Compare multiple properties side-by-side with detailed analysis',
      icon: BarChart3,
      href: '/tools/property-comparison',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      premium: true
    },
    {
      id: 'investment-calculator',
      title: 'ROI Investment Calculator',
      description: 'Calculate returns, rental yields, and investment projections',
      icon: TrendingUp,
      href: '/tools/investment-calculator',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      premium: true
    },
    {
      id: 'home-affordability',
      title: 'Home Affordability Calculator',
      description: 'Determine how much house you can afford based on your income',
      icon: Home,
      href: '/tools/home-affordability',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
      premium: true
    },
    {
      id: 'market-predictor',
      title: 'Market Trend Predictor',
      description: 'AI-powered predictions for property price movements',
      icon: Target,
      href: '/tools/market-predictor',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      premium: true
    }
  ];

  const basicTools = [
    {
      id: 'price-trends',
      title: 'Price Trends',
      description: 'Track property prices & market analysis',
      icon: TrendingUp,
      href: '/tools/price-trends',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      premium: false
    },
    {
      id: 'property-value',
      title: 'Property Value',
      description: 'Calculate estimated property worth',
      icon: Calculator,
      href: '/tools/property-value',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      premium: false
    },
    {
      id: 'area-insights',
      title: 'Area Insights',
      description: 'Explore neighbourhood statistics',
      icon: MapPin,
      href: '/tools/area-insights',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      premium: false
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Please Login</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Please login to view your profile.
            </p>
            <Button asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="tools">Premium Tools</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Personal Information</span>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(!editing)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {editing ? 'Cancel' : 'Edit'}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              {...form.register('firstName')}
                              disabled={!editing}
                              className="mt-1"
                            />
                            {form.formState.errors.firstName && (
                              <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              {...form.register('lastName')}
                              disabled={!editing}
                              className="mt-1"
                            />
                            {form.formState.errors.lastName && (
                              <p className="text-sm text-red-500 mt-1">
                                {form.formState.errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            {...form.register('email')}
                            disabled={!editing}
                            className="mt-1"
                          />
                          {form.formState.errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            {...form.register('phone')}
                            disabled={!editing}
                            className="mt-1"
                          />
                          {form.formState.errors.phone && (
                            <p className="text-sm text-red-500 mt-1">
                              {form.formState.errors.phone.message}
                            </p>
                          )}
                        </div>

                        {editing && (
                          <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Stats */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Account Type</span>
                        <Badge className={user.role === 'builder' ? 'bg-blue-500' : 'bg-green-500'}>
                          {user.role === 'builder' ? 'Builder' : 'User'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Verification</span>
                        <Badge className={user.isVerified ? 'bg-green-500' : 'bg-yellow-500'}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Member Since</span>
                        <span className="text-sm text-gray-900">Jan 2024</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link href="/favourites">
                          <Star className="w-4 h-4 mr-2" />
                          View Favourites
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link href="/viewed-properties">
                          <Eye className="w-4 h-4 mr-2" />
                          Recently Viewed
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link href="/dashboard">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Premium Tools Tab */}
            <TabsContent value="tools">
              <div className="space-y-8">
                {/* Premium Tools Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <Crown className="w-8 h-8 text-yellow-500 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">Premium Tools</h2>
                  </div>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Exclusive tools available to registered users for advanced property analysis and decision making
                  </p>
                </div>

                {/* Basic Tools */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Free Tools</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {basicTools.map((tool) => (
                      <Card key={tool.id} className="hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                            <tool.icon className={`w-6 h-6 ${tool.color}`} />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{tool.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                          <Button variant="outline" size="sm" className="w-full" asChild>
                            <Link href={tool.href}>Use Tool</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Premium Tools */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Premium Tools</h3>
                    <Badge className="bg-yellow-500 text-white">
                      <Crown className="w-3 h-3 mr-1" />
                      Members Only
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {premiumTools.map((tool) => (
                      <Card key={tool.id} className="relative hover:shadow-lg transition-all duration-300 border-yellow-200">
                        <div className="absolute top-3 right-3">
                          <Crown className="w-5 h-5 text-yellow-500" />
                        </div>
                        <CardContent className="p-6">
                          <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                            <tool.icon className={`w-6 h-6 ${tool.color}`} />
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{tool.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                          <Button className="w-full bg-yellow-500 hover:bg-yellow-600" asChild>
                            <Link href={tool.href}>
                              <Zap className="w-4 h-4 mr-2" />
                              Use Premium Tool
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Benefits Section */}
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Member Benefits</h3>
                      <p className="text-gray-600 mb-6">
                        Get access to advanced tools and exclusive features as a registered member
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">Advanced Analytics</h4>
                          <p className="text-sm text-gray-600">Detailed market insights and trends</p>
                        </div>
                        <div className="text-center">
                          <Calculator className="w-8 h-8 text-green-500 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">Financial Tools</h4>
                          <p className="text-sm text-gray-600">Mortgage and investment calculators</p>
                        </div>
                        <div className="text-center">
                          <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                          <h4 className="font-medium text-gray-900">Smart Recommendations</h4>
                          <p className="text-sm text-gray-600">AI-powered property suggestions</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle>Search Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label>Preferred Cities</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select preferred cities" />
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
                      <Label>Budget Range</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-50">₹0 - ₹50L</SelectItem>
                          <SelectItem value="50-100">₹50L - ₹1Cr</SelectItem>
                          <SelectItem value="100-200">₹1Cr - ₹2Cr</SelectItem>
                          <SelectItem value="200+">₹2Cr+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Property Type</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="plot">Plot</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Notification Preferences</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select notification frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button className="bg-red-500 hover:bg-red-600">
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Verification</h4>
                        <p className="text-sm text-gray-600">Your email is verified and secure</p>
                      </div>
                      <Badge className="bg-green-500">Verified</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Phone Verification</h4>
                        <p className="text-sm text-gray-600">Your phone number is verified</p>
                      </div>
                      <Badge className="bg-green-500">Verified</Badge>
                    </div>

                    
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                        <p className="text-sm text-gray-600">Control who can see your profile</p>
                      </div>
                      <Select defaultValue="private">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Contact Information</h4>
                        <p className="text-sm text-gray-600">Show contact info to property owners</p>
                      </div>
                      <Select defaultValue="verified">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="verified">Verified Only</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card> */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}