"use client";

import { useState } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface FeatureGateProps {
  feature: string;
  valueProp: string;
  description?: string;
  benefits?: string[];
  children?: React.ReactNode;
  className?: string;
  variant?: "overlay" | "card" | "inline";
}

const featureConfigs: Record<string, { icon: any; color: string }> = {
  favorites: { icon: Lock, color: "red" },
  compare: { icon: Lock, color: "blue" },
  "save-search": { icon: Lock, color: "green" },
  "price-alerts": { icon: Lock, color: "orange" },
  recommendations: { icon: Sparkles, color: "purple" },
  "viewing-history": { icon: Lock, color: "gray" },
};

export function FeatureGate({
  feature,
  valueProp,
  description,
  benefits = [],
  children,
  className,
  variant = "overlay",
}: FeatureGateProps) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [showPrompt, setShowPrompt] = useState(false);
  const config = featureConfigs[feature] || { icon: Lock, color: "blue" };
  const Icon = config.icon;

  // If authenticated, show the feature
  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleSignup = () => {
    // Track feature gate click
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: "feature_gate_click",
        feature,
        value_prop: valueProp,
      });
    }

    router.push("/auth/signup");
  };

  // Overlay variant - covers the feature
  if (variant === "overlay") {
    return (
      <div className={`relative ${className}`}>
        {children}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-lg flex items-center justify-center z-10"
        >
          <Card className="w-full max-w-sm mx-4 border-2 shadow-xl">
            <CardContent className="p-6 text-center">
              <div
                className={`inline-flex p-3 rounded-full bg-${config.color}-100 mb-4`}
              >
                <Icon className={`w-6 h-6 text-${config.color}-600`} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{valueProp}</h3>
              {description && (
                <p className="text-sm text-gray-600 mb-4">{description}</p>
              )}
              {benefits.length > 0 && (
                <div className="space-y-2 mb-4 text-left">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500`}
                      />
                      <span className="text-xs text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}
              <Button
                onClick={handleSignup}
                className={`w-full bg-${config.color}-600 hover:bg-${config.color}-700 text-white`}
              >
                Sign up free
              </Button>
              <p className="text-xs text-gray-500 mt-3">
                Takes less than 30 seconds
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Card variant - shows as a card
  if (variant === "card") {
    return (
      <Card className={`${className} border-2 border-dashed`}>
        <CardContent className="p-6 text-center">
          <div
            className={`inline-flex p-3 rounded-full bg-${config.color}-100 mb-4`}
          >
            <Icon className={`w-6 h-6 text-${config.color}-600`} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{valueProp}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-4">{description}</p>
          )}
          <Button
            onClick={handleSignup}
            className={`bg-${config.color}-600 hover:bg-${config.color}-700 text-white`}
          >
            Sign up to unlock
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Inline variant - shows inline with content
  return (
    <div
      className={`${className} flex items-center justify-center p-4 border-2 border-dashed rounded-lg`}
    >
      <div className="text-center">
        <Icon className={`w-8 h-8 text-${config.color}-600 mx-auto mb-2`} />
        <p className="text-sm font-medium text-gray-900 mb-1">{valueProp}</p>
        <Button
          onClick={handleSignup}
          size="sm"
          className={`bg-${config.color}-600 hover:bg-${config.color}-700 text-white`}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
}
