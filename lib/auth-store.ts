"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "@/lib/auth";
import type { AuthUser, AuthResponse, MeResponse } from "@/lib/types";

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  token: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    username: string;
    password: string;
    full_name: string;
    phone: string;
  }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithToken: () => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setToken: (token: string) => void;
  setInitialized: (initialized: boolean) => void;
  setUser: (user: AuthUser) => void;
  updateUser: (userData: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      initialized: false,
      token: null,

      setLoading: (loading: boolean) => set({ loading }),
      setToken: (token: string) => set({ token }),
      setInitialized: (initialized: boolean) => set({ initialized }),
      setUser: (user: AuthUser) => set({ user }),
      
      updateUser: (userData: Partial<AuthUser>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
          
          // Update localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }
        }
      },

      register: async (data: {
        email: string;
        username: string;
        password: string;
        full_name: string;
        phone: string;
      }) => {
        set({ loading: true });
        try {
          const response = await authApi.registerExecute(data);
          
          // Save tokens
          authApi.saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          // Update state
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            loading: false,
            initialized: true,
          });

          // Save user to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(response.user));
          }
        } catch (error: any) {
          set({ loading: false });
          throw error?.response?.data || error;
        }
      },

      login: async (email: string, password: string) => {
        set({ loading: true });
        try {
          const response = await authApi.loginExecute({ email, password });
          
          // Save tokens
          authApi.saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          // Update state
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            loading: false,
            initialized: true,
          });

          // Save user to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(response.user));
          }
        } catch (error: any) {
          set({ loading: false });
          throw error?.response?.data || error;
        }
      },

      loginWithGoogle: async () => {
        set({ loading: true });
        try {
          const response = await authApi.loginWithGoogle();
          
          // Save tokens
          authApi.saveTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });

          // Update state
          set({
            user: response.user,
            token: response.accessToken,
            isAuthenticated: true,
            loading: false,
            initialized: true,
          });

          // Save user to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(response.user));
          }
        } catch (error: any) {
          set({ loading: false });
          throw error?.response?.data || error;
        }
      },

      loginWithToken: async () => {
        set({ loading: true });

        try {
          // Check token in localStorage
          const token = typeof window !== "undefined" 
            ? localStorage.getItem("access_token") 
            : null;

          if (!token) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
              initialized: true,
            });
            return;
          }

          // Validate token and get user info
          const response = await authApi.getMeExecute();
          
          set({
            user: response.user,
            token,
            isAuthenticated: true,
            loading: false,
            initialized: true,
          });

          // Save user to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(response.user));
          }
        } catch (error: any) {
          // Token invalid, clear everything
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            initialized: true,
          });

          authApi.clearTokens();
          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
          }

          console.log("Auto login failed:", error?.message || "Token invalid");
        }
      },

      logout: async () => {
        set({ loading: true });

        try {
          // Clear tokens and state
          authApi.clearTokens();
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            initialized: true,
          });

          if (typeof window !== "undefined") {
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.log("Logout error:", error);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        initialized: state.initialized,
      }),
      storage: {
        getItem: (name: string) => {
          if (typeof window !== "undefined") {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          }
          return null;
        },
        setItem: (name: string, value: any) => {
          if (typeof window !== "undefined") {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name: string) => {
          if (typeof window !== "undefined") {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);
