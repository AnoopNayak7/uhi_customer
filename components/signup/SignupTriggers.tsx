"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { useExitIntent } from "@/hooks/use-exit-intent";
import { useSignupTriggers } from "@/hooks/use-signup-triggers";
import { SmartSignupPrompt } from "./SmartSignupPrompt";

/**
 * Component that handles all signup triggers:
 * - Exit intent detection
 * - Engagement-based prompts
 */
export function SignupTriggers() {
  const { isAuthenticated } = useAuthStore();
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);
  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const { shouldShowPrompt, markPromptShown, behavior } = useSignupTriggers();

  // Exit intent detection
  useExitIntent(() => {
    if (!isAuthenticated && !showExitIntentModal) {
      // Check if user hasn't dismissed exit intent recently
      const dismissedKey = "signup-prompt-dismissed-exit-intent";
      const dismissedTime = localStorage.getItem(dismissedKey);
      if (dismissedTime) {
        const hoursSinceDismiss =
          (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
        if (hoursSinceDismiss < 24) return; // Don't show if dismissed in last 24 hours
      }
      setShowExitIntentModal(true);
    }
  });

  // Engagement-based prompt
  useEffect(() => {
    if (!isAuthenticated && shouldShowPrompt("engagement")) {
      setShowEngagementModal(true);
      markPromptShown("engagement");
    }
  }, [isAuthenticated, shouldShowPrompt, markPromptShown, behavior]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Exit Intent Modal */}
      {showExitIntentModal && (
        <SmartSignupPrompt
          trigger="exit-intent"
          onDismiss={() => {
            setShowExitIntentModal(false);
            // Save dismissal to localStorage
            localStorage.setItem(
              "signup-prompt-dismissed-exit-intent",
              Date.now().toString()
            );
          }}
          onSignup={() => {
            setShowExitIntentModal(false);
          }}
        />
      )}

      {/* Engagement Modal */}
      {showEngagementModal && (
        <SmartSignupPrompt
          trigger="engagement"
          onDismiss={() => {
            setShowEngagementModal(false);
          }}
          onSignup={() => {
            setShowEngagementModal(false);
          }}
        />
      )}
    </>
  );
}
