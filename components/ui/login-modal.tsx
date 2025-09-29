"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Heart, Building, Search, BarChart3, MapPin, ArrowLeft } from "lucide-react";
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
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const { login, sendOTP, verifyOTP }: any = useAuthStore();
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setOtp("");
      setShowOTP(false);
      setOtpError("");
      setOtpTimer(0);
    }
  }, [isOpen]);

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
      setShowOTP(true);
      setOtpTimer(60); // 60 seconds timer
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = otp.split('');
    newOtp[index] = value;
    const updatedOtp = newOtp.join('');
    setOtp(updatedOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (updatedOtp.length === 6) {
      handleVerifyOTP(updatedOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp;
    if (otpToVerify.length !== 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(email, otpToVerify);
      toast.success("Login successful!");
      onSuccess?.();
      onClose();
    } catch (error) {
      setOtpError("Invalid OTP. Please try again.");
      setOtp("");
      // Focus first input
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    setIsLoading(true);
    try {
      await sendOTP(email);
      toast.success("OTP resent to your email!");
      setOtpTimer(60);
      setOtp("");
      setOtpError("");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-sm bg-white/95 backdrop-blur-md border-0 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center pb-4 relative">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {showOTP ? "Enter OTP" : "Login to Continue"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 transition-all duration-200 hover:scale-105"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-br from-red-50 to-pink-50 rounded-full border border-red-100 shadow-lg">
                <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
            </div>
          </div>

          {showOTP ? (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                We&apos;ve sent a 6-digit code to
              </p>
              <p className="text-gray-900 font-semibold text-base">{email}</p>
            </div>
          ) : (
            <p className="text-gray-600 text-sm leading-relaxed px-2">
              Login to add properties to favourites and access all features
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {showOTP ? (
            <div className="space-y-4">
              {/* OTP Input Fields */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[index] || ""}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-10 h-10 text-center text-lg font-bold border-2 border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded-lg transition-all duration-200 hover:border-gray-300 shadow-sm"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {otpError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm text-center font-medium">{otpError}</p>
                </div>
              )}

              {/* Timer and Resend */}
              <div className="text-center">
                {otpTimer > 0 ? (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-600">
                      Resend OTP in <span className="font-semibold text-gray-900">{otpTimer}s</span>
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm text-red-500 hover:text-red-600 hover:underline font-medium transition-colors duration-200 disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Back to Email */}
              <div className="text-center">
                <button
                  onClick={() => setShowOTP(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 hover:underline flex items-center justify-center space-x-2 transition-colors duration-200"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Change email</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Sign In and Sign Up Buttons */}
              <div className="space-y-3">
                <Link href="/auth/login" className="block">
                  <Button
                    className="w-full h-10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={onClose}
                  >
                    Sign In
                  </Button>
                </Link>
                
                <Link href="/auth/signup" className="block">
                  <Button
                    variant="outline"
                    className="w-full h-10 border-2 border-red-500 text-red-500 hover:bg-red-50 hover:border-red-600 font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md"
                    onClick={onClose}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Features Preview - Only show on email screen */}
          {!showOTP && (
            <>
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3 text-center text-base">
                  Unlock Premium Features
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 hover:shadow-md transition-all duration-200">
                    <div className="p-1.5 bg-red-100 rounded-md">
                      <Heart className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Save Favourites</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-md transition-all duration-200">
                    <div className="p-1.5 bg-blue-100 rounded-md">
                      <Building className="w-3 h-3 text-blue-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Property Alerts</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 hover:shadow-md transition-all duration-200">
                    <div className="p-1.5 bg-green-100 rounded-md">
                      <Search className="w-3 h-3 text-green-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Advanced Search</span>
                  </div>
                  <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 hover:shadow-md transition-all duration-200">
                    <div className="p-1.5 bg-purple-100 rounded-md">
                      <BarChart3 className="w-3 h-3 text-purple-500" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Compare Properties</span>
                  </div>
                </div>
              </div>

              {/* Real Estate Tools CTA */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl text-center border border-gray-200 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2 text-base">
                  Use Real Estate Tools
                </h4>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  Manage and find better homes with our comprehensive tools
                </p>
                <Link href="/tools">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full h-8 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] text-xs"
                  >
                    Explore Tools
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
