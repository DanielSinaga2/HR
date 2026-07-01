import { Button } from "@/components/ui/button";

export function QuickActionChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} className="rounded-full bg-white">
      {label}
    </Button>
  );
}
