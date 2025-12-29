"use client";

import { useState, useEffect } from "react";
import {
  X,
  Heart,
  Bell,
  BarChart3,
  Search,
  Sparkles,
  Check,
  User,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useFeatureFlag } from "@/hooks/use-feature-flags";
import { apiClient } from "@/lib/api";
import { toast } from "sonner";

interface SmartSignupPromptProps {
  trigger:
    | "favorite"
    | "compare"
    | "save-search"
    | "tool-usage"
    | "engagement"
    | "exit-intent";
  context?: {
    propertyTitle?: string;
    toolName?: string;
    action?: string;
  };
  onDismiss?: () => void;
  onSignup?: () => void;
}

const promptConfigs = {
  favorite: {
    title: "Save Your Favorites",
    description: "Sign up to save properties and get instant price drop alerts",
    icon: Heart,
    benefits: [
      "Save unlimited properties",
      "Get price drop notifications",
      "Access from any device",
    ],
    cta: "Sign up to save",
    color: "red",
  },
  compare: {
    title: "Compare Properties",
    description: "Sign up to compare up to 3 properties side-by-side",
    icon: BarChart3,
    benefits: [
      "Compare up to 3 properties",
      "Side-by-side analysis",
      "Save comparisons",
    ],
    cta: "Sign up to compare",
    color: "blue",
  },
  "save-search": {
    title: "Save Your Search",
    description: "Get email alerts when new properties match your criteria",
    icon: Bell,
    benefits: [
      "Email alerts for new properties",
      "Save multiple searches",
      "Never miss a match",
    ],
    cta: "Sign up for alerts",
    color: "green",
  },
  "tool-usage": {
    title: "Save Your Calculations",
    description: "Sign up to save and access your calculations anytime",
    icon: BarChart3,
    benefits: [
      "Save all calculations",
      "Access from dashboard",
      "Export and share results",
    ],
    cta: "Sign up to save",
    color: "purple",
  },
  engagement: {
    title: "Get Personalized Recommendations",
    description:
      "Sign up to get AI-powered property suggestions based on your preferences",
    icon: Sparkles,
    benefits: [
      "Personalized recommendations",
      "Advanced search filters",
      "Property viewing history",
    ],
    cta: "Sign up free",
    color: "orange",
  },
  "exit-intent": {
    title: "Wait! Don't Miss Out",
    description: "Sign up to save your favorites and get price alerts",
    icon: Heart,
    benefits: [
      "Save your favorite properties",
      "Get price drop notifications",
      "Access from anywhere",
    ],
    cta: "Sign up now",
    color: "red",
  },
};

export function SmartSignupPrompt({
  trigger,
  context,
  onDismiss,
  onSignup,
}: SmartSignupPromptProps) {
  const [open, setOpen] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const config = promptConfigs[trigger];
  const Icon = config.icon;

  // Check feature flag - default to true if not found or fetch fails
  const { enabled: signupPromptsEnabled, loading: flagsLoading } =
    useFeatureFlag(
      "signup_prompts_enabled",
      true // Default to enabled if flag not found or fetch fails
    );

  // Don't show if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setOpen(false);
    }
  }, [isAuthenticated]);

  // Don't render if authenticated
  if (isAuthenticated) {
    return null;
  }

  // If feature flags are still loading, show the modal (optimistic)
  // If feature flag is disabled, don't show
  if (!flagsLoading && !signupPromptsEnabled) {
    return null;
  }

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!phone.trim()) {
      newErrors.phone = "Mobile number is required";
    } else {
      // Validate Indian phone number (10 digits, starting with 6-9)
      const phoneRegex = /^[6-9]\d{9}$/;
      const cleanedPhone = phone.replace(/\s/g, "").replace(/^\+91/, "");
      if (!phoneRegex.test(cleanedPhone)) {
        newErrors.phone = "Please enter a valid 10-digit mobile number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean phone number (remove spaces and +91 prefix if present)
      const cleanedPhone = phone.replace(/\s/g, "").replace(/^\+91/, "");

      // Track signup intent
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "signup_prompt_submit",
          trigger,
          context,
        });
      }

      // Create lead instead of signing up
      await apiClient.createSignupLead({
        name: name.trim(),
        phone: cleanedPhone,
        trigger,
        context: {
          ...context,
          source: "signup_prompt",
          timestamp: new Date().toISOString(),
        },
      });

      // Track success
      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "signup_prompt_lead_created",
          trigger,
          context,
        });
      }

      toast.success("Thank you! We'll contact you soon.");

      setOpen(false);
      onSignup?.();

      // Optionally redirect or just close the modal
      // You can redirect to a thank you page or just close
      // router.push("/thank-you");
    } catch (error: any) {
      console.error("Lead creation error:", error);

      // Handle errors
      toast.error(
        error.response?.data?.message ||
          "Failed to submit your information. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setOpen(false);

    // Track dismissal
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "signup_prompt_dismiss",
        trigger,
      });
    }

    // Save dismissal to localStorage (don't show again for 24 hours)
    localStorage.setItem(
      `signup-prompt-dismissed-${trigger}`,
      Date.now().toString()
    );

    onDismiss?.();
  };

  const colorConfig = {
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
      dot: "bg-red-500",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      dot: "bg-blue-500",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      button: "bg-green-600 hover:bg-green-700",
      dot: "bg-green-500",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      button: "bg-purple-600 hover:bg-purple-700",
      dot: "bg-purple-500",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      button: "bg-orange-600 hover:bg-orange-700",
      dot: "bg-orange-500",
    },
  };

  const colors =
    colorConfig[config.color as keyof typeof colorConfig] || colorConfig.blue;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleDismiss();
        }
      }}
    >
      <DialogContent
        className={`sm:max-w-md ${colors.bg} ${colors.border} border-2 shadow-2xl`}
        onInteractOutside={(e) => {
          // Prevent closing on outside click for exit-intent
          if (trigger === "exit-intent") {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={handleDismiss}
      >
        <DialogHeader className="text-left">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`p-3 rounded-lg ${colors.iconBg}`}>
              <Icon className={`w-6 h-6 ${colors.iconColor}`} />
            </div>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              {config.title}
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-gray-700 pt-2">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSignup} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={`pl-10 h-11 ${errors.name ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Mobile Number *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={phone}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, "");
                  // Limit to 10 digits
                  const limitedValue = value.slice(0, 10);
                  setPhone(limitedValue);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                className={`pl-10 h-11 ${errors.phone ? "border-red-500" : ""}`}
                disabled={isSubmitting}
                maxLength={10}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500">
              We&apos;ll contact you shortly with more information
            </p>
          </div>

          <div className="space-y-2 my-4">
            {config.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${colors.dot} flex-shrink-0`}
                />
                <span className="text-sm text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 ${colors.button} text-white h-11 text-base font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-50`}
              size="lg"
            >
              {isSubmitting ? "Submitting..." : config.cta}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleDismiss}
              disabled={isSubmitting}
              className="sm:w-auto w-full h-11 text-gray-600 hover:text-gray-900 border-gray-300"
            >
              Maybe Later
            </Button>
          </div>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Takes less than 30 seconds • No credit card required
        </p>
      </DialogContent>
    </Dialog>
  );
}
