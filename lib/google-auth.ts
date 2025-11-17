import { API_CONSTANTS } from "./api-constants";

export interface GoogleAuthConfig {
  clientId: string;
  scopes: string[];
}

export const GOOGLE_AUTH_CONFIG: GoogleAuthConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
  scopes: (process.env.NEXT_PUBLIC_GOOGLE_SCOPES || "")
    .split(" ")
    .filter(Boolean),
};

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  token?: string; // The actual Google token
}

export interface GoogleAuthResponse {
  user: GoogleUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * Initialize Google OAuth
 */
export function initializeGoogleAuth(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("🔵 [Google Auth] Initializing...");
    
    if (typeof window === "undefined") {
      console.error("❌ [Google Auth] Window is undefined");
      reject(new Error("Google Auth can only be initialized on client side"));
      return;
    }

    if (!GOOGLE_AUTH_CONFIG.clientId) {
      console.error("❌ [Google Auth] Client ID not configured:", GOOGLE_AUTH_CONFIG.clientId);
      console.error("❌ [Google Auth] NEXT_PUBLIC_GOOGLE_CLIENT_ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
      reject(new Error("Google Client ID is not configured"));
      return;
    }
    
    console.log("✅ [Google Auth] Client ID found:", GOOGLE_AUTH_CONFIG.clientId?.substring(0, 20) + "...")

    // Load Google API script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("✅ [Google Auth] Script loaded");
      if (window.google) {
        console.log("✅ [Google Auth] Google API available");
        window.google.accounts.id.initialize({
          client_id: GOOGLE_AUTH_CONFIG.clientId,
          callback: () => {}, // Will be set by individual components
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        console.log("✅ [Google Auth] Initialization complete");
        resolve();
      } else {
        console.error("❌ [Google Auth] Google API not available after script load");
        reject(new Error("Failed to load Google API"));
      }
    };

    script.onerror = (error) => {
      console.error("❌ [Google Auth] Script load error:", error);
      reject(new Error("Failed to load Google API script"));
    };

    document.head.appendChild(script);
  });
}

/**
 * Sign in with Google using OAuth2 flow (access_token)
 * This matches the old project implementation and avoids CORS issues
 */
export function signInWithGoogle(): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("🔵 [Google Auth] Starting OAuth2 sign-in...");
    
    if (typeof window === "undefined" || !window.google) {
      console.error("❌ [Google Auth] Window or Google API not available");
      reject(new Error("Google Auth not initialized"));
      return;
    }

    console.log("🔵 [Google Auth] Initializing OAuth2 token client...");
    
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_AUTH_CONFIG.clientId,
        scope: GOOGLE_AUTH_CONFIG.scopes.join(" ") || "https://www.googleapis.com/auth/userinfo.profile openid email profile",
        callback: (response: any) => {
          console.log("✅ [Google Auth] Received OAuth2 response");
          
          if (response.error) {
            console.error("❌ [Google Auth] OAuth2 error:", response.error);
            reject(new Error(response.error));
            return;
          }

          if (!response.access_token) {
            console.error("❌ [Google Auth] No access token in response");
            reject(new Error("No access token received"));
            return;
          }

          console.log("✅ [Google Auth] Access token received");
          resolve(response.access_token);
        },
      });

      console.log("🔵 [Google Auth] Requesting access token...");
      // Request access token with consent prompt
      client.requestAccessToken({
        prompt: "consent",
      });
    } catch (error) {
      console.error("❌ [Google Auth] Failed to initialize OAuth2 client:", error);
      reject(error);
    }
  });
}

/**
 * Sign out from Google
 */
export function signOutFromGoogle(): void {
  if (typeof window !== "undefined" && window.google) {
    window.google.accounts.id.disableAutoSelect();
  }
}

// Extend Window interface for Google API
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback: (notification: any) => void) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initTokenClient: (config: any) => any;
        };
      };
    };
  }
}
