"use client";

import { Bell, CalendarDays, FileText, Home, ShieldCheck, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const employeeMenu = [
  { href: "/hris", label: "Overview", icon: Home },
  { href: "/hris/leave", label: "Cuti", icon: CalendarDays },
  { href: "/hris/letters", label: "Surat", icon: FileText },
  { href: "/hris/notifications", label: "Notifikasi", icon: Bell },
  { href: "/hris/profile", label: "Profil", icon: UserRound },
];

const hrdMenu = [
  { href: "/hris", label: "Overview", icon: Home },
  { href: "/hris/employees", label: "Data Karyawan", icon: Users },
  { href: "/hris/approvals", label: "Approval", icon: ShieldCheck },
  { href: "/hris/leave", label: "Cuti", icon: CalendarDays },
  { href: "/hris/letters", label: "Surat", icon: FileText },
  { href: "/hris/notifications", label: "Notifikasi", icon: Bell },
];

export function Sidebar() {
  const pathname = usePathname();
  const currentUser = useAuthStore((state) => state.currentUser);
  const menu = currentUser?.role === "HRD" ? hrdMenu : employeeMenu;

  return (
    <aside className="border-b border-slate-200 bg-white p-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white">H</div>
        <div>
          <p className="font-bold text-slate-950">HIRA</p>
          <p className="text-xs text-slate-500">AI Agent </p>
        </div>
      </Link>
      <nav className="grid gap-2 md:grid-cols-3 lg:grid-cols-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100",
                active && "bg-indigo-50 text-indigo-700",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
