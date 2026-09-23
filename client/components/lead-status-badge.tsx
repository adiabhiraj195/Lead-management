import React from "react";
import { LeadStatus } from "@/lib/types";

interface LeadStatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md";
  showDot?: boolean;
}

const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  NEW: {
    label: "New",
    badgeClass:
      "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
    dotClass: "bg-sky-500 dark:bg-sky-400",
  },
  CONTACTED: {
    label: "Contacted",
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    dotClass: "bg-amber-500 dark:bg-amber-400",
  },
  QUALIFIED: {
    label: "Qualified",
    badgeClass:
      "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60",
    dotClass: "bg-violet-500 dark:bg-violet-400",
  },
  CONVERTED: {
    label: "Converted",
    badgeClass:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    dotClass: "bg-emerald-500 dark:bg-emerald-400",
  },
};

export function LeadStatusBadge({
  status,
  size = "md",
  showDot = true,
}: LeadStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

  const sizeClass =
    size === "sm"
      ? "text-xs px-2 py-0.5 gap-1.5"
      : "text-xs font-medium px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full border transition-colors select-none ${sizeClass} ${config.badgeClass}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${config.dotClass}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
}

