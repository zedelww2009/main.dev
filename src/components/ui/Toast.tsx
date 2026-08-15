"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineInformationCircle,
  HiOutlineExclamation,
  HiOutlineX,
} from "react-icons/hi";
import { useToastStore, type ToastType } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

const icons: Record<ToastType, React.ReactNode> = {
  success: <HiOutlineCheckCircle className="h-5 w-5 text-success" />,
  error: <HiOutlineXCircle className="h-5 w-5 text-destructive" />,
  info: <HiOutlineInformationCircle className="h-5 w-5 text-muted" />,
  warning: <HiOutlineExclamation className="h-5 w-5 text-warning" />,
};

const borderColors: Record<ToastType, string> = {
  success: "border-success/30",
  error: "border-destructive/30",
  info: "border-border",
  warning: "border-warning/30",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-[var(--radius-md)] border bg-surface-2 p-4 shadow-lg",
              borderColors[t.type]
            )}
          >
            <span className="shrink-0 mt-0.5">{icons[t.type]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <HiOutlineX className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
