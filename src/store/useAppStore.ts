"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppSettings,
  BackgroundType,
  AccentColor,
  AnimationIntensity,
} from "@/types";

interface AppState {
  settings: AppSettings;
  sidebarOpen: boolean;
  setBackground: (bg: BackgroundType) => void;
  setAccentColor: (color: AccentColor) => void;
  setAnimationIntensity: (intensity: AnimationIntensity) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setReducedMotion: (reduced: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const defaultSettings: AppSettings = {
  background: "none",
  accentColor: "white",
  animationIntensity: "medium",
  notificationsEnabled: true,
  reducedMotion: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      sidebarOpen: true,
      setBackground: (background) =>
        set((state) => ({
          settings: { ...state.settings, background },
        })),
      setAccentColor: (accentColor) =>
        set((state) => ({
          settings: { ...state.settings, accentColor },
        })),
      setAnimationIntensity: (animationIntensity) =>
        set((state) => ({
          settings: { ...state.settings, animationIntensity },
        })),
      setNotificationsEnabled: (notificationsEnabled) =>
        set((state) => ({
          settings: { ...state.settings, notificationsEnabled },
        })),
      setReducedMotion: (reducedMotion) =>
        set((state) => ({
          settings: { ...state.settings, reducedMotion },
        })),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
    }),
    {
      name: "portfolio-dashboard-settings",
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);
