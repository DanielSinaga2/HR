"use client";

import { useMemo, useState } from "react";
import { AccessDenied } from "@/components/access-denied";
import { AppShell } from "@/components/app-shell";
import { ApprovalCard } from "@/components/approval-card";
import { Tabs } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";
import type { ApprovalType, RequestStatus } from "@/types/hr";

type ApprovalItem = {
  id: string;
  employeeName: string;
  type: ApprovalType | "overtime";
  detail: string;
  createdAt: string;
  status: RequestStatus;
};

export default function ApprovalsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { leaveRequests, letterRequests, approveRequest, rejectRequest } = useHrStore();
  const [tab, setTab] = useState("all");
  const [toast, setToast] = useState("");
  const [overtimeStatus, setOvertimeStatus] = useState<RequestStatus>("PENDING");

  const items = useMemo<ApprovalItem[]>(() => {
    const leaveItems = leaveRequests.map((item) => ({
      id: item.id,
      employeeName: item.employeeName,
      type: "leave" as const,
      detail: `${item.duration} hari, ${item.reason}`,
      createdAt: item.createdAt,
      status: item.status,
    }));
    const letterItems = letterRequests.map((item) => ({
      id: item.id,
      employeeName: item.employeeName,
      type: "letter" as const,
      detail: `${item.letterType} untuk ${item.purpose}`,
      createdAt: item.createdAt,
      status: item.status,
    }));
    const overtimeItems: ApprovalItem[] = [
      {
        id: "OT-2026-0001",
        employeeName: "Lina Kartika",
        type: "overtime",
        detail: "Lembur closing bulanan 3 jam",
        createdAt: "2026-07-01",
        status: overtimeStatus,
      },
    ];
    return [...leaveItems, ...letterItems, ...overtimeItems];
  }, [leaveRequests, letterRequests, overtimeStatus]);

  if (!currentUser) return null;

  const filteredItems = items.filter((item) => tab === "all" || item.type === tab);

  return (
    <AppShell>
      {currentUser.role !== "HRD" ? (
        <AccessDenied />
      ) : (
        <div className="space-y-6">
          <section className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-950">Approval</h1>
              <p className="text-slate-500">Review request cuti, surat, dan lembur dari satu tempat.</p>
            </div>
            <Tabs
              value={tab}
              onValueChange={setTab}
              items={[
                { value: "all", label: "Semua" },
                { value: "leave", label: "Cuti" },
                { value: "letter", label: "Surat" },
                { value: "overtime", label: "Lembur" },
              ]}
            />
          </section>
          {toast ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{toast}</div> : null}
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <ApprovalCard
                key={item.id}
                id={item.id}
                employeeName={item.employeeName}
                type={item.type === "overtime" ? "leave" : item.type}
                detail={item.detail}
                createdAt={item.createdAt}
                status={item.status}
                onApprove={() => {
                  if (item.type !== "overtime") approveRequest(item.id, item.type);
                  if (item.type === "overtime") setOvertimeStatus("APPROVED");
                  setToast(`${item.id} berhasil disetujui.`);
                }}
                onReject={() => {
                  if (item.type !== "overtime") rejectRequest(item.id, item.type);
                  if (item.type === "overtime") setOvertimeStatus("REJECTED");
                  setToast(`${item.id} berhasil ditolak.`);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
