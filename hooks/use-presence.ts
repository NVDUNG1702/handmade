"use client";

import { usePresenceStore } from "@/lib/presence-store";

export const useUserPresence = (userId: string | undefined) => {
  // Subscribe directly to the store state, not the getter functions
  const userPresence = usePresenceStore((state) => state.userPresence);
  
  if (!userId) {
    return {
      presence: null,
      isOnline: false,
      lastSeen: null,
    };
  }

  const presence = userPresence[userId] || null;
  const isOnline = presence?.isOnline || false;
  const lastSeen = presence?.lastSeen || null;

  return {
    presence,
    isOnline,
    lastSeen,
  };
};

export const useMultiplePresence = (userIds: string[]) => {
  const userPresence = usePresenceStore((state) => state.userPresence);

  const presences = userIds.reduce((acc, userId) => {
    acc[userId] = userPresence[userId] || null;
    return acc;
  }, {} as Record<string, any>);

  return presences;
};
