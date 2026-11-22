
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("FixMate application error:", error);
    }, [error]);

    return (
        <main className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-12 text-foreground">
            <div className="w-full max-w-lg text-center">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 text-5xl dark:bg-red-950">
                    ⚠️
                </div>

                <p className="mb-2 text-sm font-bold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
                    FixMate
                </p>

                <h1 className="text-3xl font-bold">
                    Something Went Wrong!
                </h1>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    An unexpected error occurred. Please try again.
                    If the problem continues, return to the homepage.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        ↻ Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 px-5 py-3 font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                        ⌂ Back to Home
                    </Link>
                </div>

                <p className="mt-8 text-xs text-zinc-500">
                    © {new Date().getFullYear()} FixMate. All rights reserved.
                </p>
            </div>
        </main>
    );
}
