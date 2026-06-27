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
import { FieldError } from "@/components/ui/field-error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, User, Phone, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { getOtpErrorMessage } from "@/lib/auth-errors";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => {
      let digits = val.replace(/\D/g, "");
      if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
      if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
      return digits;
    })
    .pipe(
      z
        .string()
        .regex(
          /^[6-9]\d{9}$/,
          "Enter a valid 10-digit Indian mobile number"
        )
    ),
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
  const [otpChannel, setOtpChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

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
      // Show WhatsApp messaging in UI; backend delivers OTP via email until WA is live
      setOtpChannel(data.phone ? "whatsapp" : "email");
      setStep("otp");
      toast.success(
        data.phone
          ? "Account created! OTP sent to your WhatsApp"
          : res.message || "Account created! OTP sent to your email"
      );
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
        if (error.message.includes("email is already registered") || 
            error.message.includes("Email is already registered")) {
          errorMessage = "Email is already registered. Please login instead.";
        } else if (!error.message.includes("API Error") && !error.message.includes("Failed to fetch")) {
          errorMessage = error.message;
        }
      }

      // Special handling for 409 status (conflict)
      if (error.response?.status === 409) {
        const field = error.response?.data?.data?.field;
        errorMessage =
          field === "phone"
            ? "This phone number is already registered. Please login instead."
            : "Email is already registered. Please login instead.";
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
        signupData.email,
        data.otp
      );
      if (response.success) {
        const { user, token } = response.data;
        login(user, token);
        toast.success("Account verified successfully!");
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      toast.error(getOtpErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-lg font-semibold">
              {step === "signup" ? "Create Account" : "Verify Email"}
            </CardTitle>
            <CardDescription className="text-xs">
              {step === "signup"
                ? "Join Urbanhousein to find your perfect property"
                : otpChannel === "whatsapp"
                  ? `We've sent a verification code to WhatsApp (+91 ${signupData?.phone})`
                  : `We've sent a verification code to ${signupData?.email}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "signup" ? (
            <form
              onSubmit={signupForm.handleSubmit(onSignupSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...signupForm.register("firstName")}
                      id="firstName"
                      placeholder="John"
                      aria-invalid={!!signupForm.formState.errors.firstName}
                      aria-describedby={
                        signupForm.formState.errors.firstName
                          ? "firstName-error"
                          : undefined
                      }
                      className="pl-10 h-10 text-sm"
                      style={{ fontSize: '16px' }} // Prevent zoom on mobile
                    />
                  </div>
                  <FieldError
                    id="firstName-error"
                    message={signupForm.formState.errors.firstName?.message}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last Name (Optional)</Label>
                  <Input
                    {...signupForm.register("lastName")}
                    id="lastName"
                    placeholder="Doe"
                    aria-invalid={!!signupForm.formState.errors.lastName}
                    aria-describedby={
                      signupForm.formState.errors.lastName
                        ? "lastName-error"
                        : undefined
                    }
                    className="h-10 text-sm"
                    style={{ fontSize: '16px' }} // Prevent zoom on mobile
                  />
                  <FieldError
                    id="lastName-error"
                    message={signupForm.formState.errors.lastName?.message}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...signupForm.register("email")}
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    aria-invalid={!!signupForm.formState.errors.email}
                    aria-describedby={
                      signupForm.formState.errors.email ? "email-error" : undefined
                    }
                    className="pl-10 h-10 text-sm"
                    style={{ fontSize: '16px' }} // Prevent zoom on mobile
                  />
                </div>
                <FieldError
                  id="email-error"
                  message={signupForm.formState.errors.email?.message}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...signupForm.register("phone")}
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="9876543210"
                    aria-invalid={!!signupForm.formState.errors.phone}
                    aria-describedby={
                      signupForm.formState.errors.phone
                        ? "phone-error phone-hint"
                        : "phone-hint"
                    }
                    className="pl-10 h-10 text-sm"
                    style={{ fontSize: "16px" }}
                  />
                </div>
                <p id="phone-hint" className="text-xs text-muted-foreground">
                  10-digit Indian mobile number (OTP sent on WhatsApp)
                </p>
                <FieldError
                  id="phone-error"
                  message={signupForm.formState.errors.phone?.message}
                />
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-sm bg-primary hover:bg-primary/90"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {showLoginPrompt && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-yellow-800">
                        Email already registered
                      </p>
                      <p className="text-xs text-yellow-600 mt-0.5">
                        This email is already associated with an account
                      </p>
                    </div>
                    <Button
                      onClick={() => router.push("/auth/login")}
                      size="sm"
                      className="h-8 text-xs bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Login
                    </Button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("signup")}
                className="h-8 text-xs -mb-2"
              >
                <ArrowLeft className="w-3 h-3 mr-1.5" />
                Back to signup
              </Button>

              <form
                onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Enter Verification Code</Label>
                  <Input
                    {...otpForm.register("otp")}
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    maxLength={6}
                    aria-invalid={!!otpForm.formState.errors.otp}
                    aria-describedby={
                      otpForm.formState.errors.otp ? "otp-error" : undefined
                    }
                    className="text-center text-base tracking-widest h-10"
                    style={{ fontSize: '16px' }} // Prevent zoom on mobile
                  />
                  <FieldError
                    id="otp-error"
                    message={otpForm.formState.errors.otp?.message}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 text-sm bg-primary hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Complete"}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() =>
                    signupData && apiClient.sendOTP(signupData.email)
                  }
                  disabled={loading}
                  className="text-xs h-auto p-0"
                >
                  Didn&apos;t receive code? Resend
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground pt-2 border-t">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-red-500 hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
