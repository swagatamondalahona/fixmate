
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
    approvalStatus: "pending" | "approved" | "rejected";
    isAvailable: boolean;
    createdAt?: string;
}

type FilterStatus = "all" | "pending" | "approved" | "rejected";

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [filter, setFilter] = useState<FilterStatus>("all");
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

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

    const fetchServices = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            if (!API_URL) {
                throw new Error("Backend API URL is not configured.");
            }

            const token = await getAuthToken();

            const response = await fetch(`${API_URL}/api/admin/services`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to load services.");
            }

            setServices(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
            setServices([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchServices();
    }, [fetchServices]);

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
                throw new Error(result.message || "Service update failed.");
            }

            setServices((previous) =>
                previous.map((service) =>
                    service._id === serviceId
                        ? {
                            ...service,
                            approvalStatus:
                                action === "approve" ? "approved" : "rejected",
                        }
                        : service
                )
            );

            setMessage(result.message || `Service ${action}d successfully.`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setProcessingId("");
        }
    };

    const filteredServices = useMemo(() => {
        if (filter === "all") return services;

        return services.filter(
            (service) => service.approvalStatus === filter
        );
    }, [services, filter]);

    const counts = {
        all: services.length,
        pending: services.filter(
            (service) => service.approvalStatus === "pending"
        ).length,
        approved: services.filter(
            (service) => service.approvalStatus === "approved"
        ).length,
        rejected: services.filter(
            (service) => service.approvalStatus === "rejected"
        ).length,
    };

    return (
        <main className="min-h-screen bg-zinc-100 px-5 py-12 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                            FixMate Administration
                        </p>

                        <h1 className="text-3xl font-bold sm:text-5xl">
                            Manage{" "}
                            <span className="text-orange-500">Services</span>
                        </h1>

                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            Review and manage all technician services.
                        </p>
                    </div>

                    <button
                        onClick={fetchServices}
                        disabled={loading}
                        className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-black disabled:opacity-50 dark:text-orange-400"
                    >
                        {loading ? "Loading..." : "Refresh Services"}
                    </button>
                </div>

                {/* Statistics Filters */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {([
                        ["All Services", counts.all, "all"],
                        ["Pending", counts.pending, "pending"],
                        ["Approved", counts.approved, "approved"],
                        ["Rejected", counts.rejected, "rejected"],
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

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400"
                    >
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {message && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
                    >
                        {message}
                    </div>
                )}

                {/* Services Content */}
                {loading ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center text-zinc-600 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-400">
                        Loading services...
                    </div>
                ) : error && services.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-950">
                        <p className="text-zinc-600 dark:text-zinc-400">
                            Unable to load services.
                        </p>

                        <button
                            onClick={fetchServices}
                            className="mt-4 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-black"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-white/10 dark:bg-zinc-950">
                        <div className="mb-4 text-5xl">🛠️</div>

                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                            No Services Found
                        </h2>

                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                            There are no services in this category.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {filteredServices.map((service) => (
                            <article
                                key={service._id}
                                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-orange-500/40 dark:border-white/10 dark:bg-zinc-950"
                            >
                                {service.image ? (
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="h-48 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-48 items-center justify-center bg-zinc-200 text-5xl dark:bg-zinc-900">
                                        🔧
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
                                            {service.category}
                                        </span>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${service.approvalStatus ===
                                                    "approved"
                                                    ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                                    : service.approvalStatus ===
                                                        "rejected"
                                                        ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                                        : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                                                }`}
                                        >
                                            {service.approvalStatus}
                                        </span>
                                    </div>

                                    <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                                        {service.title}
                                    </h2>

                                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                        {service.description}
                                    </p>

                                    <div className="mt-5 space-y-2 border-t border-zinc-200 pt-4 text-sm text-zinc-600 dark:border-white/10 dark:text-zinc-400">
                                        <p>
                                            <span className="text-zinc-900 dark:text-white">
                                                Price:
                                            </span>{" "}
                                            {service.basePrice}
                                        </p>

                                        <p>
                                            <span className="text-zinc-900 dark:text-white">
                                                Mode:
                                            </span>{" "}
                                            {service.serviceMode}
                                        </p>

                                        <p>
                                            <span className="text-zinc-900 dark:text-white">
                                                Availability:
                                            </span>{" "}
                                            {service.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                        </p>

                                        {service.technicianEmail && (
                                            <p className="break-all">
                                                <span className="text-zinc-900 dark:text-white">
                                                    Technician:
                                                </span>{" "}
                                                {service.technicianEmail}
                                            </p>
                                        )}
                                    </div>

                                    {service.approvalStatus === "pending" && (
                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() =>
                                                    updateService(
                                                        service._id,
                                                        "approve"
                                                    )
                                                }
                                                disabled={processingId !== ""}
                                                className="rounded-xl bg-green-600 px-3 py-3 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
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
                                                className="rounded-xl bg-red-600/15 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50 dark:text-red-400"
                                            >
                                                {processingId === service._id
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>
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
