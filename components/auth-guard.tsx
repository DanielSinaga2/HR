"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useAuthStore((state) => state.currentUser);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    void Promise.all([useAuthStore.persist.rehydrate(), useHrStore.persist.rehydrate()]).finally(() => {
      useAuthStore.getState().setHasHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!currentUser && pathname !== "/login") {
      router.replace("/login");
    }
    if (currentUser && pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [currentUser, hasHydrated, pathname, router]);

  if (!hasHydrated || (!currentUser && pathname !== "/login")) {
    return null;
  }

  return <>{children}</>;
}
