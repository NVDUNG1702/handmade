"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserPresence {
  userId: string;
  isOnline: boolean;
  lastSeen?: string;
  updatedAt: string;
}

interface PresenceState {
  // User presence data
  userPresence: Record<string, UserPresence>; // userId -> presence

  // Actions
  setUserOnline: (userId: string, timestamp?: string) => void;
  setUserOffline: (userId: string, lastSeen: string) => void;
  updateUserPresence: (userId: string, isOnline: boolean, lastSeen?: string) => void;
  getUserPresence: (userId: string) => UserPresence | null;
  isUserOnline: (userId: string) => boolean;
  getUserLastSeen: (userId: string) => string | null;
  clearPresence: () => void;
}

export const usePresenceStore = create<PresenceState>()(
  persist(
    (set, get) => ({
      userPresence: {},

      setUserOnline: (userId: string, timestamp?: string) => {
        console.log(`🟢 [PresenceStore] Setting user ${userId} ONLINE`);
        set((state) => ({
          userPresence: {
            ...state.userPresence,
            [userId]: {
              userId,
              isOnline: true,
              lastSeen: undefined,
              updatedAt: timestamp || new Date().toISOString(),
            },
          },
        }));
      },

      setUserOffline: (userId: string, lastSeen: string) => {
        console.log(`🔴 [PresenceStore] Setting user ${userId} OFFLINE (lastSeen: ${lastSeen})`);
        set((state) => ({
          userPresence: {
            ...state.userPresence,
            [userId]: {
              userId,
              isOnline: false,
              lastSeen,
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      updateUserPresence: (userId: string, isOnline: boolean, lastSeen?: string) => {
        set((state) => ({
          userPresence: {
            ...state.userPresence,
            [userId]: {
              userId,
              isOnline,
              lastSeen: isOnline ? undefined : (lastSeen || new Date().toISOString()),
              updatedAt: new Date().toISOString(),
            },
          },
        }));
      },

      getUserPresence: (userId: string) => {
        const { userPresence } = get();
        return userPresence[userId] || null;
      },

      isUserOnline: (userId: string) => {
        const { userPresence } = get();
        return userPresence[userId]?.isOnline || false;
      },

      getUserLastSeen: (userId: string) => {
        const { userPresence } = get();
        return userPresence[userId]?.lastSeen || null;
      },

      clearPresence: () => {
        set({ userPresence: {} });
      },
    }),
    {
      name: "presence-store",
      partialize: (state) => ({
        userPresence: state.userPresence,
      }),
    }
  )
);
