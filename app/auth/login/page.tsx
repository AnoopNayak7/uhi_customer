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
import { Mail, Phone, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your email or phone number"),
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
      
      // Check if it's a user not found error
      if (error.message && (error.message.includes("User not found") || error.message.includes("404"))) {
        toast.error("Account not found. Redirecting to signup...", {
          duration: 3000,
        });
        // Redirect to signup page after a short delay
        setTimeout(() => {
          router.push("/auth/signup");
        }, 2000);
      } else {
        toast.error("Failed to send OTP. Please try again.");
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
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">
              {step === "identifier" ? "Welcome Back" : "Verify OTP"}
            </CardTitle>
            <CardDescription>
              {step === "identifier"
                ? "Enter your email or phone number to sign in"
                : `We've sent a 6-digit code to ${identifier}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "identifier" ? (
            <form
              onSubmit={identifierForm.handleSubmit(onIdentifierSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="identifier">Email or Phone Number</Label>
                <div className="relative">
                  {identifier.includes('@') ? (
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  ) : (
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  )}
                  <Input
                    {...identifierForm.register("identifier")}
                    type="text"
                    placeholder="Enter your email or phone number"
                    className="pl-10"
                  />
                </div>
                {identifierForm.formState.errors.identifier && (
                  <p className="text-sm text-red-500">
                    {identifierForm.formState.errors.identifier.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("identifier")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to login
              </Button>

              <form
                onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter OTP</Label>
                  <Input
                    {...otpForm.register("otp")}
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-sm text-red-500">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => onIdentifierSubmit({ identifier })}
                  disabled={loading}
                  className="text-sm"
                >
                  Didn&apos;t receive code? Resend
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-red-500 hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
