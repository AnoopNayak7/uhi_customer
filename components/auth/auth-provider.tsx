"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";
import { useAuthStore } from "@/lib/store";
import { useNextAuthSync } from "@/hooks/use-nextauth-sync";

interface AuthContextType {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  useNextAuthSync();
  return <>{children}</>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isInitialized, initialize } = useAuthStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    initialize();
  }, [initialize]);

  if (!isClient) {
    return null;
  }

  return (
    <SessionProvider>
      <AuthSyncProvider>
        <AuthContext.Provider value={{ isInitialized }}>
          {children}
        </AuthContext.Provider>
      </AuthSyncProvider>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
