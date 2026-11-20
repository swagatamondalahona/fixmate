
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

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

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function CustomerDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [payingId, setPayingId] = useState("");

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                setError("Authentication token not found. Please sign in again.");
                return;
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
                    data.message || "Failed to load your bookings."
                );
            }

            setBookings(data.bookings || data.data || []);
        } catch (err) {
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

    const cancelBooking = async (bookingId: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            setUpdatingId(bookingId);
            setError("");
            setMessage("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
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

            setMessage("Booking cancelled successfully!");
            await fetchBookings();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to cancel booking."
            );
        } finally {
            setUpdatingId("");
        }
    };

    // Stripe Checkout Payment
    const handlePayment = async (bookingId: string) => {
        try {
            setPayingId(bookingId);
            setError("");
            setMessage("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(
                `${API_URL}/api/payments/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ bookingId }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to start payment."
                );
            }

            const checkoutUrl = data.data?.checkoutUrl;

            if (!checkoutUrl) {
                throw new Error("Payment checkout URL was not returned.");
            }

            window.location.href = checkoutUrl;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Payment could not be started."
            );
            setPayingId("");
        }
    };

    const requestedCount = bookings.filter(
        (booking) => booking.status === "requested"
    ).length;

    const acceptedCount = bookings.filter(
        (booking) => booking.status === "accepted"
    ).length;

    const completedCount = bookings.filter(
        (booking) => booking.status === "completed"
    ).length;

    const getStatusStyle = (status: Booking["status"]) => {
        const styles: Record<Booking["status"], string> = {
            requested:
                "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
            accepted:
                "border-blue-500/30 bg-blue-500/10 text-blue-400",
            rejected:
                "border-red-500/30 bg-red-500/10 text-red-400",
            "in-progress":
                "border-purple-500/30 bg-purple-500/10 text-purple-400",
            completed:
                "border-green-500/30 bg-green-500/10 text-green-400",
            cancelled:
                "border-gray-500/30 bg-gray-500/10 text-gray-400",
        };

        return styles[status];
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] px-4 py-12 text-white sm:px-6 lg:px-8">
            {/* Repair Tools Watermark */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden"
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
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                        FixMate Customer Panel
                    </p>

                    <h1 className="text-3xl font-extrabold sm:text-4xl">
                        My Dashboard
                    </h1>

                    <p className="mt-3 text-gray-400">
                        Track your service bookings, manage requests and
                        complete payments.
                    </p>
                </div>

                {/* Statistics */}
                <div className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        {
                            title: "Total Bookings",
                            value: bookings.length,
                            color: "text-orange-400",
                        },
                        {
                            title: "Pending Requests",
                            value: requestedCount,
                            color: "text-yellow-400",
                        },
                        {
                            title: "Accepted Bookings",
                            value: acceptedCount,
                            color: "text-blue-400",
                        },
                        {
                            title: "Completed Bookings",
                            value: completedCount,
                            color: "text-green-400",
                        },
                    ].map((item) => (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-white/10 bg-[#111111]/95 p-6 shadow-xl backdrop-blur-sm"
                        >
                            <p className="text-sm text-gray-400">
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

                {/* Booking Section */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">
                            My Bookings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            View and manage all your service requests.
                        </p>
                    </div>

                    <button
                        onClick={fetchBookings}
                        disabled={loading}
                        className="rounded-lg border border-orange-500/40 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 disabled:opacity-50"
                    >
                        {loading ? "Refreshing..." : "↻ Refresh"}
                    </button>
                </div>

                {/* Messages */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
                    >
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400"
                    >
                        {message}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="rounded-2xl border border-white/10 bg-[#111111] p-12 text-center text-orange-400">
                        Loading Your Bookings...
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-[#111111]/95 px-6 py-16 text-center">
                        <div className="mb-4 text-5xl">📋</div>

                        <h3 className="text-xl font-bold">
                            No Bookings Found
                        </h3>

                        <p className="mt-2 text-sm text-gray-400">
                            You have not booked any services yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="rounded-2xl border border-white/10 bg-[#111111]/95 p-6 shadow-xl backdrop-blur-sm transition hover:border-orange-500/30 sm:p-8"
                            >
                                {/* Card Header */}
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                                            Service Booking
                                        </p>

                                        <h3 className="mt-2 text-xl font-bold sm:text-2xl">
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
                                <div className="mt-7 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Technician Email
                                        </p>

                                        <p className="mt-2 break-all font-medium">
                                            {booking.technicianEmail ||
                                                "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Booking Date
                                        </p>

                                        <p className="mt-2 font-medium">
                                            {new Date(
                                                booking.bookingDate
                                            ).toLocaleString("en-BD")}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Base Price
                                        </p>

                                        <p className="mt-2 font-bold text-orange-400">
                                            ৳
                                            {booking.basePrice?.toLocaleString(
                                                "en-BD"
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Service Address
                                        </p>

                                        <p className="mt-2 font-medium">
                                            {booking.address}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Payment Status
                                        </p>

                                        <p
                                            className={`mt-2 font-semibold capitalize ${booking.paymentStatus === "paid"
                                                    ? "text-green-400"
                                                    : "text-yellow-400"
                                                }`}
                                        >
                                            {booking.paymentStatus}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Final Amount
                                        </p>

                                        <p className="mt-2 font-medium text-green-400">
                                            {booking.finalAmount !== null
                                                ? `৳${booking.finalAmount.toLocaleString(
                                                    "en-BD"
                                                )}`
                                                : "Not set"}
                                        </p>
                                    </div>
                                </div>

                                {booking.notes && (
                                    <div className="mt-6 rounded-xl border border-white/5 bg-black/30 p-4">
                                        <p className="text-xs text-gray-500">
                                            Your Notes
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-gray-300">
                                            {booking.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Booking Actions */}
                                <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                                    {booking.status === "requested" && (
                                        <button
                                            onClick={() =>
                                                cancelBooking(booking._id)
                                            }
                                            disabled={
                                                updatingId === booking._id
                                            }
                                            className="rounded-lg border border-red-500/40 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {updatingId === booking._id
                                                ? "Cancelling..."
                                                : "✕ Cancel Booking"}
                                        </button>
                                    )}

                                    {booking.status === "completed" &&
                                        booking.paymentStatus === "unpaid" && (
                                            <button
                                                onClick={() =>
                                                    handlePayment(booking._id)
                                                }
                                                disabled={
                                                    payingId === booking._id
                                                }
                                                className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {payingId === booking._id
                                                    ? "Redirecting..."
                                                    : "💳 Pay Now"}
                                            </button>
                                        )}

                                    {booking.paymentStatus === "paid" && (
                                        <span className="rounded-lg border border-green-500/30 bg-green-500/10 px-6 py-3 text-sm font-bold text-green-400">
                                            ✓ Payment Completed
                                        </span>
                                    )}

                                    {booking.status === "in-progress" && (
                                        <p className="text-sm text-purple-400">
                                            Your service is currently in progress.
                                        </p>
                                    )}

                                    {booking.status === "rejected" && (
                                        <p className="text-sm text-red-400">
                                            This booking request was rejected.
                                        </p>
                                    )}

                                    {booking.status === "cancelled" && (
                                        <p className="text-sm text-gray-400">
                                            You cancelled this booking.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
