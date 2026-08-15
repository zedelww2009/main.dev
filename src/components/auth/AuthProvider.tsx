"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { FullPageLoader } from "@/components/ui/Spinner";
import { ToastContainer } from "@/components/ui/Toast";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { initialize, initialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initialize();
    return () => unsubscribe();
  }, [initialize]);

  if (!initialized) {
    return <FullPageLoader />;
  }

  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
