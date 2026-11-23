
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
    formatUSD,
    MIN_SERVICE_PRICE_USD,
    MIN_STRIPE_CHECKOUT_USD,
} from "@/lib/currency";

interface Booking {
    _id: string;
    serviceTitle: string;
    serviceImage?: string;
    customerId: string;
    customerEmail?: string;
    technicianId: string;
    technicianEmail?: string;
    bookingDate: string;
    address: string;
    notes?: string;
    basePrice: number;
    finalAmount: number | null;
    status: string;
    paymentStatus: string;
    createdAt?: string;
}

type BookingFilter =
    | "all"
    | "requested"
    | "accepted"
    | "in-progress"
    | "completed"
    | "rejected"
    | "cancelled";

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filter, setFilter] = useState<BookingFilter>("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [updatingId, setUpdatingId] = useState("");
    const [amountInputs, setAmountInputs] = useState<Record<string, string>>({});

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    const getAuthToken = async (): Promise<string> => {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError || !data?.token) {
            throw new Error(
                tokenError?.message ||
                "Authentication required. Please sign in again."
            );
        }

        return data.token;
    };

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            if (!API_URL) {
                throw new Error("Backend API URL is not configured.");
            }

            const token = await getAuthToken();

            const response = await fetch(`${API_URL}/api/admin/bookings`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseText = await response.text();

            let result;

            try {
                result = JSON.parse(responseText);
            } catch {
                throw new Error(
                    `Backend returned an invalid response. HTTP ${response.status}`
                );
            }

            if (!response.ok) {
                throw new Error(result.message || "Failed to load bookings.");
            }

            setBookings(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
            setBookings([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const updateBookingAmount = async (bookingId: string) => {
        try {
            setError("");
            setMessage("");

            const finalAmount = Number(amountInputs[bookingId]);
            if (
                !Number.isFinite(finalAmount) ||
                finalAmount < MIN_SERVICE_PRICE_USD
            ) {
                setError(
                    `Final amount must be at least ${formatUSD(MIN_SERVICE_PRICE_USD, { decimals: true })} USD (Stripe minimum online payment requirement).`
                );
                return;
            }

            if (!API_URL) {
                throw new Error("Backend API URL is not configured.");
            }

            setUpdatingId(bookingId);
            const token = await getAuthToken();

            const response = await fetch(
                `${API_URL}/api/admin/bookings/${bookingId}/final-amount`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ finalAmount }),
                }
            );

            let result: { success?: boolean; message?: string } | null = null;
            try {
                result = await response.json();
            } catch {
                result = null;
            }

            if (!response.ok || !result?.success) {
                throw new Error(
                    result?.message || "Failed to update final amount."
                );
            }

            setBookings((previous) =>
                previous.map((item) =>
                    item._id === bookingId
                        ? { ...item, finalAmount }
                        : item
                )
            );
            setAmountInputs((previous) => {
                const next = { ...previous };
                delete next[bookingId];
                return next;
            });
            setMessage(result.message || "Final amount updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setUpdatingId("");
        }
    };

    const filteredBookings = useMemo(() => {
        if (filter === "all") return bookings;

        return bookings.filter(
            (booking) => booking.status === filter
        );
    }, [bookings, filter]);

    const counts = {
        all: bookings.length,
        requested: bookings.filter((b) => b.status === "requested").length,
        accepted: bookings.filter((b) => b.status === "accepted").length,
        inProgress: bookings.filter((b) => b.status === "in-progress").length,
        completed: bookings.filter((b) => b.status === "completed").length,
        rejected: bookings.filter((b) => b.status === "rejected").length,
        cancelled: bookings.filter((b) => b.status === "cancelled").length,
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-green-500/10 text-green-700 dark:text-green-400";

            case "accepted":
            case "in-progress":
                return "bg-blue-500/10 text-blue-700 dark:text-blue-400";

            case "rejected":
            case "cancelled":
                return "bg-red-500/10 text-red-600 dark:text-red-400";

            case "requested":
                return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";

            default:
                return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400";
        }
    };

    const formatDate = (date: string) => {
        if (!date) return "Not available";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Invalid date";
        }

        return parsedDate.toLocaleString();
    };

    return (
        <main className="min-h-screen bg-zinc-100 px-5 py-12 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                            FixMate Administration
                        </p>

                        <h1 className="text-3xl font-bold sm:text-5xl">
                            Manage{" "}
                            <span className="text-orange-500">Bookings</span>
                        </h1>

                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            View and monitor all customer service bookings.
                        </p>
                    </div>

                    <button
                        onClick={fetchBookings}
                        disabled={loading}
                        className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-black disabled:opacity-50 dark:text-orange-400"
                    >
                        {loading ? "Loading..." : "Refresh Bookings"}
                    </button>
                </div>

                {/* Statistics */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {([
                        ["All Bookings", counts.all, "all"],
                        ["Requested", counts.requested, "requested"],
                        ["Accepted", counts.accepted, "accepted"],
                        ["In Progress", counts.inProgress, "in-progress"],
                        ["Completed", counts.completed, "completed"],
                        ["Rejected", counts.rejected, "rejected"],
                        ["Cancelled", counts.cancelled, "cancelled"],
                    ] as const).map(([label, count, key]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`rounded-2xl border p-5 text-left transition ${filter === key
                                    ? "border-orange-500 bg-orange-500/10"
                                    : "border-zinc-200 bg-white hover:border-orange-500/40 dark:border-white/10 dark:bg-zinc-950"
                                }`}
                        >
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {label}
                            </p>

                            <p className="mt-2 text-3xl font-bold text-orange-500">
                                {count}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Error */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
                    >
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
                    >
                        {message}
                    </div>
                )}

                {/* Booking List */}
                {loading ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
                        Loading bookings...
                    </div>
                ) : error && bookings.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-950">
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Unable to load bookings.
                        </p>

                        <button
                            onClick={fetchBookings}
                            className="mt-4 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-black"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-950">
                        <div className="mb-4 text-5xl">📋</div>

                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                            No Bookings Found
                        </h2>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            There are no bookings in this category.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredBookings.map((booking) => (
                            <article
                                key={booking._id}
                                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-orange-500/40 dark:border-white/10 dark:bg-zinc-950"
                            >
                                <div className="p-5 sm:p-7">

                                    {/* Service and Status */}
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="flex items-center gap-4">
                                            {booking.serviceImage ? (
                                                <img
                                                    src={booking.serviceImage}
                                                    alt={booking.serviceTitle}
                                                    className="h-16 w-16 rounded-xl object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-200 text-3xl dark:bg-zinc-900">
                                                    🔧
                                                </div>
                                            )}

                                            <div>
                                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white sm:text-xl">
                                                    {booking.serviceTitle}
                                                </h2>

                                                <p className="mt-1 break-all text-xs text-zinc-500">
                                                    Booking ID: {booking._id}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(booking.status)}`}
                                            >
                                                {booking.status}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${booking.paymentStatus === "paid"
                                                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                                    }`}
                                            >
                                                {booking.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="mt-6 grid gap-5 border-t border-zinc-200 pt-5 dark:border-white/10 sm:grid-cols-2 lg:grid-cols-3">

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Customer
                                            </p>

                                            <p className="mt-2 break-all text-sm text-zinc-800 dark:text-white">
                                                {booking.customerEmail || booking.customerId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Technician
                                            </p>

                                            <p className="mt-2 break-all text-sm text-zinc-800 dark:text-white">
                                                {booking.technicianEmail || booking.technicianId}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Booking Date
                                            </p>

                                            <p className="mt-2 text-sm text-zinc-800 dark:text-white">
                                                {formatDate(booking.bookingDate)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Service Address
                                            </p>

                                            <p className="mt-2 text-sm text-zinc-800 dark:text-white">
                                                {booking.address}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Base Price
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                                {formatUSD(booking.basePrice)}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Final Amount
                                            </p>

                                            <p className="mt-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                                {booking.finalAmount !== null &&
                                                booking.finalAmount !== undefined
                                                    ? formatUSD(booking.finalAmount)
                                                    : "Not set"}
                                            </p>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="mt-5 border-t border-zinc-200 pt-5 dark:border-white/10">
                                            <p className="text-xs uppercase tracking-wider text-zinc-500">
                                                Problem Description
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
                                                {booking.notes}
                                            </p>
                                        </div>
                                    )}

                                    {booking.status === "completed" &&
                                        booking.paymentStatus !== "paid" && (
                                            <div className="mt-5 border-t border-zinc-200 pt-5 dark:border-white/10">
                                                {(booking.finalAmount ?? 0) <
                                                    MIN_STRIPE_CHECKOUT_USD && (
                                                    <p className="mb-3 text-xs text-amber-700 dark:text-amber-400">
                                                        Final amount (
                                                        {formatUSD(
                                                            booking.finalAmount
                                                        )}
                                                        ) is below Stripe&apos;s
                                                        minimum online payment (
                                                        {formatUSD(
                                                            MIN_SERVICE_PRICE_USD,
                                                            { decimals: true }
                                                        )}{" "}
                                                        USD). Update it below so the
                                                        customer can pay online.
                                                    </p>
                                                )}

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                    <input
                                                        type="number"
                                                        min={
                                                            MIN_SERVICE_PRICE_USD
                                                        }
                                                        step="0.01"
                                                        value={
                                                            amountInputs[
                                                                booking._id
                                                            ] ?? ""
                                                        }
                                                        onChange={(event) =>
                                                            setAmountInputs(
                                                                (previous) => ({
                                                                    ...previous,
                                                                    [booking._id]:
                                                                        event
                                                                            .target
                                                                            .value,
                                                                })
                                                            )
                                                        }
                                                        placeholder={`Update final amount in $ (min ${formatUSD(MIN_SERVICE_PRICE_USD, { decimals: true })})`}
                                                        className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-orange-500 sm:max-w-xs dark:border-white/10 dark:bg-black dark:text-white"
                                                    />

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateBookingAmount(
                                                                booking._id
                                                            )
                                                        }
                                                        disabled={
                                                            updatingId ===
                                                            booking._id
                                                        }
                                                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
                                                    >
                                                        {updatingId ===
                                                        booking._id
                                                            ? "Saving..."
                                                            : "Update Final Amount"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
