"use client";

import { create } from "zustand";
import { generateId } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

/** Convenience helpers */
export const toast = {
  success: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: "success", title, description }),
  error: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: "error", title, description }),
  info: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: "info", title, description }),
  warning: (title: string, description?: string) =>
    useToastStore.getState().addToast({ type: "warning", title, description }),
};
