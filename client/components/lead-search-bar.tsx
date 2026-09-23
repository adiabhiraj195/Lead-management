"use client";

import React, { useState, useEffect } from "react";
import { SearchIcon, XIcon, RefreshCwIcon } from "./icons";
import { LeadStatus } from "@/lib/types";

interface LeadSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: LeadStatus | "ALL";
  onStatusFilterChange: (status: LeadStatus | "ALL") => void;
  onRefresh: () => void;
  isFetching?: boolean;
}

const FILTER_TABS: { label: string; value: LeadStatus | "ALL" }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Qualified", value: "QUALIFIED" },
  { label: "Converted", value: "CONVERTED" },
];

export function LeadSearchBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  isFetching = false,
}: LeadSearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  // Synchronize state during render when prop changes (React recommended pattern)
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setLocalQuery(searchQuery);
  }

  // Debounce search input callback by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localQuery !== searchQuery) {
        onSearchChange(localQuery);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localQuery, searchQuery, onSearchChange]);

  const handleClear = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white dark:bg-zinc-900/60 p-3 sm:p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
      {/* Search Input Container */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
          <SearchIcon className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search leads by name, email, or phone..."
          className="w-full pl-9 pr-9 py-2 text-sm bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:bg-white dark:focus:bg-zinc-800 transition-all"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            aria-label="Clear search"
          >
            <XIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Tabs & Refresh Actions */}
      <div className="flex items-center justify-between sm:justify-start gap-2 overflow-x-auto pb-1 lg:pb-0">
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/70 p-1 rounded-lg border border-zinc-200/80 dark:border-zinc-700/50">
          {FILTER_TABS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => onStatusFilterChange(tab.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700/80 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 shrink-0"
          title="Refresh leads list"
          aria-label="Refresh leads list"
        >
          <RefreshCwIcon className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
        </button>
      </div>
    </div>
  );
}

