import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AccessDenied() {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
        <div className="rounded-2xl bg-rose-50 p-4 text-rose-600">
          <Lock className="h-8 w-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Access Denied</h2>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Halaman ini hanya tersedia untuk HRD. Gunakan menu yang sesuai dengan role Anda.
          </p>
        </div>
        <Button asChild>
          <Link href="/hris">Kembali ke Overview</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
