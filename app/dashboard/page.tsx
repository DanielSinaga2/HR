"use client";

import { Bell, Bot, Building2, CalendarDays, FileText, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";

export default function DashboardPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const leaveRequests = useHrStore((state) => state.leaveRequests);
  const letterRequests = useHrStore((state) => state.letterRequests);
  const employees = useHrStore((state) => state.employees);
  const notifications = useHrStore((state) => state.notifications);

  if (!currentUser) return null;

  const isHrd = currentUser.role === "HRD";
  const userNotifications = notifications.filter((item) =>
    isHrd ? item.roleTarget === "HRD" : item.userId === currentUser.id,
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl p-4 lg:p-8">
        <section className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">Selamat datang di HIRA</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Halo, {isHrd ? "HRD" : "Budi"}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            Pilih HRIS untuk data formal atau AI Agent untuk mengurus layanan HR lewat chat.
          </p>
        </section>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {isHrd ? (
            <>
              <StatCard icon={Users} title="Total Karyawan" value={`${employees.length + 20}`} description="Aktif di sistem" />
              <StatCard icon={ShieldCheck} title="Pending Approval" value="7" description="Cuti dan surat" />
              <StatCard icon={FileText} title="Surat Menunggu" value={`${letterRequests.filter((item) => item.status === "PENDING").length}`} />
            </>
          ) : (
            <>
              <StatCard icon={CalendarDays} title="Sisa Cuti" value="10 Hari" description="Dari total 12 hari" />
              <StatCard icon={ShieldCheck} title="Pengajuan Aktif" value={`${leaveRequests.filter((item) => item.employeeId === currentUser.employeeId && item.status === "PENDING").length + 1}`} />
              <StatCard icon={Bell} title="Notifikasi Baru" value={`${userNotifications.filter((item) => !item.isRead).length}`} />
            </>
          )}
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Link href="/hris">
            <Card className="h-full transition hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="flex h-full flex-col justify-between gap-8 p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                  <Building2 className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">HRIS</h2>
                  <p className="mt-2 text-slate-500">Kelola cuti, surat, profil, notifikasi, approval, dan data karyawan.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/agent">
            <Card className="h-full transition hover:-translate-y-1 hover:shadow-xl">
              <CardContent className="flex h-full flex-col justify-between gap-8 p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Bot className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">AI Agent</h2>
                  <p className="mt-2 text-slate-500">Tinggal chat untuk cek cuti, membuat surat, dan bertanya aturan HR.</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>
      </main>
    </div>
  );
}
