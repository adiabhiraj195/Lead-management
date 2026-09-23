import React from "react";
import { Lead } from "@/lib/types";

interface LeadStatsProps {
  leads: Lead[];
  totalCount?: number;
  isLoading?: boolean;
}

export function LeadStats({
  leads,
  totalCount,
  isLoading = false,
}: LeadStatsProps) {
  const total = totalCount ?? leads.length;
  const newCount = leads.filter((l) => l.status === "NEW").length;
  const contactedCount = leads.filter((l) => l.status === "CONTACTED").length;
  const qualifiedCount = leads.filter((l) => l.status === "QUALIFIED").length;
  const convertedCount = leads.filter((l) => l.status === "CONVERTED").length;

  const conversionRate =
    leads.length > 0
      ? Math.round((convertedCount / leads.length) * 100)
      : 0;

  const stats = [
    {
      label: "Total Leads",
      value: total,
      sublabel: "Active in database",
      color: "border-zinc-200 dark:border-zinc-800",
      accent: "text-zinc-900 dark:text-zinc-100",
    },
    {
      label: "New",
      value: newCount,
      sublabel: "Pending outreach",
      color: "border-sky-200 dark:border-sky-900/50",
      accent: "text-sky-600 dark:text-sky-400",
    },
    {
      label: "Contacted",
      value: contactedCount,
      sublabel: "In communication",
      color: "border-amber-200 dark:border-amber-900/50",
      accent: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "Qualified",
      value: qualifiedCount,
      sublabel: "Verified potential",
      color: "border-violet-200 dark:border-violet-900/50",
      accent: "text-violet-600 dark:text-violet-400",
    },
    {
      label: "Converted",
      value: convertedCount,
      sublabel: `${conversionRate}% on page`,
      color: "border-emerald-200 dark:border-emerald-900/50",
      accent: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl border bg-white dark:bg-zinc-900/60 shadow-xs transition-all hover:border-zinc-300 dark:hover:border-zinc-700 ${stat.color}`}
        >
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
            {stat.label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            {isLoading ? (
              <div className="h-7 w-12 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : (
              <span className={`text-2xl font-semibold tracking-tight ${stat.accent}`}>
                {stat.value}
              </span>
            )}
          </div>
          <div className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
            {stat.sublabel}
          </div>
        </div>
      ))}
    </div>
  );
}

