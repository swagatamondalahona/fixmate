"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { formatUSD } from "@/lib/currency";

type VerificationResult = {
    success?: boolean;
    message?: string;
    data?: {
        bookingId?: string;
        serviceTitle?: string;
        transactionId?: string;
        amount?: number;
        currency?: string;
        paymentStatus?: string;
    };
};

type PaymentSummary = {
    serviceTitle?: string;
    transactionId?: string;
    amount?: number;
    currency?: string;
};

export default function PaymentSuccessPage() {
    const started = useRef(false);

    const [status, setStatus] = useState<"loading" | "success" | "error">(
        "loading"
    );
    const [message, setMessage] = useState(
        "Please wait while we verify your payment..."
    );
    const [summary, setSummary] = useState<PaymentSummary | null>(null);

    useEffect(() => {
        if (started.current) return;

        started.current = true;

        const verifyPayment = async () => {
            try {
                const params = new URLSearchParams(window.location.search);
                const sessionId = params.get("session_id");

                if (!sessionId) {
                    throw new Error("Stripe session ID was not found.");
                }

                const tokenResult = await authClient.token();
                const token = tokenResult.data?.token;

                if (tokenResult.error || !token) {
                    throw new Error(
                        "Authentication failed. Please sign in again."
                    );
                }

                const apiURL =
                    process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

                if (!apiURL) {
                    throw new Error("API URL is not configured.");
                }

                const response = await fetch(
                    `${apiURL}/api/payments/verify-checkout-session`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ sessionId }),
                    }
                );

                const result: VerificationResult = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Payment verification failed."
                    );
                }

                if (result.data?.paymentStatus !== "paid") {
                    throw new Error("Payment has not been confirmed yet.");
                }

                setSummary({
                    serviceTitle: result.data.serviceTitle,
                    transactionId: result.data.transactionId,
                    amount: result.data.amount,
                    currency: result.data.currency,
                });
                setStatus("success");
                setMessage(
                    result.message || "Your payment was verified and recorded."
                );
                toast.success("Payment completed successfully!");
            } catch (error) {
                console.error("Payment verification error:", error);

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while verifying payment.";

                setStatus("error");
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        };

        verifyPayment();
    }, []);

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-zinc-100 px-4 py-16 text-zinc-900 dark:bg-black dark:text-white">
            <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-zinc-950">
                {status === "loading" && (
                    <>
                        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-zinc-300 border-t-orange-500 dark:border-zinc-700 dark:border-t-orange-500" />

                        <h1 className="mb-3 text-2xl font-bold">
                            Verifying Payment
                        </h1>

                        <p className="text-zinc-600 dark:text-zinc-400">
                            {message}
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl text-green-600 dark:text-green-500">
                            ✓
                        </div>

                        <h1 className="mb-3 text-2xl font-bold text-green-600 dark:text-green-500">
                            Payment Successful!
                        </h1>

                        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
                            {message}
                        </p>

                        {summary && (
                            <div className="mb-7 space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-5 text-left text-sm dark:border-white/10 dark:bg-black/60">
                                {summary.serviceTitle && (
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-zinc-500 dark:text-zinc-400">
                                            Service
                                        </span>
                                        <span className="font-semibold text-zinc-900 dark:text-white">
                                            {summary.serviceTitle}
                                        </span>
                                    </div>
                                )}

                                {typeof summary.amount === "number" && (
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="text-zinc-500 dark:text-zinc-400">
                                            Amount Paid
                                        </span>
                                        <span className="text-base font-bold text-orange-600 dark:text-orange-400">
                                            {formatUSD(summary.amount, {
                                                decimals: true,
                                            })}{" "}
                                            {(
                                                summary.currency || "usd"
                                            ).toUpperCase()}
                                        </span>
                                    </div>
                                )}

                                {summary.transactionId && (
                                    <div className="flex flex-col gap-1 border-t border-zinc-200 pt-3 dark:border-white/10">
                                        <span className="text-zinc-500 dark:text-zinc-400">
                                            Transaction ID
                                        </span>
                                        <span className="break-all font-mono text-xs text-zinc-800 dark:text-zinc-200">
                                            {summary.transactionId}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Link
                                href="/dashboard/customer/bookings"
                                className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                            >
                                Back to My Bookings
                            </Link>

                            <Link
                                href="/dashboard/customer/payments"
                                className="inline-block rounded-lg border border-zinc-300 px-6 py-3 font-semibold text-zinc-800 transition hover:border-orange-500 hover:text-orange-500 dark:border-white/15 dark:text-zinc-200"
                            >
                                Payment History
                            </Link>
                        </div>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-600 dark:text-red-500">
                            !
                        </div>

                        <h1 className="mb-3 text-2xl font-bold text-red-600 dark:text-red-500">
                            Payment Verification Failed
                        </h1>

                        <p className="mb-8 break-words text-zinc-600 dark:text-zinc-400">
                            {message}
                        </p>

                        <Link
                            href="/dashboard/customer/bookings"
                            className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                        >
                            Back to My Bookings
                        </Link>
                    </>
                )}
            </div>
        </main>
    );
}
