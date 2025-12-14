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

/**
 * Hook to get user by slug
 */
export function useUserBySlug(slug: string) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        // Use axiosInstance to hit backend directly
        // Backend endpoint: /users/slug/:slug (relative to BASE_URL)
        const response = await import("@/lib/axios-instance").then(mod => mod.default.get(`/users/slug/${slug}`));
        const data = response.data;
        
        if (!cancelled) {
          // data.data is the user object from backend standard response { code, message, data }
          setUser(data.data);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error fetching user by slug:", err);
          setError(err as Error);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUser();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { data: user, isLoading: loading, error };
}
