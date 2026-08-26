"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, LoaderCircle } from "lucide-react";

type ConfirmActionButtonProps = {
  children: ReactNode;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
};

export function ConfirmActionButton({
  children,
  onConfirm,
  title = "Delete this item?",
  description = "This action cannot be undone.",
  className,
  disabled = false,
}: ConfirmActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  async function confirm() {
    setIsConfirming(true);
    try {
      await onConfirm();
      setIsOpen(false);
    } finally {
      setIsConfirming(false);
    }
  }

  return (
    <>
      <button type="button" disabled={disabled} onClick={() => setIsOpen(true)} className={className}>
        {children}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-action-title">
          <button type="button" aria-label="Cancel deletion" onClick={() => setIsOpen(false)} disabled={isConfirming} className="absolute inset-0 bg-zinc-950/55 backdrop-blur-sm" />
          <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertTriangle aria-hidden="true" className="h-5 w-5" />
            </div>
            <h2 id="confirm-action-title" className="mt-5 text-lg font-semibold text-zinc-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setIsOpen(false)} disabled={isConfirming} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60">Cancel</button>
              <button type="button" onClick={confirm} disabled={isConfirming} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60">
                {isConfirming ? <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" /> : null}
                {isConfirming ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
