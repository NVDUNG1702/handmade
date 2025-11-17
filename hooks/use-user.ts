"use client";

import { useEffect, useState } from "react";
import { getMeExecute } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

export interface CurrentUser {
  id: string;
  username?: string;
  full_name?: string;
  email?: string;
  avatar?: string;
  roles?: string[];
}

export function useUser() {
  const { mounted, authed } = useAuth();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!mounted || !authed) {
      setUser(null);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const profile: any = await getMeExecute();
        if (!cancelled) {
          // BE returns { user, userSkills, unreadNotificationCount, ... }
          const u = profile?.user || profile;
          const mapped: CurrentUser = {
            id: u?.id,
            username: u?.username,
            full_name: u?.full_name,
            email: u?.email,
            avatar: u?.avatar,
            roles: u?.roles,
          };
          setUser(mapped);
        }
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [mounted, authed]);

  return { user, loading, mounted, authed };
}
