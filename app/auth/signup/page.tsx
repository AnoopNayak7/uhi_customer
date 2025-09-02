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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, User, Phone, ArrowLeft } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { toast } from "sonner";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z
    .string()
    .min(1, "Last name must be at least 1 character")
    .or(z.literal("")),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  role: z.enum(["user", "builder"], {
    required_error: "Please select a role",
  }),
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

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const otpForm = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const onSignupSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      await apiClient.signup(data);
      // await apiClient.sendOTP(data.email);
      setSignupData(data);
      setStep("otp");
      toast.success("Account created! OTP sent to your email");
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
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
              {step === "signup" ? "Create Account" : "Verify Email"}
            </CardTitle>
            <CardDescription>
              {step === "signup"
                ? "Join UrbanHouseIN to find your perfect property"
                : `We've sent a verification code to ${signupData?.email}`}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "signup" ? (
            <form
              onSubmit={signupForm.handleSubmit(onSignupSubmit)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      {...signupForm.register("firstName")}
                      placeholder="John"
                      className="pl-10"
                    />
                  </div>
                  {signupForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {signupForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    {...signupForm.register("lastName")}
                    placeholder="Doe"
                  />
                  {signupForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500">
                      {signupForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...signupForm.register("email")}
                    type="email"
                    placeholder="john@example.com"
                    className="pl-10"
                  />
                </div>
                {signupForm.formState.errors.email && (
                  <p className="text-sm text-red-500">
                    {signupForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...signupForm.register("phone")}
                    placeholder="9876543210"
                    className="pl-10"
                  />
                </div>
                {signupForm.formState.errors.phone && (
                  <p className="text-sm text-red-500">
                    {signupForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">I am a</Label>
                <Select
                  onValueChange={(value) =>
                    signupForm.setValue("role", value as "user" | "builder")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Property Buyer/Renter</SelectItem>
                    <SelectItem value="builder">Builder/Developer</SelectItem>
                  </SelectContent>
                </Select>
                {signupForm.formState.errors.role && (
                  <p className="text-sm text-red-500">
                    {signupForm.formState.errors.role.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("signup")}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to signup
              </Button>

              <form
                onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter Verification Code</Label>
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
                  className="text-sm"
                >
                  Didn&apos;t receive code? Resend
                </Button>
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
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
