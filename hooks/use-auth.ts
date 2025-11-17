"use client";

import { useState, useEffect } from "react";
import { isAuthenticated } from "@/lib/auth";

export function useAuth() {
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setMounted(true);
    setAuthed(isAuthenticated());
  }, []);

  return {
    mounted,
    authed,
    isAuthenticated: mounted && authed,
  };
}

