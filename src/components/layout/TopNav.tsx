"use client";

import Link from "next/link";
import { HiOutlineMenuAlt2, HiOutlineBell } from "react-icons/hi";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";

interface TopNavProps {
  title?: string;
  actions?: React.ReactNode;
}

export function TopNav({ title, actions }: TopNavProps) {
  const { setSidebarOpen, settings } = useAppStore();
  const { profile } = useAuthStore();

  const initial = profile?.displayName?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted hover:text-foreground hover:bg-surface-3 transition-colors"
          aria-label="Open menu"
        >
          <HiOutlineMenuAlt2 className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-2">
        {actions}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          className="relative"
        >
          <HiOutlineBell className="h-5 w-5" />
          {settings.notificationsEnabled && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-foreground" />
          )}
        </Button>
        <Link href="/profile">
          <div className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-surface-3 border border-border text-xs font-medium hover:bg-surface-4 transition-colors cursor-pointer">
            {initial}
          </div>
        </Link>
      </div>
    </header>
  );
}
