import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// Reusable anywhere a destructive/important action needs a "are you
// sure" step — deleting a product, deleting a shop, logging out, etc.
// Fully controlled: the parent owns `open` and decides what onConfirm
// actually does, this component only handles the confirm/cancel UI.
export default function ConfirmModal({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDangerous = false,
  isConfirming = false,
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null);

  // Close on Escape — a standard modal expectation, and it's a small
  // addition once we're already managing open/close state.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);

    // Send focus to Cancel on open, so keyboard users land somewhere
    // sensible instead of focus staying on the button that opened this.
    cancelButtonRef.current?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-800 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          id="confirm-modal-title"
          className="text-lg font-semibold text-white"
        >
          {title}
        </h3>
        {message && <p className="mt-2 text-sm text-slate-300">{message}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isDangerous
                ? "bg-red-500 text-red-950 hover:bg-red-400"
                : "bg-amber-500 text-slate-900 hover:bg-amber-400"
            }`}
          >
            {isConfirming ? "Working..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
