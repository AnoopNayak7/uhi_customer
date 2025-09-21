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
  Phone, 
  ArrowLeft, 
  AlertCircle,
  Shield,
  User
} from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or WhatsApp number"),
});

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type LoginForm = z.infer<typeof loginSchema>;
type OTPForm = z.infer<typeof otpSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [otpType, setOtpType] = useState<"email" | "sms">("email");
  const [loading, setLoading] = useState(false);

  const identifierForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const onIdentifierSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response: any = await apiClient.login(data.identifier);
      if (response.success) {
        setIdentifier(data.identifier);
        setOtpType(response.data.type);
        setStep("otp");
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to send OTP. Please try again.";
      
      // Check if it's a user not found error
      if (errorMessage.includes("User not found") || errorMessage.includes("404") || error.response?.status === 404) {
        toast.error("Account not found. Redirecting to signup...", {
          duration: 3000,
        });
        // Redirect to signup page after a short delay
        setTimeout(() => {
          router.push("/auth/signup");
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const onOTPSubmit = async (data: OTPForm) => {
    setLoading(true);
    try {
      const response: any = await apiClient.verifyOTP(identifier, data.otp);
      if (response.success) {
        const { user, token } = response.data;
        login(user, token);
        toast.success("Login successful!");
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
                <Logo />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center space-y-2"
              >
                <CardTitle className="text-3xl font-bold text-black">
                  {step === "identifier" ? "Welcome Back" : "Verify OTP"}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  {step === "identifier"
                    ? "Enter your email or WhatsApp number to sign in"
                    : `We've sent a 6-digit code to ${identifier}`}
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="px-6 pb-8">
              <AnimatePresence mode="wait">
                {step === "identifier" ? (
                  <motion.form
                    key="identifier"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={identifierForm.handleSubmit(onIdentifierSubmit)}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="identifier" className="text-sm font-semibold text-gray-700">
                        Email or WhatsApp Number *
                      </Label>
                      <div className="relative group">
                        {identifier.includes('@') ? (
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        ) : (
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        )}
                        <Input
                          {...identifierForm.register("identifier")}
                          type="text"
                          placeholder="Enter your email or WhatsApp number"
                          className="pl-10 h-12 border-2 border-gray-200 focus:border-red-500 focus:ring-0 transition-all duration-200 rounded-xl"
                          style={{ fontSize: '16px' }} // Prevent zoom on mobile
                        />
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        For WhatsApp: Enter 10-digit number. For email: Enter your email address.
                      </p>
                      {identifierForm.formState.errors.identifier && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-500 flex items-center gap-1"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {identifierForm.formState.errors.identifier?.message}
                        </motion.p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending OTP...
                          </div>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </motion.div>
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
                        onClick={() => setStep("identifier")}
                        className="mb-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to login
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
                          "Verify & Sign In"
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
                        onClick={() => onIdentifierSubmit({ identifier })}
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
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-red-500 hover:text-red-600 font-semibold hover:underline transition-colors"
                >
                  Sign up
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
