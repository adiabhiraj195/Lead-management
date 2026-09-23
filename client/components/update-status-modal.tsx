"use client";

import React, { useState, useEffect } from "react";
import { XIcon, SpinnerIcon, AlertCircleIcon } from "./icons";
import { Lead, LeadStatus } from "@/lib/types";
import { updateLeadStatusSchema, formatZodErrors } from "@/lib/validations";
import { useUpdateLeadStatus, ApiRequestError } from "@/hooks/use-leads";
import { useToast } from "./ui-toast";
import { LeadStatusBadge } from "./lead-status-badge";

interface UpdateStatusModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_OPTIONS: {
  value: LeadStatus;
  title: string;
  description: string;
}[] = [
  {
    value: "NEW",
    title: "New",
    description: "Initial discovery, no outreach performed yet.",
  },
  {
    value: "CONTACTED",
    title: "Contacted",
    description: "In direct dialogue via email or phone.",
  },
  {
    value: "QUALIFIED",
    title: "Qualified",
    description: "Evaluated budget, timeline, and requirement fit.",
  },
  {
    value: "CONVERTED",
    title: "Converted",
    description: "Won customer, successfully onboarded.",
  },
];

function UpdateStatusModalDialog({
  lead,
  onClose,
}: {
  lead: Lead;
  onClose: () => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus>(lead.status);
  const [error, setError] = useState<string | null>(null);

  const { showToast } = useToast();
  const updateMutation = useUpdateLeadStatus();

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate using Zod
    const validationResult = updateLeadStatusSchema.safeParse({
      id: lead.id,
      status: selectedStatus,
    });

    if (!validationResult.success) {
      const errMap = formatZodErrors(validationResult.error);
      setError(Object.values(errMap)[0] || "Validation failed");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: validationResult.data.id,
        status: validationResult.data.status,
      });

      showToast(
        "success",
        "Status Updated",
        `Updated ${lead.name}'s status to ${selectedStatus}.`
      );
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message || "Failed to update status");
      } else {
        setError("An unexpected error occurred while updating status.");
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="update-status-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3
              id="update-status-title"
              className="text-base font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Update Lead Status
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Change stage for{" "}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {lead.name}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close dialog"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            {STATUS_OPTIONS.map((option) => {
              const isSelected = selectedStatus === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/60 shadow-xs"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900"
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setSelectedStatus(option.value)}
                    className="mt-1 text-zinc-900 focus:ring-zinc-900"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {option.title}
                      </span>
                      <LeadStatusBadge status={option.value} size="sm" />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending || selectedStatus === lead.status}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-xs transition-colors disabled:opacity-50 min-w-[110px]"
            >
              {updateMutation.isPending ? (
                <>
                  <SpinnerIcon className="w-3.5 h-3.5" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Status</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UpdateStatusModal({
  lead,
  isOpen,
  onClose,
}: UpdateStatusModalProps) {
  if (!isOpen || !lead) return null;
  return <UpdateStatusModalDialog lead={lead} onClose={onClose} />;
}

