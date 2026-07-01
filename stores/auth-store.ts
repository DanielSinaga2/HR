"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { demoUsers } from "@/lib/mock-data";
import type { User, UserRole } from "@/types/hr";

type AuthState = {
  currentUser: User | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (email: string, password: string) => boolean;
  quickLogin: (role: UserRole) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      login: (email, password) => {
        if (password !== "password123") return false;
        const user = demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase());
        if (!user) return false;
        set({ currentUser: user });
        return true;
      },
      quickLogin: (role) => {
        const user = role === "HRD" ? demoUsers[0] : demoUsers[1];
        set({ currentUser: user });
      },
      logout: () => set({ currentUser: null }),
    }),
    {
      name: "hira-auth",
      partialize: (state) => ({ currentUser: state.currentUser }),
      skipHydration: true,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
