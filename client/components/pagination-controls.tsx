import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { Pagination } from "@/lib/types";

interface PaginationControlsProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export function PaginationControls({
  pagination,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: PaginationControlsProps) {
  const { page, limit, total, totalPages } = pagination;

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xs text-xs text-zinc-600 dark:text-zinc-400">
      {/* Range indicator */}
      <div className="flex items-center gap-3">
        <span>
          Showing{" "}
          <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
            {startItem}-{endItem}
          </strong>{" "}
          of{" "}
          <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
            {total}
          </strong>{" "}
          leads
        </span>

        {/* Limit Selector */}
        <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-zinc-200 dark:border-zinc-700">
          <span>Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={isLoading}
            className="px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-zinc-500 dark:text-zinc-400 mr-1">
          Page {page} of {Math.max(totalPages, 1)}
        </span>

        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1 || isLoading}
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages || isLoading || total === 0}
          className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

