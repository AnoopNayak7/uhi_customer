"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, User, Phone, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { getOtpErrorMessage } from "@/lib/auth-errors";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";
import {
  AuthPageShell,
  authInputClassName,
  authLabelClassName,
  authSubmitClassName,
} from "@/components/auth/auth-page-shell";
import { PROPERTY_IMAGES } from "@/lib/images";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => {
      let digits = val.replace(/\D/g, "");
      if (digits.length === 12 && digits.startsWith("91"))
        digits = digits.slice(2);
      if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
      return digits;
    })
    .pipe(
      z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")
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

      if (res.success === false) {
        toast.error(res.message || "Failed to create account. Please try again.");
        return;
      }

      setSignupData(data);
      setOtpChannel(data.phone ? "whatsapp" : "email");
      setStep("otp");
      toast.success(
        data.phone
          ? "Account created! OTP sent to your WhatsApp"
          : res.message || "Account created! OTP sent to your email"
      );
    } catch (error: any) {
      let errorMessage = "Failed to create account. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.message) {
        if (
          error.message.includes("email is already registered") ||
          error.message.includes("Email is already registered")
        ) {
          errorMessage = "Email is already registered. Please login instead.";
        } else if (
          !error.message.includes("API Error") &&
          !error.message.includes("Failed to fetch")
        ) {
          errorMessage = error.message;
        }
      }

      if (error.response?.status === 409) {
        const field = error.response?.data?.data?.field;
        errorMessage =
          field === "phone"
            ? "This phone number is already registered. Please login instead."
            : "Email is already registered. Please login instead.";
        setShowLoginPrompt(true);
      }

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
    <AuthPageShell
      eyebrow="Get started"
      title={step === "signup" ? "create account" : "verify account"}
      subtitle={
        step === "signup"
          ? "Join Urbanhousein to save properties, book visits, and get personalised recommendations."
          : otpChannel === "whatsapp"
            ? `We've sent a verification code to WhatsApp (+91 ${signupData?.phone})`
            : `We've sent a verification code to ${signupData?.email}`
      }
      image={PROPERTY_IMAGES.luxury_home_1}
      imageAlt="Beautiful modern home interior"
      imageEyebrow="Your property journey"
      imageTagline="Discover spaces you'll love calling home"
      footer={
        <p className="text-center font-manrope text-sm text-[#717171]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-[#303030] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {step === "signup" ? (
        <form
          onSubmit={signupForm.handleSubmit(onSignupSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className={authLabelClassName}>
                First name
              </Label>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A8A8A]"
                  strokeWidth={1.5}
                />
                <Input
                  {...signupForm.register("firstName")}
                  id="firstName"
                  placeholder="John"
                  className={`${authInputClassName} pl-10`}
                  style={{ fontSize: "16px" }}
                />
              </div>
              {signupForm.formState.errors.firstName && (
                <p className="font-manrope text-xs text-red-600">
                  {signupForm.formState.errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className={authLabelClassName}>
                Last name
              </Label>
              <Input
                {...signupForm.register("lastName")}
                id="lastName"
                placeholder="Optional"
                className={authInputClassName}
                style={{ fontSize: "16px" }}
              />
              {signupForm.formState.errors.lastName && (
                <p className="font-manrope text-xs text-red-600">
                  {signupForm.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className={authLabelClassName}>
              Email address
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A8A8A]"
                strokeWidth={1.5}
              />
              <Input
                {...signupForm.register("email")}
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`${authInputClassName} pl-10`}
                style={{ fontSize: "16px" }}
              />
            </div>
            {signupForm.formState.errors.email && (
              <p className="font-manrope text-xs text-red-600">
                {signupForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className={authLabelClassName}>
              Phone number
            </Label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A8A8A]"
                strokeWidth={1.5}
              />
              <Input
                {...signupForm.register("phone")}
                id="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                placeholder="9876543210"
                className={`${authInputClassName} pl-10`}
                style={{ fontSize: "16px" }}
              />
            </div>
            <p className="font-manrope text-xs text-[#8A8A8A]">
              10-digit Indian mobile — OTP sent on WhatsApp
            </p>
            {signupForm.formState.errors.phone && (
              <p className="font-manrope text-xs text-red-600">
                {signupForm.formState.errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={authSubmitClassName}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>

          {showLoginPrompt && (
            <div className="rounded-[12px] border border-[#F0E6D6] bg-[#FFFBF5] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-manrope text-sm font-medium text-[#8A6B3F]">
                    Account already exists
                  </p>
                  <p className="mt-0.5 font-manrope text-xs text-[#9A7B4F]">
                    This email or phone is already registered
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/auth/login")}
                  size="sm"
                  className="h-9 shrink-0 rounded-full bg-[#303030] px-4 font-manrope text-xs text-white hover:bg-[#1a1a1a]"
                >
                  Sign in
                </Button>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="space-y-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("signup")}
            className="-ml-2 h-8 font-manrope text-xs text-[#5C5C5C] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="mr-1.5 size-3.5" strokeWidth={1.5} />
            Back to signup
          </Button>

          <form
            onSubmit={otpForm.handleSubmit(onOTPSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="otp" className={authLabelClassName}>
                Verification code
              </Label>
              <Input
                {...otpForm.register("otp")}
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="000000"
                maxLength={6}
                className={`${authInputClassName} text-center tracking-[0.35em]`}
                style={{ fontSize: "16px" }}
              />
              {otpForm.formState.errors.otp && (
                <p className="font-manrope text-xs text-red-600">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className={authSubmitClassName}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & complete"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => signupData && apiClient.sendOTP(signupData.email)}
              disabled={loading}
              className="h-auto p-0 font-manrope text-xs text-[#5C5C5C] hover:text-[#303030]"
            >
              Didn&apos;t receive the code? Resend
            </Button>
          </div>
        </div>
      )}
    </AuthPageShell>
  );
}
