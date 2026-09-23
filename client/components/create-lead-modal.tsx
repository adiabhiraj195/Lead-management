"use client";

import React, { useState, useEffect } from "react";
import { XIcon, SpinnerIcon, AlertCircleIcon } from "./icons";
import { LeadStatus } from "@/lib/types";
import {
  createLeadSchema,
  formatZodErrors,
  CreateLeadFormData,
} from "@/lib/validations";
import { useCreateLead, ApiRequestError } from "@/hooks/use-leads";
import { useToast } from "./ui-toast";

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM_STATE: CreateLeadFormData = {
  name: "",
  email: "",
  phone: "",
  status: "NEW",
};

function CreateLeadModalDialog({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState<CreateLeadFormData>(INITIAL_FORM_STATE);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const { showToast } = useToast();
  const createLeadMutation = useCreateLead();

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (field: keyof CreateLeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // 1. Zod client-side validation
    const validationResult = createLeadSchema.safeParse(formData);
    if (!validationResult.success) {
      const formatted = formatZodErrors(validationResult.error);
      setFieldErrors(formatted);
      return;
    }

    setFieldErrors({});

    // 2. Submit validated payload to API
    try {
      await createLeadMutation.mutateAsync(validationResult.data);
      showToast(
        "success",
        "Lead Created",
        `${validationResult.data.name} has been added successfully.`
      );
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError) {
        if (err.details && err.details.length > 0) {
          const detailErrors: Record<string, string> = {};
          err.details.forEach((d) => {
            detailErrors[d.field] = d.message;
          });
          setFieldErrors(detailErrors);
        } else {
          setGeneralError(err.message || "Failed to create lead");
        }
      } else {
        setGeneralError("An unexpected error occurred while saving the lead.");
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h3
              id="modal-title"
              className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
            >
              Create New Lead
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Enter the lead information below to track in your pipeline.
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
          {generalError && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircleIcon className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label
              htmlFor="lead-name"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="lead-name"
              type="text"
              placeholder="e.g. Sarah Connor"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 transition-colors ${
                fieldErrors.name
                  ? "border-rose-400 focus:ring-2 focus:ring-rose-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              }`}
            />
            {fieldErrors.name && (
              <p className="mt-1 text-xs text-rose-500">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="lead-email"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="lead-email"
              type="email"
              placeholder="e.g. sarah@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 transition-colors ${
                fieldErrors.email
                  ? "border-rose-400 focus:ring-2 focus:ring-rose-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              }`}
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-rose-500">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="lead-phone"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Phone Number <span className="text-rose-500">*</span>
            </label>
            <input
              id="lead-phone"
              type="tel"
              placeholder="e.g. +1-555-0199"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded-lg border bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:bg-white dark:focus:bg-zinc-800 transition-colors ${
                fieldErrors.phone
                  ? "border-rose-400 focus:ring-2 focus:ring-rose-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              }`}
            />
            {fieldErrors.phone && (
              <p className="mt-1 text-xs text-rose-500">{fieldErrors.phone}</p>
            )}
          </div>

          {/* Status Enum Selector */}
          <div>
            <label
              htmlFor="lead-status"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1"
            >
              Initial Status
            </label>
            <select
              id="lead-status"
              value={formData.status}
              onChange={(e) =>
                handleChange("status", e.target.value as LeadStatus)
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/40 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            >
              <option value="NEW">NEW — Newly registered inquiry</option>
              <option value="CONTACTED">CONTACTED — Reached out via phone/email</option>
              <option value="QUALIFIED">QUALIFIED — Verified interest & fit</option>
              <option value="CONVERTED">CONVERTED — Successfully converted</option>
            </select>
          </div>

          {/* Actions Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={createLeadMutation.isPending}
              className="px-4 py-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLeadMutation.isPending}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg shadow-xs transition-colors disabled:opacity-50 min-w-[110px]"
            >
              {createLeadMutation.isPending ? (
                <>
                  <SpinnerIcon className="w-3.5 h-3.5" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Lead</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CreateLeadModal({ isOpen, onClose }: CreateLeadModalProps) {
  if (!isOpen) return null;
  return <CreateLeadModalDialog onClose={onClose} />;
}

