import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/types/hr";

const statusMap: Record<RequestStatus, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "border-amber-200 bg-amber-50 text-amber-700" },
  APPROVED: { label: "Approved", className: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  REJECTED: { label: "Rejected", className: "border-rose-200 bg-rose-50 text-rose-700" },
};

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const item = statusMap[status];
  return <Badge className={item.className}>{item.label}</Badge>;
}
