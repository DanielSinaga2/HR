import { CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AgentTimeline({ steps, status = "done" }: { steps: string[]; status?: "loading" | "done" }) {
  return (
    <div className="mt-3 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Agent Activity</p>
        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-indigo-600">
          {status === "loading" ? "Processing" : "Done"}
        </span>
      </div>
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-2 text-sm text-slate-700">
            {status === "loading" && index === steps.length - 1 ? (
              <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            ) : (
              <CheckCircle className={cn("h-4 w-4", status === "loading" ? "text-indigo-400" : "text-emerald-500")} />
            )}
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
