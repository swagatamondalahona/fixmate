
export default function Loading() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-300 dark:border-zinc-700" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-600" />
            </div>

            <div className="text-center">
                <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                    Loading FixMate...
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Please wait while we prepare everything for you.
                </p>
            </div>
        </div>
    );
}
