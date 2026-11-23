"use client";

import Link from "next/link";

export default function PaymentCancelPage() {
    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-zinc-100 px-4 py-16 text-zinc-900 dark:bg-black dark:text-white">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-zinc-950">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 text-3xl text-amber-600 dark:text-amber-400">
                    ✕
                </div>

                <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                    FixMate Checkout
                </p>

                <h1 className="mb-3 text-2xl font-bold sm:text-3xl">
                    Payment Cancelled
                </h1>

                <p className="mb-8 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    Your payment was cancelled and no charge was made. Your
                    booking remains unpaid, and you can retry payment anytime
                    from your bookings page.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/dashboard/customer/bookings"
                        className="inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                    >
                        Try Again
                    </Link>

                    <Link
                        href="/"
                        className="inline-block rounded-lg border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-800 transition hover:border-orange-500 hover:text-orange-500 dark:border-white/15 dark:text-zinc-200"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}
