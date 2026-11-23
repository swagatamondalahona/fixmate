"use client";

type ConfirmModalProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    tone?: "danger" | "primary";
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "danger",
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm dark:bg-black/80"
        >
            <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111111]">
                <div className="mb-4 flex items-center gap-3">
                    <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                            tone === "danger"
                                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                        }`}
                    >
                        {tone === "danger" ? "!" : "?"}
                    </div>

                    <h2
                        id="confirm-modal-title"
                        className="text-lg font-bold text-zinc-900 dark:text-white"
                    >
                        {title}
                    </h2>
                </div>

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {description}
                </p>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
                    >
                        {cancelLabel}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
                            tone === "danger"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-orange-500 hover:bg-orange-600"
                        }`}
                    >
                        {loading ? "Processing..." : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
