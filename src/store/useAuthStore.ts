"use client";

import { create } from "zustand";
import type { User } from "firebase/auth";
import type { UserProfile } from "@/types";
import {
  login as firebaseLogin,
  register as firebaseRegister,
  logout as firebaseLogout,
  resetPassword as firebaseResetPassword,
  getUserProfile,
  subscribeToAuth,
  updateUserProfile,
  deleteAccount as firebaseDeleteAccount,
  changePassword as firebaseChangePassword,
} from "@/lib/auth";

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Pick<UserProfile, "displayName" | "photoURL">>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  error: null,

  initialize: () => {
    const unsubscribe = subscribeToAuth(async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        set({ user, profile, initialized: true, loading: false });
      } else {
        set({ user: null, profile: null, initialized: true, loading: false });
      }
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const user = await firebaseLogin(email, password);
      const profile = await getUserProfile(user.uid);
      set({ user, profile, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? mapAuthError(err.message) : "Failed to sign in";
      set({ error: message, loading: false });
      throw err;
    }
  },

  register: async (email, password, displayName) => {
    set({ loading: true, error: null });
    try {
      const user = await firebaseRegister(email, password, displayName);
      const profile = await getUserProfile(user.uid);
      set({ user, profile, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? mapAuthError(err.message) : "Failed to register";
      set({ error: message, loading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseLogout();
      set({ user: null, profile: null, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to sign out";
      set({ error: message, loading: false });
      throw err;
    }
  },

  resetPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      await firebaseResetPassword(email);
      set({ loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? mapAuthError(err.message) : "Failed to send reset email";
      set({ error: message, loading: false });
      throw err;
    }
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) throw new Error("Not authenticated");
    set({ loading: true, error: null });
    try {
      await updateUserProfile(user.uid, data);
      const profile = await getUserProfile(user.uid);
      set({ profile, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      set({ error: message, loading: false });
      throw err;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ loading: true, error: null });
    try {
      await firebaseChangePassword(currentPassword, newPassword);
      set({ loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? mapAuthError(err.message) : "Failed to change password";
      set({ error: message, loading: false });
      throw err;
    }
  },

  deleteAccount: async () => {
    set({ loading: true, error: null });
    try {
      await firebaseDeleteAccount();
      set({ user: null, profile: null, loading: false });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete account";
      set({ error: message, loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

function mapAuthError(message: string): string {
  if (message.includes("auth/email-already-in-use"))
    return "This email is already registered.";
  if (message.includes("auth/invalid-email"))
    return "Please enter a valid email address.";
  if (message.includes("auth/weak-password"))
    return "Password should be at least 6 characters.";
  if (message.includes("auth/user-not-found") || message.includes("auth/wrong-password") || message.includes("auth/invalid-credential"))
    return "Invalid email or password.";
  if (message.includes("auth/requires-recent-login"))
    return "Please sign out and sign in again before changing your password.";
  if (message.includes("auth/too-many-requests"))
    return "Too many attempts. Please try again later.";
  if (message.includes("auth/network-request-failed"))
    return "Network error. Check your connection.";
  return message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, "").trim() || "Something went wrong.";
}
