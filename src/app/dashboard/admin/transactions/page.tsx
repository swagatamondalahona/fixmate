
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Transaction {
    _id: string;
    bookingId?: string;
    serviceTitle?: string;
    customerEmail?: string;
    technicianEmail?: string;
    amount?: number;
    currency?: string;
    status?: string;
    paymentStatus?: string;
    transactionId?: string;
    stripeSessionId?: string;
    createdAt?: string;
}

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Please sign in as an admin.");
            }

            const response = await fetch(
                `${API_URL}/api/admin/transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load transactions."
                );
            }

            setTransactions(result.data || []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load transactions."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const totalRevenue = transactions.reduce(
        (total, transaction) =>
            total + Number(transaction.amount || 0),
        0
    );

    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
            {/* Background orange glow */}
            <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />

            {/* FixMate repair tools watermark */}
            <div className="pointer-events-none absolute right-[-45px] top-40 opacity-[0.035] sm:right-10 sm:top-32">
                <svg
                    viewBox="0 0 300 300"
                    className="h-64 w-64 sm:h-96 sm:w-96"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M180 45C202 23 237 22 260 39L215 84L216 113L245 114L290 69C307 93 303 127 281 149C260 170 228 175 202 163L112 253C98 267 76 267 62 253C48 239 48 217 62 203L152 113C140 87 148 60 180 45Z"
                        stroke="#F97316"
                        strokeWidth="12"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M42 52L85 95M35 88L72 125M25 25L125 125"
                        stroke="#F97316"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />
                    <circle
                        cx="75"
                        cy="225"
                        r="19"
                        stroke="#F97316"
                        strokeWidth="10"
                    />
                </svg>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                                FixMate Administration
                            </p>
                        </div>

                        <h1 className="text-3xl font-bold sm:text-4xl">
                            Manage{" "}
                            <span className="text-orange-500">
                                Transactions
                            </span>
                        </h1>

                        <p className="mt-2 text-sm text-gray-400 sm:text-base">
                            View and monitor all customer payments.
                        </p>
                    </div>

                    <button
                        onClick={fetchTransactions}
                        disabled={loading}
                        className="rounded-lg border border-orange-500 bg-orange-500 px-5 py-3 font-semibold text-black transition duration-300 hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Loading..." : "↻ Refresh Transactions"}
                    </button>
                </div>

                {/* Statistics */}
                <div className="mb-8 grid gap-5 sm:grid-cols-2">
                    <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-950 to-black p-6 transition duration-300 hover:border-orange-500/50">
                        <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-orange-500/5 blur-2xl transition group-hover:bg-orange-500/10" />

                        <div className="relative">
                            <p className="text-sm font-medium text-gray-400">
                                Total Transactions
                            </p>

                            <p className="mt-3 text-4xl font-bold text-white">
                                {transactions.length}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                All recorded payments
                            </p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-950 to-black p-6 transition duration-300 hover:border-orange-500/50">
                        <div className="absolute -right-5 -top-5 h-28 w-28 rounded-full bg-orange-500/5 blur-2xl transition group-hover:bg-orange-500/10" />

                        <div className="relative">
                            <p className="text-sm font-medium text-gray-400">
                                Total Revenue
                            </p>

                            <p className="mt-3 text-4xl font-bold text-orange-500">
                                {totalRevenue.toLocaleString()}
                            </p>

                            <p className="mt-2 text-xs text-gray-500">
                                {transactions[0]?.currency?.toUpperCase() || "Payment currency"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Transactions Content */}
                {loading ? (
                    <div className="rounded-2xl border border-gray-800 bg-gray-950/90 p-12 text-center">
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-700 border-t-orange-500" />
                        <p className="text-gray-400">
                            Loading transactions...
                        </p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-red-900/60 bg-gray-950/90 p-8 text-center">
                        <p className="font-medium text-red-400">{error}</p>

                        <button
                            onClick={fetchTransactions}
                            className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 font-semibold text-black transition hover:bg-orange-400"
                        >
                            Try Again
                        </button>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="rounded-2xl border border-gray-800 bg-gray-950/90 px-5 py-16 text-center">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-500/20 bg-orange-500/10 text-3xl text-orange-500">
                            ৳
                        </div>

                        <h2 className="text-xl font-bold text-white">
                            No Transactions Yet
                        </h2>

                        <p className="mt-2 text-sm text-gray-400">
                            Completed customer payments will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {transactions.map((transaction) => (
                            <article
                                key={transaction._id}
                                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-950 via-gray-950 to-black p-5 transition duration-300 hover:border-orange-500/40 sm:p-6"
                            >
                                <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-orange-500/[0.025] blur-2xl transition group-hover:bg-orange-500/[0.06]" />

                                <div className="relative">
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/10 text-xl text-orange-500">
                                                ৳
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="text-lg font-bold text-white sm:text-xl">
                                                    {transaction.serviceTitle ||
                                                        "Service Payment"}
                                                </h2>

                                                <p className="mt-1 break-all text-xs text-gray-500">
                                                    Transaction ID:{" "}
                                                    {transaction.transactionId ||
                                                        transaction.stripeSessionId ||
                                                        transaction._id}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="w-fit rounded-full border border-green-800/70 bg-green-950/50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-green-400">
                                            {transaction.paymentStatus ||
                                                transaction.status ||
                                                "Paid"}
                                        </span>
                                    </div>

                                    <div className="my-5 border-t border-gray-800" />

                                    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Customer
                                            </p>
                                            <p className="mt-2 break-all text-sm text-gray-200">
                                                {transaction.customerEmail ||
                                                    "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Technician
                                            </p>
                                            <p className="mt-2 break-all text-sm text-gray-200">
                                                {transaction.technicianEmail ||
                                                    "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Amount
                                            </p>
                                            <p className="mt-2 text-lg font-bold text-orange-500">
                                                {Number(
                                                    transaction.amount || 0
                                                ).toLocaleString()}{" "}
                                                {transaction.currency?.toUpperCase() ||
                                                    ""}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Booking ID
                                            </p>
                                            <p className="mt-2 break-all text-sm text-gray-300">
                                                {transaction.bookingId || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Payment Date
                                            </p>
                                            <p className="mt-2 text-sm text-gray-300">
                                                {transaction.createdAt
                                                    ? new Date(
                                                        transaction.createdAt
                                                    ).toLocaleString()
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
