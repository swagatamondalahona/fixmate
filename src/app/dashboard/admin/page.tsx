
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface Service {
    _id: string;
    title: string;
    description: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    image?: string;
    technicianEmail?: string;
    createdAt?: string;
}

export default function AdminDashboard() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [apiStatus, setApiStatus] = useState("Checking...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    // Get Better Auth JWT Token
    const getAuthToken = async (): Promise<string> => {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError) {
            throw new Error(
                tokenError.message || "Unable to get authentication token."
            );
        }

        if (!data?.token) {
            throw new Error("Authentication required. Please sign in again.");
        }

        return data.token;
    };

    // Fetch Pending Services
    const fetchPendingServices = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            if (!API_URL) {
                throw new Error("Backend API URL is not configured.");
            }

            const token = await getAuthToken();

            const response = await fetch(
                `${API_URL}/api/admin/services/pending`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to load pending services."
                );
            }

            setServices(Array.isArray(result.data) ? result.data : []);
            setApiStatus("Connected");
        } catch (err) {
            setApiStatus("Connection Failed");
            setServices([]);

            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchPendingServices();
    }, [fetchPendingServices]);

    // Approve or Reject Service
    const updateService = async (
        serviceId: string,
        action: "approve" | "reject"
    ) => {
        try {
            setProcessingId(serviceId);
            setError("");
            setMessage("");

            if (!API_URL) {
                throw new Error("Backend API URL is not configured.");
            }

            const token = await getAuthToken();

            const response = await fetch(
                `${API_URL}/api/admin/services/${serviceId}/${action}`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Service update failed."
                );
            }

            setServices((previous) =>
                previous.filter((service) => service._id !== serviceId)
            );

            setMessage(
                result.message ||
                `Service ${action === "approve" ? "approved" : "rejected"} successfully.`
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setProcessingId("");
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-zinc-100 px-5 py-16 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white sm:px-8 lg:px-12">
            {/* Background */}
            <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-600/10 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 top-80 h-96 w-96 rounded-full bg-blue-700/10 blur-[120px]" />

            <div className="relative mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                            FixMate Administration
                        </p>

                        <h1 className="text-3xl font-bold sm:text-5xl">
                            Admin{" "}
                            <span className="text-orange-500">
                                Dashboard
                            </span>
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                            Manage repair services, review technician
                            submissions and control service approvals.
                        </p>
                    </div>

                    <button
                        onClick={fetchPendingServices}
                        disabled={loading}
                        className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-black disabled:cursor-not-allowed disabled:opacity-50 dark:text-orange-400"
                    >
                        {loading ? "Loading..." : "Refresh Services"}
                    </button>
                </div>

                {/* Statistics */}
                <div className="mb-10 grid gap-5 sm:grid-cols-2">
                    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-7 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950/80">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Pending Services
                        </p>

                        <h2 className="mt-3 text-4xl font-bold text-orange-500">
                            {services.length}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white/90 p-7 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950/80">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Dashboard Status
                        </p>

                        <h2
                            className={`mt-3 text-2xl font-bold ${apiStatus === "Connected"
                                    ? "text-green-600 dark:text-green-500"
                                    : apiStatus === "Checking..."
                                        ? "text-yellow-600 dark:text-yellow-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                        >
                            {apiStatus}
                        </h2>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/30 bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    >
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {message && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-green-500/30 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    >
                        {message}
                    </div>
                )}

                {/* Pending Services Heading */}
                <div className="mb-7">
                    <h2 className="text-2xl font-bold">
                        Pending{" "}
                        <span className="text-orange-500">
                            Services
                        </span>
                    </h2>

                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                        Review and approve services submitted by technicians.
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center shadow-xl dark:border-white/10 dark:bg-zinc-950">
                        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />

                        <p className="text-zinc-600 dark:text-zinc-400">
                            Loading pending services...
                        </p>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-950">
                        <h3 className="text-xl font-semibold">
                            Unable to Load Services
                        </h3>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            Please check your connection and try again.
                        </p>

                        <button
                            onClick={fetchPendingServices}
                            className="mt-5 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-black transition hover:bg-orange-400"
                        >
                            Try Again
                        </button>
                    </div>
                ) : services.length === 0 ? (
                    /* Empty State */
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-950">
                        <div className="mb-4 text-5xl">🛠️</div>

                        <h3 className="text-xl font-semibold">
                            No Pending Services
                        </h3>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            All submitted services have been reviewed.
                        </p>
                    </div>
                ) : (
                    /* Service Cards */
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl transition-colors duration-300 hover:border-orange-500/40 dark:border-white/10 dark:bg-zinc-950"
                            >
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-40 items-center justify-center bg-gradient-to-br from-zinc-200 to-orange-100 text-5xl dark:from-zinc-900 dark:to-orange-950/40">
                                        🔧
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                                            {service.category}
                                        </span>

                                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-700 dark:text-yellow-400">
                                            Pending
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold">
                                        {service.title}
                                    </h3>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                        {service.description}
                                    </p>

                                    <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400">
                                        <p>
                                            <span className="font-semibold text-zinc-900 dark:text-white">
                                                Price:
                                            </span>{" "}
                                            {service.basePrice}
                                        </p>

                                        <p>
                                            <span className="font-semibold text-zinc-900 dark:text-white">
                                                Mode:
                                            </span>{" "}
                                            {service.serviceMode}
                                        </p>

                                        {service.technicianEmail && (
                                            <p className="break-all">
                                                <span className="font-semibold text-zinc-900 dark:text-white">
                                                    Technician:
                                                </span>{" "}
                                                {service.technicianEmail}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() =>
                                                updateService(
                                                    service._id,
                                                    "approve"
                                                )
                                            }
                                            disabled={processingId !== ""}
                                            className="rounded-xl bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {processingId === service._id
                                                ? "Processing..."
                                                : "Approve"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                updateService(
                                                    service._id,
                                                    "reject"
                                                )
                                            }
                                            disabled={processingId !== ""}
                                            className="rounded-xl bg-red-600/15 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
                                        >
                                            {processingId === service._id
                                                ? "Processing..."
                                                : "Reject"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
