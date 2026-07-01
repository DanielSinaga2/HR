"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, LogIn, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth-store";

const schema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const quickLogin = useAuthStore((state) => state.quickLogin);
  const [error, setError] = useState("");
  const form = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: "budi@demo.com", password: "password123" },
  });

  function goDashboard() {
    router.replace("/dashboard");
  }

  function onSubmit(values: LoginForm) {
    setError("");
    const success = login(values.email, values.password);
    if (!success) {
      setError("Email atau password tidak cocok dengan akun demo.");
      return;
    }
    goDashboard();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.16),_transparent_36%),linear-gradient(135deg,_#f8fafc,_#eef2ff_45%,_#ecfeff)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-soft">
            <Bot className="h-7 w-7" />
          </div>
          <CardTitle className="text-3xl">HIRA</CardTitle>
          <CardDescription>AI Agent HRIS untuk layanan karyawan otomatis</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Email" {...form.register("email")} />
              {form.formState.errors.email ? <p className="mt-1 text-xs text-rose-600">{form.formState.errors.email.message}</p> : null}
            </div>
            <div>
              <Input type="password" placeholder="Password" {...form.register("password")} />
              {form.formState.errors.password ? <p className="mt-1 text-xs text-rose-600">{form.formState.errors.password.message}</p> : null}
            </div>
            {error ? <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
            <Button className="w-full" size="lg" type="submit">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          </form>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              onClick={() => {
                quickLogin("HRD");
                goDashboard();
              }}
            >
              Login sebagai HRD
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                quickLogin("EMPLOYEE");
                goDashboard();
              }}
            >
              Login sebagai Karyawan
            </Button>
          </div>
          <div className="mt-5 flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
            <Sparkles className="mt-0.5 h-4 w-4 text-indigo-500" />
            <p>HIRA membantu karyawan mengurus cuti, surat, dan layanan HR cukup lewat chat.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
