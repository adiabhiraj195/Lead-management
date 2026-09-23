"use client";

import React from "react";
import { Lead } from "@/lib/types";
import { LeadStatusBadge } from "./lead-status-badge";
import {
  MailIcon,
  PhoneIcon,
  EditIcon,
  CalendarIcon,
  UsersIcon,
  PlusIcon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "./icons";

interface LeadTableProps {
  leads: Lead[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  onRetry: () => void;
  onSelectLeadForStatus: (lead: Lead) => void;
  onCreateLead: () => void;
  searchActive?: boolean;
}

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  } catch {
    return isoString;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LeadTable({
  leads,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  onSelectLeadForStatus,
  onCreateLead,
  searchActive = false,
}: LeadTableProps) {
  // 1. Error State
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center">
        <div className="p-3 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mb-3">
          <AlertCircleIcon className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Failed to load leads
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
          {errorMessage || "Unable to reach the server. Please verify your connection."}
        </p>
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-xs transition-colors"
        >
          <RefreshCwIcon className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // 2. Loading Skeleton State
  if (isLoading && leads.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/40 text-xs font-medium text-zinc-400">
          <div className="col-span-4">Lead</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Created</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="p-4 md:px-6 md:py-4 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center animate-pulse"
            >
              <div className="md:col-span-4 flex items-center gap-3 w-full">
                <div className="w-9 h-9 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                </div>
              </div>
              <div className="md:col-span-3 space-y-1.5 w-full">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
              </div>
              <div className="md:col-span-2">
                <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
              </div>
              <div className="md:col-span-2">
                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
              </div>
              <div className="md:col-span-1 md:text-right">
                <div className="h-7 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-md md:ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Empty State
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-center shadow-xs">
        <div className="p-3.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
          <UsersIcon className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {searchActive ? "No matching leads found" : "No leads in pipeline yet"}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm">
          {searchActive
            ? "Try adjusting your search terms or filter criteria to discover leads."
            : "Start growing your business by creating your first lead in the system."}
        </p>
        <button
          onClick={onCreateLead}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-xs transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create New Lead</span>
        </button>
      </div>
    );
  }

  // 4. Populated Leads State
  return (
    <div className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-800/40 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <th scope="col" className="px-6 py-3.5">
                Lead
              </th>
              <th scope="col" className="px-6 py-3.5">
                Contact Details
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5">
                Created
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-300">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors group"
              >
                {/* Name & Avatar */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center text-xs shrink-0 border border-zinc-200 dark:border-zinc-700">
                      {getInitials(lead.name)}
                    </div>
                    <div>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono">
                        {lead.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>

                {/* Contact: Email & Phone */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <a
                      href={`mailto:${lead.email}`}
                      className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors truncate max-w-xs"
                    >
                      <MailIcon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span>{lead.email}</span>
                    </a>
                    {lead.phone && (
                      <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                        <PhoneIcon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                        <span>{lead.phone}</span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-6 py-4">
                  <LeadStatusBadge status={lead.status} />
                </td>

                {/* Date */}
                <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                  {formatDate(lead.createdAt)}
                </td>

                {/* Action: Update Status */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onSelectLeadForStatus(lead)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs font-medium"
                    title="Change status"
                  >
                    <EditIcon className="w-3.5 h-3.5" />
                    <span>Status</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="md:hidden divide-y divide-zinc-100 dark:divide-zinc-800">
        {leads.map((lead) => (
          <div key={lead.id} className="p-4 space-y-3">
            {/* Header: Name and Status */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold flex items-center justify-center text-xs shrink-0 border border-zinc-200 dark:border-zinc-700">
                  {getInitials(lead.name)}
                </div>
                <div>
                  <h4 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                    {lead.name}
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {lead.id.slice(0, 8)}...
                  </span>
                </div>
              </div>
              <LeadStatusBadge status={lead.status} size="sm" />
            </div>

            {/* Contact Information */}
            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400 bg-zinc-50/70 dark:bg-zinc-800/40 p-2.5 rounded-lg">
              <div className="flex items-center gap-2 truncate">
                <MailIcon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                <a
                  href={`mailto:${lead.email}`}
                  className="hover:underline truncate"
                >
                  {lead.email}
                </a>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2">
                  <PhoneIcon className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                  <span>{lead.phone}</span>
                </div>
              )}
            </div>

            {/* Footer with date and change status button */}
            <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
              <span className="flex items-center gap-1 text-[11px]">
                <CalendarIcon className="w-3 h-3" />
                {formatDate(lead.createdAt)}
              </span>

              <button
                onClick={() => onSelectLeadForStatus(lead)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-xs transition-colors"
              >
                <EditIcon className="w-3.5 h-3.5" />
                <span>Update Status</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

