"use client";

import { Bot, Building2, CalendarDays, FileText, MessageSquareText, Send, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChatBubble, type ChatMessage } from "@/components/chat-bubble";
import { Header } from "@/components/header";
import { QuickActionChip } from "@/components/quick-action-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";
import { useHrStore } from "@/stores/hr-store";

const leaveTimeline = [
  "Memahami permintaan pengguna",
  "Mengambil data karyawan",
  "Mengecek knowledge base",
  "Membuat request",
  "Mengirim notifikasi HR",
];

const letterTimeline = [
  "Memahami permintaan pengguna",
  "Mengambil data karyawan",
  "Mengecek knowledge base",
  "Membuat request",
  "Mengirim notifikasi HR",
];

export default function AgentPage() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const { employees, letterRequests, createLeaveRequest, createLetterRequest } = useHrStore();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isResponding, setIsResponding] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeEmployee = useMemo(() => {
    if (!currentUser) return employees[0];
    return employees.find((item) => item.id === currentUser.employeeId) ?? employees[0];
  }, [currentUser, employees]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isResponding]);

  if (!currentUser) return null;

  function buildResponse(text: string) {
    setMessages((items) => [
      ...items,
      { id: `user-${Date.now()}`, sender: "user", content: text },
      {
        id: `ai-typing-${Date.now()}`,
        sender: "ai",
        content: "",
        isTyping: true,
      },
    ]);
    setIsResponding(true);
    const normalized = text.toLowerCase();
    let timeline: string[] | undefined;
    let replyFactory: () => string;

    if (normalized.includes("sisa cuti") || normalized.includes("saldo cuti")) {
      replyFactory = () => "Sisa cuti Anda tahun ini adalah 10 hari dari total 12 hari. Apakah Anda ingin saya bantu buatkan pengajuan cuti sekarang?";
    } else if (normalized.includes("ajukan cuti") || normalized.includes("cuti tanggal") || normalized.includes("izin cuti")) {
      timeline = leaveTimeline;
      replyFactory = () => {
        const request = createLeaveRequest({
          employeeId: activeEmployee.id,
          employeeName: activeEmployee.name,
          reason: "Diajukan melalui percakapan AI Agent",
        });
        return `Siap, saya sudah menjalankan alur pengajuan cuti untuk ${activeEmployee.name}.\n\nPengajuan cuti berhasil dibuat dengan nomor ${request.id} dan menunggu approval HRD.`;
      };
    } else if (normalized.includes("surat")) {
      timeline = letterTimeline;
      replyFactory = () => {
        const request = createLetterRequest({
          employeeId: activeEmployee.id,
          employeeName: activeEmployee.name,
          letterType: "Surat Keterangan Kerja",
          purpose: "Administrasi pribadi",
        });
        return `Baik, saya mengambil data profil Anda dan membuat request Surat Keterangan Kerja ke HRD.\n\nRequest surat berhasil dibuat dengan nomor ${request.id}.`;
      };
    } else if (normalized.includes("aturan cuti") || normalized.includes("policy") || normalized.includes("kebijakan")) {
      replyFactory = () =>
        "Berdasarkan kebijakan perusahaan, cuti tahunan maksimal 12 hari per tahun. Pengajuan cuti disarankan minimal H-3 sebelum tanggal cuti.";
    } else if (normalized.includes("status")) {
      replyFactory = () => {
        const latestLeave = useHrStore.getState().leaveRequests.filter((item) => item.employeeId === activeEmployee.id).slice(0, 3);
        const latestLetters = useHrStore.getState().letterRequests.filter((item) => item.employeeId === activeEmployee.id).slice(0, 3);
        const lines = [
          ...latestLeave.map((item) => `${item.id} - Cuti - ${item.status}`),
          ...latestLetters.map((item) => `${item.id} - ${item.letterType} - ${item.status}`),
        ];
        return lines.length ? `Status pengajuan terbaru:\n${lines.join("\n")}` : "Belum ada pengajuan aktif di akun Anda.";
      };
    } else {
      replyFactory = () =>
        "Saya bisa membantu cek sisa cuti, ajukan cuti, buat surat kerja, atau menjawab aturan HR. Mau saya bantu yang mana?";
    }

    if (timeline) {
      setMessages((items) =>
        items.map((message, index) =>
          index === items.length - 1 && message.sender === "ai"
            ? { ...message, timeline, timelineStatus: "loading" }
            : message,
        ),
      );
    }

    window.setTimeout(
      () => {
        const aiText = replyFactory();
        setMessages((items) =>
          items.map((message, index) =>
            index === items.length - 1 && message.sender === "ai"
              ? {
                  ...message,
                  content: aiText,
                  isTyping: false,
                  timeline,
                  timelineStatus: timeline ? "done" : undefined,
                }
              : message,
          ),
        );
        setIsResponding(false);
      },
      timeline ? 1400 : 800,
    );
  }

  function submitMessage(value = input) {
    const text = value.trim();
    if (!text || isResponding) return;
    setInput("");
    buildResponse(text);
  }

  const quickActions = ["Cek sisa cuti", "Ajukan cuti", "Buat surat kerja", "Tanya aturan cuti", "Cek status pengajuan"];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[1fr_340px] lg:p-8">
        <section className="min-h-[calc(100vh-140px)] rounded-3xl border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-950">HIRA AI Agent</h1>
                  <p className="text-sm text-slate-500">Tinggal chat, urusan HR langsung jalan.</p>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <Building2 className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <QuickActionChip key={action} label={action} onClick={() => submitMessage(action)} />
              ))}
            </div>
          </div>
          <div className="flex h-[58vh] flex-col gap-4 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_rgba(79,70,229,0.10),_transparent_32%),linear-gradient(180deg,_#f8fafc,_#eef2ff)] p-5">
            {messages.length === 0 ? (
              <div className="flex min-h-full items-center justify-center">
                <div className="max-w-xl text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-indigo-600 shadow-soft">
                    <WandSparkles className="h-8 w-8" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-slate-950">Mulai dari satu chat, HIRA yang urus alurnya.</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Coba minta HIRA cek sisa cuti, buat request surat, atau ajukan cuti. Saat demo, timeline agent akan memperlihatkan proses kerja otomatisnya.
                  </p>
                  <div className="mt-5 grid gap-3 text-left sm:grid-cols-3">
                    {[
                      ["Cek cuti", "Saldo, riwayat, dan status."],
                      ["Ajukan request", "Cuti atau surat masuk HRIS."],
                      ["Pantau approval", "Notifikasi ikut dibuat."],
                    ].map(([title, description]) => (
                      <div key={title} className="rounded-2xl border border-white/80 bg-white/80 p-4 shadow-sm">
                        <MessageSquareText className="mb-3 h-5 w-5 text-indigo-500" />
                        <p className="font-semibold text-slate-900">{title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => <ChatBubble key={message.id} message={message} />)
            )}
            <div ref={chatEndRef} />
          </div>
          <form
            className="flex gap-3 border-t border-slate-200 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              submitMessage();
            }}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={isResponding ? "HIRA sedang memproses..." : "Ketik: ajukan cuti tanggal 12 Juli..."}
              disabled={isResponding}
            />
            <Button type="submit" size="icon" aria-label="Kirim pesan" disabled={isResponding}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </section>

        <aside className="space-y-4">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">Demo-ready automation</p>
                  <p className="text-sm text-slate-500">Setiap request dari chat langsung masuk ke HRIS.</p>
                </div>
              </div>
              <div className="grid gap-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Profil aktif</p>
                  <p className="mt-1 font-semibold text-slate-800">{activeEmployee.name}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-700">
                    <CalendarDays className="mb-2 h-5 w-5" />
                    <p className="text-2xl font-bold">10</p>
                    <p className="text-xs font-semibold">Sisa cuti</p>
                  </div>
                  <div className="rounded-2xl bg-cyan-50 p-4 text-cyan-700">
                    <FileText className="mb-2 h-5 w-5" />
                    <p className="text-2xl font-bold">{letterRequests.filter((item) => item.employeeId === activeEmployee.id).length}</p>
                    <p className="text-xs font-semibold">Request surat</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
