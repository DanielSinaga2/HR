import { CalendarDays, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/request-status-badge";
import { formatDate } from "@/lib/utils";
import type { ApprovalType, RequestStatus } from "@/types/hr";

type ApprovalCardProps = {
  id: string;
  employeeName: string;
  type: ApprovalType;
  detail: string;
  createdAt: string;
  status: RequestStatus;
  onApprove: () => void;
  onReject: () => void;
};

export function ApprovalCard({ id, employeeName, type, detail, createdAt, status, onApprove, onReject }: ApprovalCardProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{employeeName}</p>
            <RequestStatusBadge status={status} />
          </div>
          <p className="text-sm text-slate-600">
            {type === "leave" ? "Cuti" : "Surat"} - {id}
          </p>
          <p className="text-sm text-slate-500">{detail}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CalendarDays className="h-4 w-4" />
            {formatDate(createdAt)}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onReject} disabled={status !== "PENDING"}>
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
          <Button onClick={onApprove} disabled={status !== "PENDING"}>
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
