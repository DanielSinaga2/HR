"use client";

import { cn } from "@/lib/utils";

type TabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  items: { value: string; label: string }[];
};

export function Tabs({ value, onValueChange, items }: TabsProps) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
      {items.map((item) => (
        <button
          key={item.value}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 transition",
            value === item.value && "bg-slate-950 text-white shadow-sm",
          )}
          onClick={() => onValueChange(item.value)}
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
