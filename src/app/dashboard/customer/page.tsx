
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
    formatUSD,
    formatStripePaymentError,
    MIN_STRIPE_CHECKOUT_USD,
} from "@/lib/currency";
import { getBookingStatusStyle } from "@/lib/constants";
import ConfirmModal from "@/components/shared/ConfirmModal";
import DashboardChart from "@/components/shared/DashboardChart";

type Booking = {
    _id: string;
    serviceTitle: string;
    serviceImage?: string;
    technicianId: string;
    technicianEmail?: string;
    customerId: string;
    bookingDate: string;
    address: string;
    notes?: string;
    basePrice: number;
    finalAmount: number | null;
    status:
    | "requested"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed"
    | "cancelled";
    paymentStatus: "unpaid" | "paid";
    createdAt: string;
};

type TokenResponse = {
    token?: unknown;
    data?: {
        token?: unknown;
    } | null;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState("");
    const [payingId, setPayingId] = useState("");
    const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Get Better Auth JWT token
    const getAuthToken = async (): Promise<string> => {
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

        return token;
    };

    // Fetch Customer Bookings
    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const token = await getAuthToken();

            const response = await fetch(
                `${API_URL}/api/bookings/my-bookings`,
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

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || "Failed to load your bookings."
                );
            }

            const bookingData =
                result.bookings ||
                result.data?.bookings ||
                result.data ||
                [];

            if (!Array.isArray(bookingData)) {
                throw new Error("Invalid booking data received from server.");
            }

            setBookings(bookingData);
        } catch (err) {
            console.error("Customer Bookings Error:", err);

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading bookings."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Cancel Booking
    const confirmCancelBooking = async () => {
        if (!cancelTargetId) return;

        const bookingId = cancelTargetId;

        try {
            setUpdatingId(bookingId);
            setError("");
            setMessage("");

            const token = await getAuthToken();

            const response = await fetch(
                `${API_URL.replace(/\/+$/, "")}/api/bookings/${bookingId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                throw new Error("Invalid server response.");
            }

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(
                    result.message || "Failed to cancel booking."
                );
            }

            setCancelTargetId(null);
            setMessage("Booking cancelled successfully!");
            toast.success("Booking cancelled successfully!");
            await fetchBookings();
        } catch (err) {
            console.error("Cancel Booking Error:", err);

            const msg =
                err instanceof Error
                    ? err.message
                    : "Failed to cancel booking.";
            setError(msg);
            toast.error(msg);
        } finally {
            setUpdatingId("");
        }
    };

    // Stripe Checkout Payment
    const handlePayment = async (booking: Booking) => {
        const payableAmount = Number(
            booking.finalAmount ?? booking.basePrice ?? 0
        );

        if (
            !Number.isFinite(payableAmount) ||
            payableAmount < MIN_STRIPE_CHECKOUT_USD
        ) {
            setError(
                `Minimum online payment is ${formatUSD(MIN_STRIPE_CHECKOUT_USD, { decimals: true })} USD. Current amount (${formatUSD(payableAmount)}) is too low — please contact the technician or admin to update the final amount.`
            );
            setMessage("");
            return;
        }

        try {
            setPayingId(booking._id);
            setError("");
            setMessage("");

            const token = await getAuthToken();

            const response = await fetch(
                `${API_URL.replace(/\/+$/, "")}/api/payments/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                    body: JSON.stringify({ bookingId: booking._id }),
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            if (!contentType.includes("application/json")) {
                throw new Error("Invalid payment server response.");
            }

            const result = await response.json();

            if (!response.ok || result.success === false) {
                throw new Error(
                    formatStripePaymentError(
                        result.message || "Unable to start payment."
                    )
                );
            }

            const checkoutUrl = result.data?.checkoutUrl;

            if (
                typeof checkoutUrl !== "string" ||
                !checkoutUrl.startsWith("https://")
            ) {
                throw new Error(
                    "A valid payment checkout URL was not returned."
                );
            }

            window.location.href = checkoutUrl;
        } catch (err) {
            console.error("Payment Error:", err);

            const msg =
                err instanceof Error
                    ? formatStripePaymentError(err.message)
                    : "Payment could not be started.";
            setError(msg);
            toast.error(msg);

            setPayingId("");
        }
    };

    // Booking Statistics
    const requestedCount = bookings.filter(
        (booking) => booking.status === "requested"
    ).length;

    const acceptedCount = bookings.filter(
        (booking) => booking.status === "accepted"
    ).length;

    const inProgressCount = bookings.filter(
        (booking) => booking.status === "in-progress"
    ).length;

    const activeCount = acceptedCount + inProgressCount;

    const completedCount = bookings.filter(
        (booking) => booking.status === "completed"
    ).length;

    const cancelledOrRejectedCount = bookings.filter(
        (booking) =>
            booking.status === "cancelled" || booking.status === "rejected"
    ).length;

    const paidCount = bookings.filter(
        (booking) => booking.paymentStatus === "paid"
    ).length;

    const getStatusStyle = (status: Booking["status"]) =>
        getBookingStatusStyle(status);

    const formatDate = (date: string) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Not available";
        }

        return parsedDate.toLocaleString("en-BD", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-100 px-4 py-12 text-zinc-900 transition-colors duration-300 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">

            {/* Background Watermark */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden select-none"
            >
                <div className="absolute -left-20 top-32 rotate-[-35deg] text-[180px] font-black text-orange-500/[0.045]">
                    ⚒
                </div>

                <div className="absolute right-[-35px] top-[35%] rotate-45 text-[200px] font-black text-orange-500/[0.04]">
                    🔧
                </div>

                <div className="absolute bottom-10 left-[30%] rotate-[-25deg] text-[160px] font-black text-orange-500/[0.035]">
                    ⚙
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-600 dark:text-orange-500">
                        FixMate Customer Panel
                    </p>

                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
                        My Dashboard
                    </h1>

                    <p className="mt-3 text-zinc-600 dark:text-gray-400">
                        Track your service bookings, manage requests and
                        complete payments.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                            href="/dashboard/customer/bookings"
                            className="rounded-lg border border-zinc-300 bg-white/70 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-orange-500 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:text-orange-400"
                        >
                            My Bookings →
                        </Link>

                        <Link
                            href="/dashboard/customer/payments"
                            className="rounded-lg border border-zinc-300 bg-white/70 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-orange-500 hover:text-orange-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:text-orange-400"
                        >
                            Payment History →
                        </Link>
                    </div>
                </div>

                {/* Statistics */}
                <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Total Requests",
                            value: bookings.length,
                            color: "text-orange-600 dark:text-orange-400",
                        },
                        {
                            title: "Active Jobs",
                            value: activeCount,
                            color: "text-amber-600 dark:text-amber-400",
                        },
                        {
                            title: "Completed Jobs",
                            value: completedCount,
                            color: "text-green-700 dark:text-green-400",
                        },
                        {
                            title: "Paid Jobs",
                            value: paidCount,
                            color: "text-blue-700 dark:text-blue-400",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-black/5 backdrop-blur-sm dark:border-white/10 dark:bg-[#111111]/95 dark:shadow-black/20"
                        >
                            <p className="text-sm text-zinc-600 dark:text-gray-400">
                                {item.title}
                            </p>

                            <h2
                                className={`mt-3 text-3xl font-extrabold ${item.color}`}
                            >
                                {item.value}
                            </h2>
                        </div>
                    ))}
                </div>

                {/* Visual Chart */}
                <div className="mb-10">
                    <DashboardChart
                        title="Repair Requests Breakdown"
                        subtitle="Live status distribution across all your bookings"
                        totalLabel="Requests"
                        data={[
                            {
                                label: "Requested",
                                value: requestedCount,
                                color: "#3b82f6",
                            },
                            {
                                label: "Accepted",
                                value: acceptedCount,
                                color: "#6366f1",
                            },
                            {
                                label: "In Progress",
                                value: inProgressCount,
                                color: "#f59e0b",
                            },
                            {
                                label: "Completed",
                                value: completedCount,
                                color: "#22c55e",
                            },
                            {
                                label: "Rejected / Cancelled",
                                value: cancelledOrRejectedCount,
                                color: "#71717a",
                            },
                        ]}
                    />
                </div>

                {/* Booking Section Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                            My Bookings
                        </h2>

                        <p className="mt-1 text-sm text-zinc-600 dark:text-gray-500">
                            View and manage all your service requests.
                        </p>
                    </div>

                    <button
                        onClick={fetchBookings}
                        disabled={loading}
                        className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-500/20 disabled:opacity-50 dark:text-orange-400"
                    >
                        {loading ? "Refreshing..." : "↻ Refresh"}
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400"
                    >
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {message && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
                    >
                        {message}
                    </div>
                )}

                {/* Loading / Empty / Bookings */}
                {loading ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-orange-600 dark:border-white/10 dark:bg-[#111111] dark:text-orange-400">
                        Loading Your Bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white/90 px-6 py-16 text-center dark:border-white/10 dark:bg-[#111111]/95">
                        <div className="mb-4 text-5xl">
                            📋
                        </div>

                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                            No Bookings Found
                        </h3>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-gray-400">
                            You have not booked any services yet.
                        </p>

                        <Link
                            href="/services"
                            className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                            Explore Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-black/5 backdrop-blur-sm transition hover:border-orange-500/30 sm:p-8 dark:border-white/10 dark:bg-[#111111]/95 dark:shadow-black/20"
                            >
                                {/* Card Header */}
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                                            Service Booking
                                        </p>

                                        <h3 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white sm:text-2xl">
                                            {booking.serviceTitle}
                                        </h3>
                                    </div>

                                    <span
                                        className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </span>
                                </div>

                                {/* Booking Information */}
                                <div className="mt-7 grid gap-5 border-t border-zinc-200 pt-6 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/10">

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Technician Email
                                        </p>

                                        <p className="mt-2 break-all font-medium text-zinc-800 dark:text-gray-200">
                                            {booking.technicianEmail ||
                                                "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Booking Date
                                        </p>

                                        <p className="mt-2 font-medium text-zinc-800 dark:text-gray-200">
                                            {formatDate(booking.bookingDate)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Base Price
                                        </p>

                                        <p className="mt-2 font-bold text-orange-600 dark:text-orange-400">
                                            {formatUSD(booking.basePrice)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Service Address
                                        </p>

                                        <p className="mt-2 font-medium text-zinc-800 dark:text-gray-200">
                                            {booking.address || "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Payment Status
                                        </p>

                                        <p
                                            className={`mt-2 font-semibold capitalize ${booking.paymentStatus === "paid"
                                                    ? "text-green-700 dark:text-green-400"
                                                    : "text-yellow-700 dark:text-yellow-400"
                                                }`}
                                        >
                                            {booking.paymentStatus || "unpaid"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Final Amount
                                        </p>

                                        <p className="mt-2 font-medium text-green-700 dark:text-green-400">
                                            {booking.finalAmount !== null &&
                                                booking.finalAmount !== undefined
                                                ? formatUSD(booking.finalAmount)
                                                : "Not set"}
                                        </p>
                                    </div>
                                </div>

                                {/* Customer Notes */}
                                {booking.notes && (
                                    <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-100/70 p-4 dark:border-white/5 dark:bg-black/30">
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Your Notes
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-gray-300">
                                            {booking.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Booking Actions */}
                                <div className="mt-7 flex flex-wrap gap-3 border-t border-zinc-200 pt-6 dark:border-white/10">

                                    {booking.status === "requested" && (
                                        <button
                                            onClick={() =>
                                                setCancelTargetId(booking._id)
                                            }
                                            disabled={
                                                updatingId === booking._id
                                            }
                                            className="rounded-lg border border-red-500/40 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-700 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                                        >
                                            {updatingId === booking._id
                                                ? "Cancelling..."
                                                : "✕ Cancel Booking"}
                                        </button>
                                    )}

                                    {booking.status === "completed" &&
                                        booking.paymentStatus === "unpaid" && (() => {
                                            const payableAmount = Number(
                                                booking.finalAmount ??
                                                    booking.basePrice ??
                                                    0
                                            );
                                            const isBelowMinimum =
                                                !Number.isFinite(payableAmount) ||
                                                payableAmount <
                                                    MIN_STRIPE_CHECKOUT_USD;

                                            return (
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <button
                                                        onClick={() =>
                                                            handlePayment(booking)
                                                        }
                                                        disabled={
                                                            payingId ===
                                                                booking._id ||
                                                            isBelowMinimum
                                                        }
                                                        className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {payingId === booking._id
                                                            ? "Redirecting..."
                                                            : "💳 Pay Now"}
                                                    </button>

                                                    {isBelowMinimum && (
                                                        <p className="text-xs text-amber-700 dark:text-amber-400">
                                                            Minimum online payment is{" "}
                                                            {formatUSD(
                                                                MIN_STRIPE_CHECKOUT_USD,
                                                                { decimals: true }
                                                            )}{" "}
                                                            USD. Please ask the
                                                            technician or admin to update
                                                            the final amount.
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                    {booking.paymentStatus === "paid" && (
                                        <span className="rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-bold text-green-700 dark:text-green-400">
                                            ✓ Payment Completed
                                        </span>
                                    )}

                                    {booking.status === "in-progress" && (
                                        <p className="text-sm text-purple-700 dark:text-purple-400">
                                            Your service is currently in progress.
                                        </p>
                                    )}

                                    {booking.status === "rejected" && (
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            This booking request was rejected.
                                        </p>
                                    )}

                                    {booking.status === "cancelled" && (
                                        <p className="text-sm text-zinc-600 dark:text-gray-400">
                                            You cancelled this booking.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <p className="mt-8 text-center text-xs text-zinc-500 dark:text-gray-600">
                    FixMate • Customer Dashboard
                </p>
            </div>

            <ConfirmModal
                open={Boolean(cancelTargetId)}
                title="Cancel Repair Request?"
                description="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmLabel="Yes, Cancel Booking"
                cancelLabel="Keep Booking"
                loading={Boolean(updatingId)}
                onConfirm={confirmCancelBooking}
                onCancel={() => setCancelTargetId(null)}
            />
        </main>
    );
}
