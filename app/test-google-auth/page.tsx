"use client";

import { AuthTest } from "@/components/auth/auth-test";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { signOut } from "next-auth/react";
import { useAuthStore } from "@/lib/store";

export default function TestGoogleAuthPage() {
  const { logout, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Google Authentication Test Page</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              This page helps you test the Google OAuth integration. Use the
              buttons below to test the authentication flow.
            </p>

            <div className="flex gap-4">
              <GoogleLoginButton
                onSuccess={() => {
                  console.log("Google login successful!");
                }}
                onError={(error) => {
                  console.error("Google login error:", error);
                }}
                className="flex-1"
              />

              {isAuthenticated && (
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex-1"
                >
                  Sign Out
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <AuthTest />
      </div>
    </div>
  );
}
