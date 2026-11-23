
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { formatUSD } from "@/lib/currency";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Payment = {
    _id: string;
    bookingId: string;
    serviceTitle: string;
    technicianName?: string;
    technicianEmail?: string;
    transactionId: string;
    amount: number;
    currency: string;
    paymentStatus: string;
    status: string;
    paidAt: string;
    createdAt: string;
};

type TokenResponse = {
    token?: unknown;
    data?: {
        token?: unknown;
    } | null;
};

export default function CustomerPaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPayments = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const tokenResponse: unknown = await authClient.token();

            let token = "";

            if (typeof tokenResponse === "string") {
                token = tokenResponse;
            } else if (
                tokenResponse &&
                typeof tokenResponse === "object"
            ) {
                const result = tokenResponse as TokenResponse;
                const extractedToken =
                    result.data?.token || result.token;

                if (typeof extractedToken === "string") {
                    token = extractedToken;
                }
            }

            if (!token || token.split(".").length !== 3) {
                throw new Error(
                    "Invalid authentication token. Please sign in again."
                );
            }

            const response = await fetch(
                `${API_URL}/api/payments/my-payments`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    cache: "no-store",
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                throw new Error(
                    "Backend returned an invalid response. Please try again."
                );
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load payment history"
                );
            }

            setPayments(result.data?.payments || []);
        } catch (err) {
            console.error("Payment History Error:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const totalAmount = payments.reduce(
        (total, payment) =>
            total + Number(payment.amount || 0),
        0
    );

    const formatAmount = (amount: number) => {
        return formatUSD(amount, { decimals: true });
    };

    const formatDate = (date?: string) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-BD", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const shortId = (id?: string) => {
        if (!id) return "N/A";

        return id.length > 18
            ? `${id.slice(0, 10)}...${id.slice(-5)}`
            : id;
    };

    return (
        <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 transition-colors duration-300 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <Link
                            href="/dashboard/customer"
                            className="mb-3 inline-flex items-center gap-2 text-sm text-zinc-600 transition hover:text-orange-500 dark:text-gray-400"
                        >
                            ← Back to Dashboard
                        </Link>

                        <h1 className="text-3xl font-bold sm:text-4xl">
                            Payment History
                        </h1>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-gray-400">
                            View and track all your service payments.
                        </p>
                    </div>

                    <button
                        onClick={fetchPayments}
                        disabled={loading}
                        className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-orange-500 hover:text-orange-600 disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:text-orange-500"
                    >
                        {loading ? "Refreshing..." : "↻ Refresh"}
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid gap-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors duration-300 dark:border-white/10 dark:bg-[#111]">
                        <p className="text-sm text-zinc-600 dark:text-gray-400">
                            Total Payments
                        </p>

                        <h2 className="mt-3 text-3xl font-bold">
                            {payments.length}
                        </h2>

                        <p className="mt-2 text-xs text-zinc-500 dark:text-gray-500">
                            Successful transactions
                        </p>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 transition-colors duration-300 dark:border-white/10 dark:bg-[#111]">
                        <p className="text-sm text-zinc-600 dark:text-gray-400">
                            Total Amount Paid
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-orange-600 dark:text-orange-500">
                            {formatAmount(totalAmount)}
                        </h2>

                        <p className="mt-2 text-xs text-zinc-500 dark:text-gray-500">
                            Total successful payment amount
                        </p>
                    </div>
                </div>

                {/* Payment Table */}
                <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-colors duration-300 dark:border-white/10 dark:bg-[#111]">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5 dark:border-white/10">
                        <div>
                            <h2 className="text-lg font-bold">
                                Transactions
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500 dark:text-gray-500">
                                Your recent payment records
                            </p>
                        </div>

                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-500">
                            {payments.length} Records
                        </span>
                    </div>

                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />

                            <p className="text-sm text-zinc-600 dark:text-gray-400">
                                Loading payment history...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-16 text-center">
                            <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </p>

                            <button
                                onClick={fetchPayments}
                                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-orange-400"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <div className="mb-4 text-5xl">💳</div>

                            <h3 className="text-xl font-bold">
                                No Payments Yet
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-600 dark:text-gray-400">
                                Your completed service payments will appear
                                here.
                            </p>

                            <Link
                                href="/dashboard/customer/bookings"
                                className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                            >
                                View My Bookings
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left text-sm">
                                <thead className="bg-zinc-100 text-xs uppercase tracking-wider text-zinc-500 dark:bg-white/[0.03] dark:text-gray-500">
                                    <tr>
                                        <th className="px-6 py-4">Service</th>
                                        <th className="px-6 py-4">Technician</th>
                                        <th className="px-6 py-4">Booking ID</th>
                                        <th className="px-6 py-4">Transaction ID</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Payment Date</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                    {payments.map((payment) => (
                                        <tr
                                            key={payment._id}
                                            className="transition hover:bg-zinc-50 dark:hover:bg-white/[0.025]"
                                        >
                                            <td className="px-6 py-5 font-semibold">
                                                {payment.serviceTitle || "Service"}
                                            </td>

                                            <td className="px-6 py-5 text-zinc-700 dark:text-gray-300">
                                                {payment.technicianName ||
                                                    payment.technicianEmail ||
                                                    "Verified Technician"}
                                            </td>

                                            <td className="px-6 py-5 text-zinc-600 dark:text-gray-400">
                                                {shortId(payment.bookingId)}
                                            </td>

                                            <td className="px-6 py-5 text-zinc-600 dark:text-gray-400">
                                                {shortId(payment.transactionId)}
                                            </td>

                                            <td className="px-6 py-5 font-bold text-orange-600 dark:text-orange-500">
                                                {formatAmount(
                                                    Number(payment.amount || 0)
                                                )}
                                            </td>

                                            <td className="px-6 py-5 text-zinc-600 dark:text-gray-400">
                                                {formatDate(
                                                    payment.paidAt || payment.createdAt
                                                )}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                                                    {payment.paymentStatus || payment.status || "Paid"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <p className="mt-5 text-center text-xs text-zinc-500 dark:text-gray-600">
                    FixMate • Secure Payment History
                </p>
            </div>
        </main>
    );
}
