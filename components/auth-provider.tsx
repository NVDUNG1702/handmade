"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuthStore } from "@/lib/auth-store";
import type { AuthUser } from "@/lib/types";
import { GlobalLoading } from "@/components/ui/global-loading";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    full_name: string;
    phone: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    isAuthenticated,
    loading,
    initialized,
    login,
    register,
    loginWithGoogle,
    loginWithToken,
    logout,
    updateUser,
  } = useAuthStore();

  // Initialize auth on mount
  useEffect(() => {
    if (!initialized) {
      loginWithToken();
    }
  }, [initialized, loginWithToken]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    initialized,
    login,
    register,
    loginWithGoogle,
    logout,
    updateUser,
  };

  // Show global loading only when not initialized (first time)
  // Don't show loading on subsequent auth checks to prevent flash
  const showGlobalLoading = !initialized;

  return (
    <AuthContext.Provider value={contextValue}>
      {showGlobalLoading && (
        <GlobalLoading message="Đang kiểm tra đăng nhập..." />
      )}
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

// Hook để check auth status với loading state
export function useAuthStatus() {
  const { isAuthenticated, loading, initialized } = useAuth();

  return {
    isAuthenticated,
    loading,
    initialized,
    isReady: initialized && !loading,
  };
}
