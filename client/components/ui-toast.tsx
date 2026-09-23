"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircleIcon, AlertCircleIcon, XIcon } from "./icons";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto dismiss after 4 seconds
      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast Notification Viewport */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${
              toast.type === "success"
                ? "bg-white/95 dark:bg-zinc-900/95 border-emerald-500/30 text-zinc-900 dark:text-zinc-100"
                : toast.type === "error"
                ? "bg-white/95 dark:bg-zinc-900/95 border-rose-500/30 text-zinc-900 dark:text-zinc-100"
                : "bg-white/95 dark:bg-zinc-900/95 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" ? (
                <CheckCircleIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : toast.type === "error" ? (
                <AlertCircleIcon className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              ) : (
                <AlertCircleIcon className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

