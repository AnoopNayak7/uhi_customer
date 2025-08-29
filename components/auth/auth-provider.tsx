"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store";

interface AuthContextType {
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    <AuthContext.Provider value={{ isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}