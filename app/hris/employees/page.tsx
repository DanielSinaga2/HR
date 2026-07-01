"use client";

import { Search, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { AccessDenied } from "@/components/access-denied";
import { AppShell } from "@/components/app-shell";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";
import type { Employee } from "@/types/hr";

export default function EmployeesPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const employees = useHrStore((state) => state.employees);
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      employees.filter((employee) =>
        `${employee.name} ${employee.email} ${employee.department} ${employee.position}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [employees, query],
  );

  if (!currentUser) return null;

  return (
    <AppShell>
      {currentUser.role !== "HRD" ? (
        <AccessDenied />
      ) : (
        <div className="space-y-6">
          <section>
            <h1 className="text-2xl font-bold text-slate-950">Data Karyawan</h1>
            <p className="text-slate-500">Cari dan pantau profil ringkas karyawan.</p>
          </section>
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard icon={Users} title="Total Karyawan" value={`${employees.length + 20}`} />
            <StatCard icon={Users} title="Aktif" value={`${employees.filter((item) => item.status === "Aktif").length + 20}`} />
            <StatCard icon={Users} title="Divisi" value="4" />
          </section>
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <Input className="pl-9" placeholder="Cari nama, email, divisi, atau jabatan" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <DataTable<Employee>
            data={filtered}
            columns={[
              { header: "Nama", cell: (item) => item.name },
              { header: "Email", cell: (item) => item.email },
              { header: "Divisi", cell: (item) => item.department },
              { header: "Jabatan", cell: (item) => item.position },
              { header: "Manager", cell: (item) => item.managerName },
              { header: "Sisa Cuti", cell: (item) => `${item.leaveBalance} hari` },
              { header: "Status", cell: (item) => <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">{item.status}</Badge> },
            ]}
          />
        </div>
      )}
    </AppShell>
  );
}
