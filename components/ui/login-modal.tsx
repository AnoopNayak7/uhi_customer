"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Heart, Building, Search, BarChart3, MapPin } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, sendOTP }: any = useAuthStore();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      await sendOTP(email);
      toast.success("OTP sent to your email!");
      // You can redirect to OTP verification page here
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-semibold">
              Login to Continue
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-red-50 rounded-full">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
          </div>

          <p className="text-gray-600 text-sm">
            Login to add properties to favourites and access all features
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600"
              disabled={isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP & Continue"}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-red-500 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Features Preview */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3 text-center">
              Unlock Premium Features
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Heart className="w-4 h-4 text-red-500" />
                <span>Save Favourites</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building className="w-4 h-4 text-blue-500" />
                <span>Property Alerts</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Search className="w-4 h-4 text-green-500" />
                <span>Advanced Search</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4 text-purple-500" />
                <span>Compare Properties</span>
              </div>
            </div>
          </div>

          {/* Real Estate Tools CTA */}
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h4 className="font-medium text-gray-900 mb-2">
              Use Real Estate Tools
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Manage and find better homes with our comprehensive tools
            </p>
            <Link href="/tools">
              <Button variant="outline" size="sm" className="w-full">
                Explore Tools
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
