"use client";

import React, { useState } from "react";
import { useLeads } from "@/hooks/use-leads";
import { Lead, LeadStatus } from "@/lib/types";
import { LeadStats } from "@/components/lead-stats";
import { LeadSearchBar } from "@/components/lead-search-bar";
import { LeadTable } from "@/components/lead-table";
import { PaginationControls } from "@/components/pagination-controls";
import { CreateLeadModal } from "@/components/create-lead-modal";
import { UpdateStatusModal } from "@/components/update-status-modal";
import { PlusIcon, UsersIcon } from "@/components/icons";

export default function LeadsPage() {
  // Query parameters state
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "ALL">("ALL");

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [leadForStatus, setLeadForStatus] = useState<Lead | null>(null);

  // TanStack Query to fetch leads
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useLeads({
    page,
    limit,
    search,
  });

  const rawLeads = data?.leads ?? [];
  const pagination = data?.pagination ?? {
    page,
    limit,
    total: rawLeads.length,
    totalPages: Math.max(1, Math.ceil(rawLeads.length / limit)),
  };

  // Client-side quick filter for status tab if active
  const filteredLeads =
    statusFilter === "ALL"
      ? rawLeads
      : rawLeads.filter((l) => l.status === statusFilter);

  // When search changes, reset page to 1
  const handleSearchChange = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-black flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center font-bold text-sm shadow-xs">
              <UsersIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  LeadTrack
                </h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Minimalist Pipeline & Conversion Tracking
              </p>
            </div>
          </div>

          {/* Action: Create New Lead */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Lead</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Page Title & Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Leads Overview
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Monitor, search, and update client acquisition stages in real time.
            </p>
          </div>
        </div>

        {/* 1. Summary Statistics */}
        <LeadStats
          leads={rawLeads}
          totalCount={pagination.total}
          isLoading={isLoading}
        />

        {/* 2. Search & Filter Bar */}
        <LeadSearchBar
          searchQuery={search}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onRefresh={() => refetch()}
          isFetching={isFetching}
        />

        {/* 3. Leads Table & Cards View */}
        <LeadTable
          leads={filteredLeads}
          isLoading={isLoading}
          isError={isError}
          errorMessage={
            error instanceof Error ? error.message : "Failed to fetch leads."
          }
          onRetry={() => refetch()}
          onSelectLeadForStatus={(lead) => setLeadForStatus(lead)}
          onCreateLead={() => setIsCreateOpen(true)}
          searchActive={Boolean(search.trim() || statusFilter !== "ALL")}
        />

        {/* 4. Pagination Controls */}
        {!isError && rawLeads.length > 0 && (
          <PaginationControls
            pagination={pagination}
            onPageChange={(newPage) => setPage(newPage)}
            onLimitChange={handleLimitChange}
            isLoading={isFetching}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 py-5 bg-white/50 dark:bg-zinc-950/50 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>LeadTrack System &bull; Powered by TanStack Query & Zod</span>
          <span className="font-mono text-[11px] text-zinc-400">
            API: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}
          </span>
        </div>
      </footer>

      {/* Modals */}
      <CreateLeadModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <UpdateStatusModal
        lead={leadForStatus}
        isOpen={Boolean(leadForStatus)}
        onClose={() => setLeadForStatus(null)}
      />
    </div>
  );
}
