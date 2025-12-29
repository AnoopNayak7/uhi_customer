"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/store";
import { SmartSignupPrompt } from "./SmartSignupPrompt";

interface ToolUsagePromptProps {
  toolName: string;
  children: React.ReactNode;
}

/**
 * Wrapper component that shows signup prompt when user uses a tool
 */
export function ToolUsagePrompt({ toolName, children }: ToolUsagePromptProps) {
  const { isAuthenticated } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Track tool usage
    if (!isAuthenticated && !hasShown) {
      // Check if user has used tools before
      const toolUsageCount = parseInt(
        localStorage.getItem("tool-usage-count") || "0"
      );

      // Show prompt after 2 tool uses
      if (toolUsageCount >= 2) {
        const dismissedKey = "signup-prompt-dismissed-tool-usage";
        const dismissedTime = localStorage.getItem(dismissedKey);
        if (dismissedTime) {
          const hoursSinceDismiss =
            (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
          if (hoursSinceDismiss < 24) return; // Don't show if dismissed in last 24 hours
        }
        setShowModal(true);
        setHasShown(true);
      } else {
        // Increment tool usage count
        localStorage.setItem(
          "tool-usage-count",
          (toolUsageCount + 1).toString()
        );
      }
    }
  }, [isAuthenticated, hasShown]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {showModal && (
        <SmartSignupPrompt
          trigger="tool-usage"
          context={{ toolName }}
          onDismiss={() => {
            setShowModal(false);
            localStorage.setItem(
              "signup-prompt-dismissed-tool-usage",
              Date.now().toString()
            );
          }}
          onSignup={() => {
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}
