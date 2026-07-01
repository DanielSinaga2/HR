"use client";

import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useAuthStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const breadcrumb = pathname.split("/").filter(Boolean).join(" / ") || "dashboard";

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-4 py-3 backdrop-blur lg:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{breadcrumb}</p>
          <h1 className="text-lg font-bold text-slate-950">{currentUser.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="border-indigo-200 bg-indigo-50 text-indigo-700">
            {currentUser.role === "HRD" ? "HRD" : "Karyawan"}
          </Badge>
          <Button
            variant="outline"
            onClick={() => {
              logout();
              router.replace("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
