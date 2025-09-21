"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Logo } from "@/components/ui/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Mail, 
  User, 
  Phone, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Sparkles
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian WhatsApp number"),
  role: z.enum(["user", "builder"]).default("user"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type SignupForm = z.infer<typeof signupSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [signupData, setSignupData] = useState<SignupForm | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  // Reset login prompt when user starts typing
  const handlePhoneChange = () => {
    if (showLoginPrompt) {
      setShowLoginPrompt(false);
    }
  };

  const onSignupSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      const res: any = await apiClient.signup(data);
      
      // Check if the response indicates success
      if (res.success === false) {
        toast.error(res.message || "Failed to create account. Please try again.");
        return;
      }
      
      setSignupData(data);
      setStep("otp");
      toast.success("Account created! OTP sent to your WhatsApp number");
    } catch (error: any) {
      console.log("Signup error:", error);
      console.log("Error response:", error.response);
      console.log("Error message:", error.message);

      // Extract error message from the error response
      let errorMessage = "Failed to create account. Please try again.";

      // Check for specific error patterns
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        // Handle case where data is the error message directly
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        // Check if it's a meaningful error message
        if (error.message.includes("WhatsApp number is already registered") || 
            error.message.includes("Phone number is already registered")) {
          errorMessage = "WhatsApp number is already registered. Please login instead.";
        } else if (!error.message.includes("API Error") && !error.message.includes("Failed to fetch")) {
          errorMessage = error.message;
        }
      }

      // Special handling for 409 status (conflict)
      if (error.response?.status === 409) {
        errorMessage = "WhatsApp number is already registered. Please login instead.";
        setShowLoginPrompt(true);
      }

      console.log("Final error message:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPForm) => {
    if (!signupData) return;

    setLoading(true);
    try {
      const response: any = await apiClient.verifyOTP(
        signupData.phone,
        data.otp
      );
      if (response.success) {
        const { user, token } = response.data;
        login(user, token);
        toast.success("Account verified successfully!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Invalid OTP. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-40" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23DC2626' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl shadow-red-500/10">
            <CardHeader className="space-y-6 pb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center"
              >
                <div className="relative">
                  <Logo />
                  
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center space-y-2"
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r text-black bg-clip-text">
                  {step === "signup" ? "Create Account" : "Verify WhatsApp"}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {step === "signup"
                    ? "Join Urbanhousein to find your perfect property"
                    : `We've sent a verification code to your WhatsApp number ${signupData?.phone}`}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <AnimatePresence mode="wait">
                {step === "signup" ? (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={signupForm.handleSubmit(onSignupSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">
                          First Name *
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                          <Input
                            {...signupForm.register("firstName")}
                            placeholder="John"
                            className="pl-10 h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-0 transition-all duration-200 rounded-xl"
                            style={{ fontSize: '16px' }} // Prevent zoom on mobile
                          />
                        </div>
                        {signupForm.formState.errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {signupForm.formState.errors.firstName?.message}
                          </motion.p>
                        )}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">
                          Last Name
                        </Label>
                        <div className="relative group">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                          <Input
                            {...signupForm.register("lastName")}
                            placeholder="Doe"
                            className="pl-10 h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-0 transition-all duration-200 rounded-xl"
                            style={{ fontSize: '16px' }} // Prevent zoom on mobile
                          />
                        </div>
                        {signupForm.formState.errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {signupForm.formState.errors.lastName?.message}
                          </motion.p>
                        )}
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        <Input
                          {...signupForm.register("email")}
                          type="email"
                          placeholder="john@example.com"
                          className="pl-10 h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-0 transition-all duration-200 rounded-xl"
                          style={{ fontSize: '16px' }} // Prevent zoom on mobile
                        />
                      </div>
                      {signupForm.formState.errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {signupForm.formState.errors.email?.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                        WhatsApp Number *
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        <Input
                          {...signupForm.register("phone")}
                          placeholder="9876543210"
                          className="pl-10 h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-0 transition-all duration-200 rounded-xl"
                          style={{ fontSize: '16px' }} // Prevent zoom on mobile
                          onChange={(e) => {
                            signupForm.setValue("phone", e.target.value);
                            handlePhoneChange();
                          }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Enter your WhatsApp number to receive OTP
                      </p>
                      {signupForm.formState.errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {signupForm.formState.errors.phone?.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                          </div>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </motion.div>

                    <AnimatePresence>
                      {showLoginPrompt && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2">
                              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm text-yellow-800 font-semibold">
                                  WhatsApp number already registered
                                </p>
                                <p className="text-xs text-yellow-600 mt-1">
                                  This number is already associated with an account
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => router.push("/auth/login")}
                              size="sm"
                              className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-2 text-sm font-medium"
                            >
                              Login Instead
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.form>
                ) : (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStep("signup")}
                        className="mb-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to signup
                      </Button>
                    </motion.div>

                    <motion.form
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-semibold text-gray-700">
                          Enter Verification Code
                        </Label>
                        <Input
                          {...otpForm.register("otp")}
                          type="text"
                          placeholder="000000"
                          maxLength={6}
                          className="text-center text-2xl tracking-widest h-14 border-2 border-gray-200 focus:border-red-500 focus:ring-0 transition-all duration-200 rounded-xl"
                          style={{ fontSize: '16px' }} // Prevent zoom on mobile
                        />
                        {otpForm.formState.errors.otp && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500 flex items-center gap-1"
                          >
                            <AlertCircle className="w-4 h-4" />
                            {otpForm.formState.errors.otp?.message}
                          </motion.p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Verifying...
                          </div>
                        ) : (
                          "Verify & Complete"
                        )}
                      </Button>
                    </motion.form>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-center"
                    >
                      <Button
                        variant="link"
                        onClick={() =>
                          signupData && apiClient.sendOTP(signupData.phone)
                        }
                        disabled={loading}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Didn&apos;t receive code? Resend
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center text-sm text-gray-600 mt-8 pt-6 border-t border-gray-200"
              >
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-red-500 hover:text-red-600 font-semibold hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
