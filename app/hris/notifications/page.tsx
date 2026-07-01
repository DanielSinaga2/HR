"use client";

import { Bell } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";

export default function NotificationsPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const notifications = useHrStore((state) => state.notifications);
  const markAllNotificationsRead = useHrStore((state) => state.markAllNotificationsRead);
  if (!currentUser) return null;

  const visibleNotifications = notifications.filter((item) =>
    currentUser.role === "HRD" ? item.roleTarget === "HRD" : item.userId === currentUser.id,
  );

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">Notifikasi</h1>
            <p className="text-slate-500">Update terbaru dari request dan approval HR.</p>
          </div>
          <Button variant="outline" onClick={() => markAllNotificationsRead(currentUser.id, currentUser.role)}>
            Mark all as read
          </Button>
        </section>
        <div className="space-y-3">
          {visibleNotifications.map((item) => (
            <Card key={item.id} className={item.isRead ? "shadow-none" : ""}>
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-slate-950">{item.title}</p>
                    {!item.isRead ? <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs font-semibold text-cyan-700">Baru</span> : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{item.message}</p>
                </div>
                <p className="shrink-0 text-xs text-slate-400">{formatDate(item.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
