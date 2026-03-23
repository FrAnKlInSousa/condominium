"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, logout } from "@/lib/api";

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    try {
      await getMe();
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  async function logoutUser() {
    await logout();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, logoutUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro do AuthProvider");
  }

  return context;
}
