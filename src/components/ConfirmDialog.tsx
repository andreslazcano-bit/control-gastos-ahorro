"use client";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-surface-card p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-text-secondary">{description}</p>
        )}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border-strong px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-surface-card-hover"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium text-white ${
              danger ? "bg-critical hover:opacity-90" : "bg-accent hover:opacity-90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
