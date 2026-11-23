
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

type BookingStatus =
    | "requested"
    | "accepted"
    | "rejected"
    | "in-progress"
    | "completed"
    | "cancelled";

type Booking = {
    _id: string;
    serviceTitle: string;
    serviceImage?: string;
    technicianName?: string;
    technicianEmail?: string;
    bookingDate: string;
    preferredDate?: string;
    address: string;
    notes?: string;
    problemDescription?: string;
    basePrice: number;
    finalAmount: number | null;
    status: BookingStatus;
    paymentStatus: "unpaid" | "paid";
    createdAt: string;
};

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

export default function CustomerBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState("");
    const [payingId, setPayingId] = useState("");
    const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

    const showToast = (type: "success" | "error", message: string) => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    };

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/api/bookings/my-bookings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load bookings."
                );
            }

            setBookings(data.bookings || data.data || []);
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Unable to load bookings."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const confirmCancelBooking = async () => {
        if (!cancelTargetId) return;

        const bookingId = cancelTargetId;

        try {
            setUpdatingId(bookingId);

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/api/bookings/${bookingId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to cancel booking."
                );
            }

            setCancelTargetId(null);
            showToast("success", "Booking cancelled successfully!");

            await fetchBookings();
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? error.message
                    : "Unable to cancel booking."
            );
        } finally {
            setUpdatingId("");
        }
    };

    const handlePayment = async (booking: Booking) => {
        const payableAmount = Number(
            booking.finalAmount ?? booking.basePrice ?? 0
        );

        if (
            !Number.isFinite(payableAmount) ||
            payableAmount < MIN_STRIPE_CHECKOUT_USD
        ) {
            showToast(
                "error",
                `Minimum online payment is ${formatUSD(MIN_STRIPE_CHECKOUT_USD, { decimals: true })} USD. Current amount (${formatUSD(payableAmount)}) is too low — please contact the technician or admin to update the final amount.`
            );
            return;
        }

        try {
            setPayingId(booking._id);

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (tokenResponse.error || !token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/api/payments/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookingId: booking._id }),
                }
            );

            let data: {
                success?: boolean;
                message?: string;
                data?: { checkoutUrl?: string };
            } | null = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok || !data?.success) {
                throw new Error(
                    formatStripePaymentError(
                        data?.message || "Unable to start payment."
                    )
                );
            }

            const checkoutUrl = data.data?.checkoutUrl;

            if (
                typeof checkoutUrl !== "string" ||
                !checkoutUrl.startsWith("https://")
            ) {
                throw new Error(
                    "A valid checkout URL was not returned."
                );
            }

            window.location.href = checkoutUrl;
        } catch (error) {
            showToast(
                "error",
                error instanceof Error
                    ? formatStripePaymentError(error.message)
                    : "Payment could not be started."
            );
        } finally {
            setPayingId("");
        }
    };

    const getStatusStyle = (status: BookingStatus) =>
        getBookingStatusStyle(status);

    const requestedCount = bookings.filter(
        (booking) => booking.status === "requested"
    ).length;

    const activeCount = bookings.filter(
        (booking) =>
            booking.status === "accepted" ||
            booking.status === "in-progress"
    ).length;

    const completedCount = bookings.filter(
        (booking) => booking.status === "completed"
    ).length;

    const paidCount = bookings.filter(
        (booking) => booking.paymentStatus === "paid"
    ).length;

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-100 px-4 py-10 text-zinc-900 transition-colors duration-300 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">
            {/* Watermark */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden"
            >
                <div className="absolute -left-16 top-32 rotate-[-35deg] text-[180px] font-black text-orange-500/[0.04]">
                    ⚒
                </div>

                <div className="absolute right-[-30px] top-[35%] rotate-45 text-[190px] font-black text-orange-500/[0.035]">
                    🔧
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-9">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                        FixMate Customer Workspace
                    </p>

                    <h1 className="text-3xl font-extrabold sm:text-4xl">
                        My Bookings
                    </h1>

                    <p className="mt-3 text-zinc-600 dark:text-gray-400">
                        Track your repair requests, service progress and payments.
                    </p>
                </div>

                {/* Statistics */}
                <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Total Bookings",
                            value: bookings.length,
                            color: "text-orange-500",
                        },
                        {
                            title: "Pending Requests",
                            value: requestedCount,
                            color: "text-yellow-600 dark:text-yellow-400",
                        },
                        {
                            title: "Active Services",
                            value: activeCount,
                            color: "text-purple-600 dark:text-purple-400",
                        },
                        {
                            title: "Completed Bookings",
                            value: completedCount,
                            color: "text-green-600 dark:text-green-400",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]/95"
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

                {/* Payment Summary */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]">
                    <div>
                        <p className="text-sm text-zinc-600 dark:text-gray-400">
                            Successful Payments
                        </p>

                        <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
                            {paidCount}
                        </p>
                    </div>

                    <button
                        onClick={fetchBookings}
                        disabled={loading}
                        className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-600 transition hover:bg-orange-500/20 disabled:opacity-50 dark:text-orange-400"
                    >
                        {loading ? "Refreshing..." : "↻ Refresh Bookings"}
                    </button>
                </div>

                {/* Booking List */}
                {loading ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-14 text-center transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]">
                        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />
                        <p className="text-orange-600 dark:text-orange-400">
                            Loading your bookings...
                        </p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white/95 px-6 py-16 text-center transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]/95">
                        <div className="mb-4 text-5xl">📋</div>

                        <h2 className="text-xl font-bold">
                            No Bookings Found
                        </h2>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-gray-400">
                            You have not booked any services yet.
                        </p>

                        <Link
                            href="/services"
                            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                        >
                            Browse Services
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <article
                                key={booking._id}
                                className="rounded-2xl border border-zinc-200 bg-white/95 p-6 shadow-xl transition-colors duration-300 hover:border-orange-500/40 dark:border-white/10 dark:bg-[#111111]/95 dark:hover:border-orange-500/30 sm:p-8"
                            >
                                {/* Booking Header */}
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-white/10 dark:bg-black/40">
                                            {booking.serviceImage ? (
                                                <img
                                                    src={booking.serviceImage}
                                                    alt={booking.serviceTitle}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-2xl">
                                                    🔧
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                                                Service Booking
                                            </p>

                                            <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                                                {booking.serviceTitle}
                                            </h2>

                                            <p className="mt-1 break-all text-xs text-zinc-500 dark:text-gray-500">
                                                Booking ID: {booking._id}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`rounded-full border px-4 py-2 text-xs font-bold uppercase ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status.replace("-", " ")}
                                    </span>
                                </div>

                                {/* Booking Details */}
                                <div className="mt-7 grid gap-5 border-t border-zinc-200 pt-6 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Technician
                                        </p>

                                        <p className="mt-2 font-medium">
                                            {booking.technicianName ||
                                                booking.technicianEmail ||
                                                "Verified Technician"}
                                        </p>
                                        {booking.technicianName &&
                                            booking.technicianEmail && (
                                                <p className="mt-0.5 break-all text-xs text-zinc-500 dark:text-gray-500">
                                                    {booking.technicianEmail}
                                                </p>
                                            )}
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Preferred Date
                                        </p>

                                        <p className="mt-2 font-medium">
                                            {new Date(
                                                booking.preferredDate ||
                                                    booking.bookingDate
                                            ).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Service Address
                                        </p>

                                        <p className="mt-2 font-medium">
                                            {booking.address}
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
                                            Final Amount
                                        </p>

                                        <p className="mt-2 font-bold text-green-600 dark:text-green-400">
                                            {booking.finalAmount !== null &&
                                            booking.finalAmount !== undefined
                                                ? formatUSD(booking.finalAmount)
                                                : "Not set"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Payment Status
                                        </p>

                                        <p
                                            className={`mt-2 font-semibold capitalize ${booking.paymentStatus === "paid"
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-yellow-600 dark:text-yellow-400"
                                                }`}
                                        >
                                            {booking.paymentStatus}
                                        </p>
                                    </div>
                                </div>

                                {/* Customer Notes */}
                                {booking.notes && (
                                    <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-100 p-4 dark:border-white/5 dark:bg-black/30">
                                        <p className="text-xs text-zinc-500 dark:text-gray-500">
                                            Problem Description
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-gray-300">
                                            {booking.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="mt-7 flex flex-wrap gap-3 border-t border-zinc-200 pt-6 dark:border-white/10">
                                    {booking.status === "requested" && (
                                        <button
                                            onClick={() =>
                                                setCancelTargetId(booking._id)
                                            }
                                            disabled={updatingId === booking._id}
                                            className="rounded-lg border border-red-500/40 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-600 transition hover:bg-red-500/20 disabled:opacity-50 dark:text-red-400"
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
                                                        className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {payingId === booking._id
                                                            ? "Redirecting..."
                                                            : "Pay Now"}
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
                                        <span className="rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                                            ✓ Payment Completed
                                        </span>
                                    )}

                                    {booking.status === "in-progress" && (
                                        <p className="text-sm text-purple-600 dark:text-purple-400">
                                            Your service is currently in progress.
                                        </p>
                                    )}

                                    {booking.status === "rejected" && (
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            This booking request was rejected.
                                        </p>
                                    )}

                                    {booking.status === "cancelled" && (
                                        <p className="text-sm text-zinc-600 dark:text-gray-400">
                                            You cancelled this booking.
                                        </p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
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
