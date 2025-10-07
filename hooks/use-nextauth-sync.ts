"use client";

import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store";
import { useEffect } from "react";

export function useNextAuthSync() {
  const { data: session, status } = useSession();
  const { loginWithGoogle, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (session?.user && session?.accessToken) {
      // User is signed in with NextAuth
      if (!isAuthenticated) {
        // Sync with our auth store
        const user = {
          id: session.user.id || "",
          firstName: session.user.firstName || session.user.name?.split(' ')[0] || "",
          lastName: session.user.lastName || session.user.name?.split(' ').slice(1).join(' ') || "",
          email: session.user.email || "",
          phone: session.user.phone || "",
          role: (session.user.role as 'user' | 'builder' | 'admin') || 'user',
          isVerified: true,
          googleId: session.user.googleId,
          profilePicture: session.user.image || undefined,
          authProvider: 'google' as const,
        };

        loginWithGoogle(user, session.accessToken);
      }
    } else if (status === "unauthenticated" && isAuthenticated) {
      // User signed out from NextAuth, sync logout
      logout();
    }
  }, [session, status, loginWithGoogle, logout, isAuthenticated]);

  return { session, status };
}
