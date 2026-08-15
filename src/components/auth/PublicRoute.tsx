"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { FullPageLoader } from "@/components/ui/Spinner";

export function PublicRoute({ children }: { children: ReactNode }) {
  const { user, initialized } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (initialized && user) {
      router.replace("/dashboard");
    }
  }, [user, initialized, router]);

  if (!initialized) {
    return <FullPageLoader />;
  }

  if (user) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}
