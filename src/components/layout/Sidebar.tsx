"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineHome,
  HiOutlineFolder,
  HiOutlineArchive,
  HiOutlineCog,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineMenuAlt2,
  HiOutlineX,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "@/store/useToastStore";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: HiOutlineHome },
  { href: "/projects", label: "Projects", icon: HiOutlineFolder },
  { href: "/archive", label: "Archive", icon: HiOutlineArchive },
  { href: "/settings", label: "Settings", icon: HiOutlineCog },
  { href: "/profile", label: "Profile", icon: HiOutlineUser },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useAppStore();
  const { logout, profile } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.info("Signed out");
      router.replace("/login");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: sidebarOpen ? 240 : 72,
          x: 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col",
          "bg-surface-1 border-r border-border",
          "lg:translate-x-0",
          !sidebarOpen && "max-lg:-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-foreground text-background font-bold text-sm">
                  PD
                </div>
                <span className="font-semibold tracking-tight text-sm">
                  Portfolio
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-foreground text-background font-bold text-sm mx-auto"
              >
                PD
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted hover:text-foreground hover:bg-surface-3 transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <HiOutlineMenuAlt2 className="h-5 w-5" />
          </button>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden h-8 w-8 flex items-center justify-center rounded-[var(--radius-sm)] text-muted hover:text-foreground"
            aria-label="Close sidebar"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-surface-3 text-foreground"
                      : "text-muted hover:text-foreground hover:bg-surface-2"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  <AnimatePresence>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="truncate overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && sidebarOpen && (
                    <motion.div
                      layoutId="active-indicator"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Sign out */}
        <div className="border-t border-border p-3 space-y-1">
          {sidebarOpen && profile && (
            <div className="px-3 py-2 mb-1">
              <p className="text-sm font-medium truncate">{profile.displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{profile.email}</p>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className={cn(
              "group flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium",
              "text-muted hover:text-destructive hover:bg-destructive/10 transition-colors"
            )}
          >
            <HiOutlineLogout className="h-5 w-5 shrink-0" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  Sign out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
