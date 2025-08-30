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
import { Switch } from '@/components/ui/switch';
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
  Star,
  Eye,
  BarChart3,
  Bell,
  Shield,
  FileText,
  Settings,
  Calendar,
  Smartphone,
  Globe,
  Lock,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

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
  const [showSuccess, setShowSuccess] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    propertyAlerts: true,
    marketUpdates: false,
    promotionalEmails: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showContactInfo: 'verified',
    allowMessages: true,
    showOnlineStatus: false
  });

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
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, form]);

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const response: any = await apiClient.updateProfile(data);
      if (response.success) {
        updateUser(data);
        toast.success('Profile updated successfully!');
        setEditing(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      // Here you would typically save to backend
      // For now, we'll just show a success message
      // In a real app, you'd call an API endpoint like:
      // await apiClient.updateSettings({ notifications: notificationSettings, privacy: privacySettings });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Please Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 text-center">
              Please login to view your profile.
            </p>
            <Button asChild className="w-full">
              <Link href="/auth/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100">
              <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <User className="w-4 h-4 mr-2 hidden sm:inline" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Settings className="w-4 h-4 mr-2 hidden sm:inline" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Shield className="w-4 h-4 mr-2 hidden sm:inline" />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                  <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 pb-6">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <User className="w-5 h-5 text-gray-600" />
                        <span>Personal Information</span>
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(!editing)}
                        className="w-full sm:w-auto"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {editing ? 'Cancel' : 'Edit Profile'}
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {showSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <p className="text-sm font-medium text-green-800">
                              Profile updated successfully! Your changes have been saved.
                            </p>
                          </div>
                        </div>
                      )}
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                              First Name
                            </Label>
                            <Input
                              {...form.register('firstName')}
                              disabled={!editing}
                              className="h-11 border-gray-200 focus:border-red-500 focus:ring-red-500 focus:ring-2 transition-colors duration-200"
                              placeholder="Enter first name"
                              aria-describedby={editing ? "firstName-error" : undefined}
                            />
                            {form.formState.errors.firstName && (
                              <p id="firstName-error" className="text-sm text-red-500 flex items-center mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
                                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                {form.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                              Last Name
                            </Label>
                            <Input
                              {...form.register('lastName')}
                              disabled={!editing}
                              className="h-11 border-gray-200 focus:border-red-500 focus:ring-red-500 focus:ring-2 transition-colors duration-200"
                              placeholder="Enter last name"
                            />
                            {form.formState.errors.lastName && (
                              <p className="text-sm text-red-500 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {form.formState.errors.lastName.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...form.register('email')}
                              disabled={!editing}
                              className="h-11 pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500 focus:ring-2 transition-colors duration-200"
                              placeholder="Enter email address"
                            />
                          </div>
                          {form.formState.errors.email && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {form.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              {...form.register('phone')}
                              disabled={!editing}
                              className="h-11 pl-10 border-gray-200 focus:border-red-500 focus:ring-red-500 focus:ring-2 transition-colors duration-200"
                              placeholder="Enter phone number"
                            />
                          </div>
                          {form.formState.errors.phone && (
                            <p className="text-sm text-red-500 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {form.formState.errors.phone.message}
                            </p>
                          )}
                          {!editing && !form.getValues('phone') && (
                            <p className="text-sm text-amber-600 flex items-center">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Phone number not set. Please edit to add your phone number.
                            </p>
                          )}
                        </div>

                        {editing && (
                          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                            <Button 
                              type="submit" 
                              disabled={loading}
                              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                            <Button 
                              type="button"
                              variant="outline"
                              onClick={() => setEditing(false)}
                              className="w-full sm:w-auto h-11 px-6"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Profile Stats */}
                <div className="space-y-6">
                  <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">Account Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Account Type</span>
                        <Badge className={user.role === 'builder' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {user.role === 'builder' ? 'Builder' : 'User'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Verification</span>
                        <Badge className={user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Member Since</span>
                        <span className="text-sm text-gray-900">Jan 2024</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" size="sm" className="w-full justify-start h-10" asChild>
                        <Link href="/favourites">
                          <Star className="w-4 h-4 mr-2" />
                          View Favourites
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start h-10" asChild>
                        <Link href="/viewed-properties">
                          <Eye className="w-4 h-4 mr-2" />
                          Recently Viewed
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start h-10" asChild>
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

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-8">
              <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span>Notification Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        Email Notifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Property Alerts</p>
                            <p className="text-xs text-gray-500">Get notified about new properties</p>
                          </div>
                          <Switch
                            checked={notificationSettings.propertyAlerts}
                            onCheckedChange={(checked) => handleNotificationChange('propertyAlerts', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Market Updates</p>
                            <p className="text-xs text-gray-500">Receive market trend updates</p>
                          </div>
                          <Switch
                            checked={notificationSettings.marketUpdates}
                            onCheckedChange={(checked) => handleNotificationChange('marketUpdates', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Promotional Emails</p>
                            <p className="text-xs text-gray-500">Receive special offers and deals</p>
                          </div>
                          <Switch
                            checked={notificationSettings.promotionalEmails}
                            onCheckedChange={(checked) => handleNotificationChange('promotionalEmails', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 flex items-center">
                        <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
                        Other Notifications
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div>
                            <p className="text-sm font-medium text-gray-700">SMS Notifications</p>
                            <p className="text-xs text-gray-500">Receive text messages</p>
                          </div>
                          <Switch
                            checked={notificationSettings.smsNotifications}
                            onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Push Notifications</p>
                            <p className="text-xs text-gray-500">Browser push notifications</p>
                          </div>
                          <Switch
                            checked={notificationSettings.pushNotifications}
                            onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button onClick={saveSettings} className="bg-red-500 hover:bg-red-600" disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Notification Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy" className="space-y-8">
              <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span>Privacy Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Profile Visibility</h4>
                      <Select value={privacySettings.profileVisibility} onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="friends">Friends Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Control who can see your profile information
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Contact Information</h4>
                      <Select value={privacySettings.showContactInfo} onValueChange={(value) => handlePrivacyChange('showContactInfo', value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="verified">Verified Only</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500">
                        Show contact info to property owners
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Additional Privacy Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Allow Messages</p>
                          <p className="text-xs text-gray-500">Let other users send you messages</p>
                        </div>
                        <Switch
                          checked={privacySettings.allowMessages}
                          onCheckedChange={(checked) => handlePrivacyChange('allowMessages', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Show Online Status</p>
                          <p className="text-xs text-gray-500">Display when you're online</p>
                        </div>
                        <Switch
                          checked={privacySettings.showOnlineStatus}
                          onCheckedChange={(checked) => handlePrivacyChange('showOnlineStatus', checked)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <Button onClick={saveSettings} className="bg-red-500 hover:bg-red-600 w-full sm:w-auto" disabled={savingSettings}>
                      {savingSettings ? 'Saving...' : 'Save Privacy Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Legal & Policy Section */}
              <Card className="shadow-sm border-0 bg-white hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span>Legal & Policies</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start h-12" asChild>
                      <Link href="/privacy">
                        <Shield className="w-4 h-4 mr-2" />
                        Privacy Policy
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-12" asChild>
                      <Link href="/terms">
                        <FileText className="w-4 h-4 mr-2" />
                        Terms of Service
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}