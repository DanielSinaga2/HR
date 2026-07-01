"use client";

import { CalendarDays } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";
import type { LeaveRequest } from "@/types/hr";

export default function LeavePage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { leaveRequests, approveRequest, rejectRequest } = useHrStore();
  if (!currentUser) return null;

  const isHrd = currentUser.role === "HRD";
  const data = isHrd ? leaveRequests : leaveRequests.filter((item) => item.employeeId === currentUser.employeeId);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Cuti</h1>
            <p className="text-slate-500">{isHrd ? "Pantau dan proses semua pengajuan cuti." : "Lihat saldo dan riwayat pengajuan cuti Anda."}</p>
          </div>
          {!isHrd ? (
            <Button asChild>
              <Link href="/agent">Ajukan lewat AI Agent</Link>
            </Button>
          ) : null}
        </section>

        {!isHrd ? (
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard icon={CalendarDays} title="Total Cuti" value="12" />
            <StatCard icon={CalendarDays} title="Terpakai" value="2" />
            <StatCard icon={CalendarDays} title="Sisa" value="10" />
          </section>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Filter Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-sm text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1">Semua</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Pending</span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Approved</span>
              <span className="rounded-full bg-rose-50 px-3 py-1 text-rose-700">Rejected</span>
            </CardContent>
          </Card>
        )}

        <DataTable<LeaveRequest>
          data={data}
          columns={[
            { header: "ID", cell: (item) => item.id },
            { header: "Tanggal", cell: (item) => `${formatDate(item.startDate)} - ${formatDate(item.endDate)}` },
            { header: "Durasi", cell: (item) => `${item.duration} hari` },
            { header: "Alasan", cell: (item) => item.reason },
            { header: "Status", cell: (item) => <RequestStatusBadge status={item.status} /> },
            ...(isHrd
              ? [
                  {
                    header: "Aksi",
                    cell: (item: LeaveRequest) => (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" disabled={item.status !== "PENDING"} onClick={() => rejectRequest(item.id, "leave")}>
                          Reject
                        </Button>
                        <Button size="sm" disabled={item.status !== "PENDING"} onClick={() => approveRequest(item.id, "leave")}>
                          Approve
                        </Button>
                      </div>
                    ),
                  },
                ]
              : []),
          ]}
        />
      </div>
    </AppShell>
  );
}
