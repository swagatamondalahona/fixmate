
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type Booking = {
    _id: string;
    serviceTitle: string;
    serviceImage?: string;
    customerId: string;
    customerEmail: string;
    technicianId: string;
    bookingDate: string;
    address: string;
    notes?: string;
    basePrice: number;
    finalAmount: number | null;
    status: "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
    paymentStatus: "unpaid" | "paid";
    createdAt: string;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function TechnicianDashboardPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [updatingId, setUpdatingId] = useState("");

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (tokenResponse.error || !token) {
                throw new Error("Please sign in to access Technician Dashboard.");
            }

            const response = await fetch(
                `${API_URL}/api/bookings/technician`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to fetch bookings."
                );
            }

            setBookings(result.data || []);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const updateBookingStatus = async (
        bookingId: string,
        status: "accepted" | "rejected"
    ) => {
        try {
            setUpdatingId(bookingId);
            setError("");
            setMessage("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (tokenResponse.error || !token) {
                throw new Error("Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/api/bookings/${bookingId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Booking status update failed."
                );
            }

            setMessage(
                status === "accepted"
                    ? "Booking accepted successfully!"
                    : "Booking rejected successfully!"
            );

            await fetchBookings();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setUpdatingId("");
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
        switch (status) {
            case "requested":
                return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
            case "accepted":
                return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "in-progress":
                return "bg-purple-500/10 text-purple-400 border-purple-500/20";
            case "completed":
                return "bg-green-500/10 text-green-400 border-green-500/20";
            case "rejected":
            case "cancelled":
                return "bg-red-500/10 text-red-400 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] px-5 py-12 text-white sm:px-8">
            {/* Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.035]"
                style={{
                    backgroundImage:
                        "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                    backgroundSize: "45px 45px",
                }}
            />

            <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[130px]" />

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-10">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                        FixMate Technician Panel
                    </p>

                    <h1 className="text-3xl font-extrabold sm:text-4xl">
                        Technician Dashboard
                    </h1>

                    <p className="mt-3 text-gray-400">
                        Manage your assigned bookings and customer service requests.
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
                            className="rounded-2xl border border-white/10 bg-[#111111]/90 p-6 shadow-xl"
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
                            Assigned Bookings
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Booking requests assigned to your account.
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
                    <div className="rounded-2xl border border-white/10 bg-[#111111]/90 px-6 py-16 text-center">
                        <div className="mb-4 text-5xl">📋</div>

                        <h3 className="text-xl font-bold">
                            No Bookings Found
                        </h3>

                        <p className="mt-2 text-sm text-gray-400">
                            You do not have any assigned customer bookings yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="rounded-2xl border border-white/10 bg-[#111111]/95 p-6 shadow-xl transition hover:border-orange-500/30 sm:p-8"
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
                                            Customer Email
                                        </p>
                                        <p className="mt-2 break-all font-medium">
                                            {booking.customerEmail || "Not available"}
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
                                            ৳{booking.basePrice?.toLocaleString("en-BD")}
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
                                        <p className="mt-2 font-medium capitalize">
                                            {booking.paymentStatus}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Final Amount
                                        </p>
                                        <p className="mt-2 font-medium text-green-400">
                                            {booking.finalAmount !== null
                                                ? `৳${booking.finalAmount.toLocaleString("en-BD")}`
                                                : "Not set"}
                                        </p>
                                    </div>
                                </div>

                                {booking.notes && (
                                    <div className="mt-6 rounded-xl border border-white/5 bg-black/30 p-4">
                                        <p className="text-xs text-gray-500">
                                            Customer Notes
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-gray-300">
                                            {booking.notes}
                                        </p>
                                    </div>
                                )}

                                {/* Actions */}
                                {booking.status === "requested" && (
                                    <div className="mt-7 flex flex-wrap gap-3 border-t border-white/10 pt-6">
                                        <button
                                            onClick={() =>
                                                updateBookingStatus(
                                                    booking._id,
                                                    "accepted"
                                                )
                                            }
                                            disabled={updatingId === booking._id}
                                            className="rounded-lg bg-green-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-green-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {updatingId === booking._id
                                                ? "Updating..."
                                                : "✓ Accept Booking"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateBookingStatus(
                                                    booking._id,
                                                    "rejected"
                                                )
                                            }
                                            disabled={updatingId === booking._id}
                                            className="rounded-lg border border-red-500/40 bg-red-500/10 px-6 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {updatingId === booking._id
                                                ? "Updating..."
                                                : "✕ Reject Booking"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
