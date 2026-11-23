
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type VerificationResult = {
    success?: boolean;
    message?: string;
    data?: {
        bookingId?: string;
        sessionId?: string;
        paymentStatus?: string;
    };
};

export default function PaymentSuccessPage() {
    const started = useRef(false);

    const [status, setStatus] = useState<
        "loading" | "success" | "error"
    >("loading");

    const [message, setMessage] = useState(
        "Please wait while we verify your payment..."
    );

    useEffect(() => {
        if (started.current) return;

        started.current = true;

        const verifyPayment = async () => {
            try {
                const params = new URLSearchParams(
                    window.location.search
                );

                const sessionId = params.get("session_id");

                if (!sessionId) {
                    throw new Error(
                        "Stripe session ID was not found."
                    );
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
                    throw new Error(
                        "API URL is not configured."
                    );
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

                const result: VerificationResult =
                    await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                        "Payment verification failed."
                    );
                }

                if (
                    result.data?.paymentStatus !== "paid"
                ) {
                    throw new Error(
                        "Payment has not been confirmed yet."
                    );
                }

                setStatus("success");

                setMessage(
                    result.message ||
                    "Your payment was successful."
                );
            } catch (error) {
                console.error(
                    "Payment verification error:",
                    error
                );

                setStatus("error");

                setMessage(
                    error instanceof Error
                        ? error.message
                        : "Something went wrong while verifying payment."
                );
            }
        };

        verifyPayment();
    }, []);

    return (
        <main className="min-h-screen bg-black px-4 py-16 text-white flex items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-zinc-950 p-8 text-center shadow-xl">

                {status === "loading" && (
                    <>
                        <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-zinc-700 border-t-orange-500" />

                        <h1 className="mb-3 text-2xl font-bold">
                            Verifying Payment
                        </h1>

                        <p className="text-zinc-400">
                            {message}
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl text-green-500">
                            ✓
                        </div>

                        <h1 className="mb-3 text-2xl font-bold text-green-500">
                            Payment Successful!
                        </h1>

                        <p className="mb-8 text-zinc-400">
                            {message}
                        </p>

                        <Link
                            href="/dashboard/customer/payments"
                            className="inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                        >
                            View Payment History
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-500">
                            !
                        </div>

                        <h1 className="mb-3 text-2xl font-bold text-red-500">
                            Payment Verification Failed
                        </h1>

                        <p className="mb-8 break-words text-zinc-400">
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
