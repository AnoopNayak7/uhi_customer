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
import { Mail, ArrowLeft } from "lucide-react";
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
import { HERO_IMAGES } from "@/lib/images";

const loginSchema = z.object({
  identifier: z.string().email("Please enter a valid email address"),
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
        setStep("otp");
        toast.success(response.data.message || "OTP sent to your email");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to send OTP. Please try again.";

      if (
        errorMessage.includes("User not found") ||
        errorMessage.includes("404") ||
        error.response?.status === 404
      ) {
        toast.error("Account not found. Redirecting to signup...", {
          duration: 3000,
        });
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
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      toast.error(getOtpErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      eyebrow="Welcome back"
      title="sign in"
      subtitle={
        step === "identifier"
          ? "Enter your email and we'll send you a one-time code to sign in securely."
          : `We've sent a 6-digit code to ${identifier}`
      }
      image={HERO_IMAGES.main_hero}
      imageAlt="Modern apartment building in Bengaluru"
      imageEyebrow="Urbanhousein"
      imageTagline="Find your next home in Bengaluru"
      footer={
        <p className="text-center font-manrope text-sm text-[#717171]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-[#303030] underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      }
    >
      {step === "identifier" ? (
        <form
          onSubmit={identifierForm.handleSubmit(onIdentifierSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="identifier" className={authLabelClassName}>
              Email address
            </Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8A8A8A]"
                strokeWidth={1.5}
              />
              <Input
                {...identifierForm.register("identifier")}
                id="identifier"
                type="email"
                placeholder="you@example.com"
                className={`${authInputClassName} pl-10`}
                style={{ fontSize: "16px" }}
              />
            </div>
            {identifierForm.formState.errors.identifier && (
              <p className="font-manrope text-xs text-red-600">
                {identifierForm.formState.errors.identifier.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={authSubmitClassName}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep("identifier")}
            className="-ml-2 h-8 font-manrope text-xs text-[#5C5C5C] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]"
          >
            <ArrowLeft className="mr-1.5 size-3.5" strokeWidth={1.5} />
            Change email
          </Button>

          <form
            onSubmit={otpForm.handleSubmit(onOTPSubmit)}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="otp" className={authLabelClassName}>
                Enter OTP
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
              {loading ? "Verifying..." : "Verify & sign in"}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => onIdentifierSubmit({ identifier })}
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
