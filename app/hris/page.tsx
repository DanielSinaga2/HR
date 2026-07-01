"use client";

import { Bell, Bot, CalendarDays, FileText, ShieldCheck, Users } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";

export default function HrisOverviewPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { employees, leaveRequests, letterRequests, notifications } = useHrStore();
  if (!currentUser) return null;

  const isHrd = currentUser.role === "HRD";
  const employeeId = currentUser.employeeId;
  const myLeave = leaveRequests.filter((item) => item.employeeId === employeeId);
  const myLetters = letterRequests.filter((item) => item.employeeId === employeeId);
  const visibleNotifications = notifications.filter((item) =>
    isHrd ? item.roleTarget === "HRD" : item.userId === currentUser.id,
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">HRIS Overview</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-950">
              {isHrd ? "Ringkasan operasional HR" : "Ringkasan layanan karyawan"}
            </h1>
          </div>
          <Button asChild>
            <Link href={isHrd ? "/hris/approvals" : "/agent"}>
              {isHrd ? <ShieldCheck className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              {isHrd ? "Lihat Approval" : "Tanya AI Agent"}
            </Link>
          </Button>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {isHrd ? (
            <>
              <StatCard icon={Users} title="Total Karyawan" value={`${employees.length + 20}`} />
              <StatCard icon={ShieldCheck} title="Pending Approval" value={`${leaveRequests.filter((item) => item.status === "PENDING").length + letterRequests.filter((item) => item.status === "PENDING").length}`} />
              <StatCard icon={CalendarDays} title="Request Cuti" value={`${leaveRequests.length}`} />
              <StatCard icon={FileText} title="Request Surat" value={`${letterRequests.length}`} />
            </>
          ) : (
            <>
              <StatCard icon={CalendarDays} title="Sisa Cuti" value="10 Hari" />
              <StatCard icon={CalendarDays} title="Cuti Terakhir" value={myLeave[0]?.id ?? "-"} description={myLeave[0]?.status ?? "Belum ada"} />
              <StatCard icon={FileText} title="Surat Terakhir" value={myLetters[0]?.id ?? "-"} description={myLetters[0]?.status ?? "Belum ada"} />
              <StatCard icon={Bell} title="Notifikasi Baru" value={`${visibleNotifications.filter((item) => !item.isRead).length}`} />
            </>
          )}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>{isHrd ? "Recent Activity" : "Notifikasi Terbaru"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleNotifications.slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 p-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.message}</p>
                </div>
                <p className="shrink-0 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
