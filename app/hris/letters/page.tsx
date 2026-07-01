"use client";

import { Download, FileText } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";
import type { LetterRequest } from "@/types/hr";

export default function LettersPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { letterRequests, approveRequest, rejectRequest } = useHrStore();
  if (!currentUser) return null;

  const isHrd = currentUser.role === "HRD";
  const data = isHrd ? letterRequests : letterRequests.filter((item) => item.employeeId === currentUser.employeeId);

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Surat</h1>
            <p className="text-slate-500">{isHrd ? "Proses request surat karyawan." : "Ajukan dan pantau dokumen HR Anda."}</p>
          </div>
          {!isHrd ? (
            <Button asChild>
              <Link href="/agent">Buat surat lewat AI Agent</Link>
            </Button>
          ) : null}
        </section>

        {!isHrd ? (
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-slate-950">Pengajuan surat cepat</p>
                <p className="text-sm text-slate-500">Surat kerja, penghasilan, dan magang bisa dimulai dari chat.</p>
              </div>
            </CardContent>
          </Card>
        ) : null}

        <DataTable<LetterRequest>
          data={data}
          columns={[
            { header: "ID", cell: (item) => item.id },
            { header: "Jenis Surat", cell: (item) => item.letterType },
            { header: "Keperluan", cell: (item) => item.purpose },
            { header: "Status", cell: (item) => <RequestStatusBadge status={item.status} /> },
            {
              header: "Aksi",
              cell: (item) =>
                isHrd ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" disabled={item.status !== "PENDING"} onClick={() => rejectRequest(item.id, "letter")}>
                      Reject
                    </Button>
                    <Button size="sm" disabled={item.status !== "PENDING"} onClick={() => approveRequest(item.id, "letter")}>
                      Approve
                    </Button>
                  </div>
                ) : item.status === "APPROVED" ? (
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                ) : (
                  <span className="text-slate-400">Menunggu proses</span>
                ),
            },
          ]}
        />
      </div>
    </AppShell>
  );
}
