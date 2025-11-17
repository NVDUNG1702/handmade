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
    if (typeof window === "undefined") {
      reject(new Error("Google Auth can only be initialized on client side"));
      return;
    }

    if (!GOOGLE_AUTH_CONFIG.clientId) {
      reject(new Error("Google Client ID is not configured"));
      return;
    }

    // Load Google API script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_AUTH_CONFIG.clientId,
          callback: () => {}, // Will be set by individual components
          auto_select: false,
          cancel_on_tap_outside: true,
        });
        resolve();
      } else {
        reject(new Error("Failed to load Google API"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Google API script"));
    };

    document.head.appendChild(script);
  });
}

/**
 * Sign in with Google
 */
export function signInWithGoogle(): Promise<GoogleUser> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.google) {
      reject(new Error("Google Auth not initialized"));
      return;
    }

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        reject(new Error("Google sign-in was cancelled or skipped"));
        return;
      }
    });

    // Set up callback
    window.google.accounts.id.initialize({
      client_id: GOOGLE_AUTH_CONFIG.clientId,
      callback: (response: any) => {
        try {
          // Decode JWT token to get user info
          const payload = JSON.parse(atob(response.credential.split(".")[1]));
          const user: GoogleUser = {
            id: payload.sub,
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            given_name: payload.given_name,
            family_name: payload.family_name,
            token: response.credential, // Store the actual JWT token
          };
          resolve(user);
        } catch (error) {
          reject(new Error("Failed to decode Google response"));
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });
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
      };
    };
  }
}
