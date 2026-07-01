"use client";

import { UserRound } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";

export default function ProfilePage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const employees = useHrStore((state) => state.employees);
  if (!currentUser) return null;

  const employee = employees.find((item) => item.id === currentUser.employeeId) ?? employees[0];

  return (
    <AppShell>
      <div className="space-y-6">
        <section>
          <h1 className="text-2xl font-bold text-slate-950">Profil</h1>
          <p className="text-slate-500">Data karyawan yang digunakan HIRA untuk layanan otomatis.</p>
        </section>
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-600">
              <UserRound className="h-8 w-8" />
            </div>
            <div>
              <CardTitle>{employee.name}</CardTitle>
              <p className="text-sm text-slate-500">{employee.position}</p>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {[
              ["Nama", employee.name],
              ["Email", employee.email],
              ["NIK", employee.nik],
              ["Jabatan", employee.position],
              ["Divisi", employee.department],
              ["Manager", employee.managerName],
              ["Tanggal Masuk", formatDate(employee.joinDate)],
              ["Status Karyawan", employee.status],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
                <p className="mt-1 font-semibold text-slate-800">{value}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
