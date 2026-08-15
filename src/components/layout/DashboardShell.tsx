"use client";

import { type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { BackgroundRenderer } from "@/components/backgrounds/BackgroundRenderer";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}

export function DashboardShell({ children, title, actions }: DashboardShellProps) {
  const { sidebarOpen } = useAppStore();

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundRenderer />
      <div className="relative z-10">
        <Sidebar />
        <div
          className={cn(
            "flex flex-col min-h-screen transition-[margin] duration-300",
            sidebarOpen ? "lg:ml-60" : "lg:ml-[72px]"
          )}
        >
          <TopNav title={title} actions={actions} />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
