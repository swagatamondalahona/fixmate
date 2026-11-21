
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    customerId: string;
    customerEmail: string;
    customerName?: string;
    technicianId: string;
    bookingDate: string;
    address: string;
    notes?: string;
    basePrice: number;
    finalAmount: number | null;
    status: BookingStatus;
    paymentStatus: "unpaid" | "paid";
    createdAt: string;
};

export default function TechnicianRequestsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [finalAmounts, setFinalAmounts] = useState<
        Record<string, string>
    >({});

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            if (!API_URL) {
                throw new Error("API URL is missing.");
            }

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please sign in again."
                );
            }

            const response = await fetch(
                `${API_URL}/api/bookings/technician`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to fetch service requests."
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
        fetchRequests();
    }, [fetchRequests]);

    const updateBookingStatus = async (
        bookingId: string,
        status: BookingStatus
    ) => {
        try {
            if (!API_URL) {
                throw new Error("API URL is missing.");
            }

            let finalAmount: number | undefined;

            if (status === "completed") {
                finalAmount = Number(finalAmounts[bookingId]);

                if (
                    !Number.isFinite(finalAmount) ||
                    finalAmount <= 0
                ) {
                    alert("Please enter a valid final amount greater than zero.");
                    return;
                }
            }

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            setUpdatingId(bookingId);

            const response = await fetch(
                `${API_URL}/api/bookings/${bookingId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        status,
                        ...(finalAmount !== undefined && {
                            finalAmount,
                        }),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to update booking status."
                );
            }

            alert(result.message || "Booking status updated successfully.");

            await fetchRequests();
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setUpdatingId("");
        }
    };

    const getStatusStyle = (status: BookingStatus) => {
        switch (status) {
            case "accepted":
                return "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-400";

            case "in-progress":
                return "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400";

            case "completed":
                return "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-400";

            case "rejected":
            case "cancelled":
                return "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400";

            default:
                return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
        }
    };

    const stats = [
        {
            label: "Total Requests",
            value: bookings.length,
            icon: "▤",
        },
        {
            label: "Pending",
            value: bookings.filter(
                (booking) => booking.status === "requested"
            ).length,
            icon: "◷",
        },
        {
            label: "In Progress",
            value: bookings.filter(
                (booking) => booking.status === "in-progress"
            ).length,
            icon: "⚒",
        },
        {
            label: "Completed",
            value: bookings.filter(
                (booking) => booking.status === "completed"
            ).length,
            icon: "✓",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-100 px-4 py-8 text-zinc-900 transition-colors duration-300 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">

            {/* Background Glow */}
            <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />

            {/* Watermark */}
            <div className="pointer-events-none fixed inset-0 z-0 select-none overflow-hidden">
                <span className="absolute -left-5 top-32 rotate-[-35deg] text-[180px] text-orange-500/[0.045]">
                    ⚒
                </span>

                <span className="absolute -right-8 top-[35%] rotate-[45deg] text-[200px] text-orange-500/[0.04]">
                    🔧
                </span>

                <span className="absolute bottom-10 left-[30%] rotate-[-25deg] text-[160px] text-orange-500/[0.035]">
                    ⚙
                </span>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                                Technician Workspace
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Service <span className="text-orange-500">Requests</span>
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-gray-400 sm:text-base">
                            Manage customer booking requests and update your service progress.
                        </p>
                    </div>

                    <button
                        onClick={fetchRequests}
                        disabled={loading}
                        className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-600 transition hover:bg-orange-500/20 disabled:opacity-50 dark:text-orange-400"
                    >
                        ↻ Refresh Requests
                    </button>
                </div>

                {/* Summary */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {stats.map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-black/5 transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]/95 dark:shadow-black/20"
                        >
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-xl text-orange-600 dark:text-orange-500">
                                {item.icon}
                            </div>

                            <p className="text-sm text-zinc-600 dark:text-gray-400">
                                {item.label}
                            </p>

                            <p className="mt-1 text-2xl font-bold">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-white/10 dark:bg-[#111111]/95">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-zinc-300 border-t-orange-500 dark:border-white/20 dark:border-t-orange-500" />

                        <p className="mt-4 text-sm text-zinc-600 dark:text-gray-400">
                            Loading service requests...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>

                        <button
                            onClick={fetchRequests}
                            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && bookings.length === 0 && (
                    <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center dark:border-white/10 dark:bg-[#111111]/95">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl text-orange-600 dark:text-orange-500">
                            ▤
                        </div>

                        <h2 className="mt-5 text-xl font-bold">
                            No Service Requests
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600 dark:text-gray-400">
                            You do not have any customer booking requests yet.
                        </p>
                    </div>
                )}

                {/* Booking Cards */}
                {!loading && !error && bookings.length > 0 && (
                    <div className="grid gap-6 lg:grid-cols-2">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-black/5 transition hover:border-orange-500/30 dark:border-white/10 dark:bg-[#111111]/95 dark:shadow-black/20"
                            >
                                {/* Card Header */}
                                <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-zinc-500 dark:text-gray-500">
                                            Booking ID
                                        </p>

                                        <p className="mt-1 break-all text-sm font-medium text-zinc-700 dark:text-gray-300">
                                            {booking._id}
                                        </p>
                                    </div>

                                    <span
                                        className={`w-fit rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status.replace("-", " ")}
                                    </span>
                                </div>

                                <div className="p-5">

                                    {/* Service */}
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100 dark:bg-[#080808]">
                                            {booking.serviceImage ? (
                                                <img
                                                    src={booking.serviceImage}
                                                    alt={booking.serviceTitle}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-3xl text-orange-500">
                                                    ⚒
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs text-zinc-500 dark:text-gray-500">
                                                Requested Service
                                            </p>

                                            <h2 className="mt-1 text-lg font-bold">
                                                {booking.serviceTitle}
                                            </h2>

                                            <p className="mt-2 text-sm text-orange-600 dark:text-orange-400">
                                                Base Price: ${booking.basePrice}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-[#080808]/70">
                                        <h3 className="mb-3 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                            Customer Information
                                        </h3>

                                        <div className="space-y-3 text-sm">
                                            <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                                <span className="text-zinc-500 dark:text-gray-500">
                                                    Customer Name
                                                </span>

                                                <span className="text-zinc-800 dark:text-gray-200">
                                                    {booking.customerName || "Not provided"}
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                                <span className="text-zinc-500 dark:text-gray-500">
                                                    Customer Email
                                                </span>

                                                <span className="break-all text-zinc-800 dark:text-gray-200">
                                                    {booking.customerEmail || "Not available"}
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                                <span className="text-zinc-500 dark:text-gray-500">
                                                    Booking Date
                                                </span>

                                                <span className="text-zinc-800 dark:text-gray-200">
                                                    {booking.bookingDate
                                                        ? new Date(booking.bookingDate).toLocaleDateString()
                                                        : "Not available"}
                                                </span>
                                            </div>

                                            <div className="flex flex-col justify-between gap-1 sm:flex-row">
                                                <span className="text-zinc-500 dark:text-gray-500">
                                                    Address
                                                </span>

                                                <span className="text-right text-zinc-800 dark:text-gray-200">
                                                    {booking.address || "Not provided"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Problem Description */}
                                    <div className="mt-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-gray-500">
                                            Customer Problem Description
                                        </p>

                                        <p className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm leading-6 text-zinc-700 dark:border-white/10 dark:bg-[#080808]/70 dark:text-gray-300">
                                            {booking.notes || "No additional description provided."}
                                        </p>
                                    </div>

                                    {/* Payment Information */}
                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 pt-4 dark:border-white/10">
                                        <div>
                                            <p className="text-xs text-zinc-500 dark:text-gray-500">
                                                Payment Status
                                            </p>

                                            <p className={`mt-1 text-sm font-semibold capitalize ${booking.paymentStatus === "paid"
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-yellow-600 dark:text-yellow-400"
                                                }`}>
                                                {booking.paymentStatus}
                                            </p>
                                        </div>

                                        {booking.finalAmount !== null && (
                                            <div className="text-right">
                                                <p className="text-xs text-zinc-500 dark:text-gray-500">
                                                    Final Amount
                                                </p>

                                                <p className="mt-1 font-bold text-orange-600 dark:text-orange-400">
                                                    ${booking.finalAmount}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Actions */}
                                    <div className="mt-5 border-t border-zinc-200 pt-5 dark:border-white/10">
                                        {booking.status === "requested" && (
                                            <div className="flex flex-col gap-3 sm:flex-row">
                                                <button
                                                    onClick={() =>
                                                        updateBookingStatus(
                                                            booking._id,
                                                            "accepted"
                                                        )
                                                    }
                                                    disabled={updatingId === booking._id}
                                                    className="flex-1 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                                                >
                                                    {updatingId === booking._id
                                                        ? "Updating..."
                                                        : "✓ Accept Request"}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        if (
                                                            window.confirm(
                                                                "Are you sure you want to reject this booking?"
                                                            )
                                                        ) {
                                                            updateBookingStatus(
                                                                booking._id,
                                                                "rejected"
                                                            );
                                                        }
                                                    }}
                                                    disabled={updatingId === booking._id}
                                                    className="flex-1 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/20 disabled:opacity-50 dark:text-red-400"
                                                >
                                                    ✕ Reject Request
                                                </button>
                                            </div>
                                        )}

                                        {booking.status === "accepted" && (
                                            <button
                                                onClick={() =>
                                                    updateBookingStatus(
                                                        booking._id,
                                                        "in-progress"
                                                    )
                                                }
                                                disabled={updatingId === booking._id}
                                                className="w-full rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                                            >
                                                {updatingId === booking._id
                                                    ? "Updating..."
                                                    : "⚒ Start Work"}
                                            </button>
                                        )}

                                        {booking.status === "in-progress" && (
                                            <div className="space-y-3">
                                                <label
                                                    htmlFor={`amount-${booking._id}`}
                                                    className="block text-sm font-medium text-zinc-700 dark:text-gray-300"
                                                >
                                                    Final Amount ($)
                                                </label>

                                                <input
                                                    id={`amount-${booking._id}`}
                                                    type="number"
                                                    min="1"
                                                    step="0.01"
                                                    value={finalAmounts[booking._id] || ""}
                                                    onChange={(event) =>
                                                        setFinalAmounts((previous) => ({
                                                            ...previous,
                                                            [booking._id]: event.target.value,
                                                        }))
                                                    }
                                                    placeholder="Enter final service amount"
                                                    className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-500 dark:border-white/10 dark:bg-[#080808] dark:text-white dark:placeholder:text-gray-600"
                                                />

                                                <button
                                                    onClick={() =>
                                                        updateBookingStatus(
                                                            booking._id,
                                                            "completed"
                                                        )
                                                    }
                                                    disabled={updatingId === booking._id}
                                                    className="w-full rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                                                >
                                                    {updatingId === booking._id
                                                        ? "Updating..."
                                                        : "✓ Mark as Completed"}
                                                </button>
                                            </div>
                                        )}

                                        {booking.status === "completed" && (
                                            <p className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-center text-sm font-semibold text-green-700 dark:text-green-400">
                                                ✓ Service Completed
                                            </p>
                                        )}

                                        {booking.status === "rejected" && (
                                            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-600 dark:text-red-400">
                                                This booking request was rejected.
                                            </p>
                                        )}

                                        {booking.status === "cancelled" && (
                                            <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-600 dark:text-red-400">
                                                This booking was cancelled by the customer.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
