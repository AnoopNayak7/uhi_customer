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
import { Mail, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border shadow-sm">
        <CardHeader className="space-y-3 pb-4">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-lg font-semibold">
              {step === "identifier" ? "Welcome Back" : "Verify OTP"}
            </CardTitle>
            <CardDescription className="text-xs">
              {step === "identifier"
                ? "Enter your email address to sign in"
                : `We've sent a 6-digit code to ${identifier}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === "identifier" ? (
            <form
              onSubmit={identifierForm.handleSubmit(onIdentifierSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="identifier" className="text-sm font-medium">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...identifierForm.register("identifier")}
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 h-10 text-sm"
                    style={{ fontSize: '16px' }} // Prevent zoom on mobile
                  />
                </div>
                {identifierForm.formState.errors.identifier && (
                  <p className="text-xs text-destructive">
                    {identifierForm.formState.errors.identifier.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-10 text-sm bg-red-500 hover:bg-red-600"
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
                className="h-8 text-xs -mb-2"
              >
                <ArrowLeft className="w-3 h-3 mr-1.5" />
                Back to login
              </Button>

              <form
                onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-sm font-medium">Enter OTP</Label>
                  <Input
                    {...otpForm.register("otp")}
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-base tracking-widest h-10"
                    style={{ fontSize: '16px' }} // Prevent zoom on mobile
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-xs text-destructive">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 text-sm bg-red-500 hover:bg-red-600"
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
                  className="text-xs h-auto p-0"
                >
                  Didn&apos;t receive code? Resend
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground pt-2 border-t">
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
