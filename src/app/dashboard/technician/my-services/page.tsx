
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Service = {
    _id: string;
    title: string;
    description: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    image?: string;
    estimatedDuration?: string;
    serviceArea?: string;
    technicianName?: string;
    technicianEmail?: string;
    approvalStatus: "pending" | "approved" | "rejected";
    isAvailable: boolean;
    createdAt: string;
};

type ServiceForm = {
    title: string;
    description: string;
    category: string;
    serviceMode: string;
    basePrice: string;
    estimatedDuration: string;
    serviceArea: string;
};

const initialForm: ServiceForm = {
    title: "",
    description: "",
    category: "",
    serviceMode: "On-site",
    basePrice: "",
    estimatedDuration: "",
    serviceArea: "",
};

export default function MyServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingService, setEditingService] = useState<Service | null>(null);
    const [formData, setFormData] = useState<ServiceForm>(initialForm);
    const [saving, setSaving] = useState(false);

    const [deleteService, setDeleteService] = useState<Service | null>(null);
    const [deleting, setDeleting] = useState(false);

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    const fetchMyServices = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            if (!API_URL) {
                throw new Error("API URL is missing.");
            }

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Authentication token not found. Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/api/services/my-services`,
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
                throw new Error(result.message || "Failed to fetch services.");
            }

            setServices(result.data || []);
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
        fetchMyServices();
    }, [fetchMyServices]);

    const showMessage = (
        text: string,
        type: "success" | "error"
    ) => {
        setMessage(text);
        setMessageType(type);
    };

    const getStatusStyle = (status: Service["approvalStatus"]) => {
        switch (status) {
            case "approved":
                return "border-green-500/20 bg-green-500/10 text-green-400";
            case "rejected":
                return "border-red-500/20 bg-red-500/10 text-red-400";
            default:
                return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
        }
    };

    // Open Edit Form
    const handleEdit = (service: Service) => {
        setEditingService(service);

        setFormData({
            title: service.title || "",
            description: service.description || "",
            category: service.category || "",
            serviceMode: service.serviceMode || "On-site",
            basePrice: String(service.basePrice ?? ""),
            estimatedDuration: service.estimatedDuration || "",
            serviceArea: service.serviceArea || "",
        });

        setMessage("");
    };

    // Update Form Values
    const handleInputChange = (
        field: keyof ServiceForm,
        value: string
    ) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    // Update Service
    const handleUpdateService = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!editingService || !API_URL) {
            showMessage("Unable to update service.", "error");
            return;
        }

        try {
            setSaving(true);
            setMessage("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Authentication token not found. Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/api/services/${editingService._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                        category: formData.category.trim(),
                        serviceMode: formData.serviceMode,
                        basePrice: Number(formData.basePrice),
                        estimatedDuration: formData.estimatedDuration.trim(),
                        serviceArea: formData.serviceArea.trim(),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to update service.");
            }

            setEditingService(null);
            setFormData(initialForm);

            showMessage(
                "Service updated successfully! It is now pending admin approval.",
                "success"
            );

            await fetchMyServices();
        } catch (err) {
            showMessage(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while updating service.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete Service
    const handleDeleteService = async () => {
        if (!deleteService || !API_URL) {
            return;
        }

        try {
            setDeleting(true);
            setMessage("");

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Authentication token not found. Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/api/services/${deleteService._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to delete service."
                );
            }

            setDeleteService(null);

            showMessage("Service deleted successfully.", "success");

            await fetchMyServices();
        } catch (err) {
            showMessage(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while deleting service.",
                "error"
            );

            setDeleteService(null);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#080808] px-4 py-8 text-white sm:px-6 lg:px-8">

            {/* Background glow */}
            <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />

            {/* Watermark */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
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
                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                                Technician Workspace
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            My <span className="text-orange-500">Services</span>
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
                            View your submitted repair services and check their approval status.
                        </p>
                    </div>

                    <button
                        onClick={fetchMyServices}
                        disabled={loading}
                        className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 disabled:opacity-50"
                    >
                        ↻ Refresh Services
                    </button>
                </div>

                {/* Notification */}
                {message && (
                    <div
                        className={`mb-6 rounded-xl border p-4 text-sm ${messageType === "success"
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : "border-red-500/20 bg-red-500/10 text-red-400"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* Summary */}
                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        {
                            label: "Total Services",
                            value: services.length,
                            icon: "⚒",
                        },
                        {
                            label: "Approved",
                            value: services.filter(
                                (service) => service.approvalStatus === "approved"
                            ).length,
                            icon: "✓",
                        },
                        {
                            label: "Pending",
                            value: services.filter(
                                (service) => service.approvalStatus === "pending"
                            ).length,
                            icon: "◷",
                        },
                        {
                            label: "Rejected",
                            value: services.filter(
                                (service) => service.approvalStatus === "rejected"
                            ).length,
                            icon: "✕",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-2xl border border-white/10 bg-[#111111]/95 p-5 shadow-xl shadow-black/20"
                        >
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-xl text-orange-500">
                                {item.icon}
                            </div>
                            <p className="text-sm text-gray-400">{item.label}</p>
                            <p className="mt-1 text-2xl font-bold text-white">
                                {item.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-white/10 bg-[#111111]/95 p-12 text-center">
                        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-orange-500" />
                        <p className="mt-4 text-sm text-gray-400">
                            Loading your services...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
                        <p className="text-sm text-red-400">{error}</p>
                        <button
                            onClick={fetchMyServices}
                            className="mt-4 rounded-lg bg-orange-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && services.length === 0 && (
                    <div className="rounded-2xl border border-white/10 bg-[#111111]/95 px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-3xl text-orange-500">
                            ⚒
                        </div>

                        <h2 className="mt-5 text-xl font-bold text-white">
                            No Services Found
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400">
                            You have not submitted any repair services yet.
                        </p>

                        <a
                            href="/dashboard/technician/add-service"
                            className="mt-6 inline-flex rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            + Add New Service
                        </a>
                    </div>
                )}

                {/* Service Cards */}
                {!loading && !error && services.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/95 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-orange-500/30"
                            >
                                {/* Image */}
                                <div className="relative h-52 overflow-hidden bg-[#080808]">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-5xl text-orange-500">
                                            ⚒
                                        </div>
                                    )}

                                    <span
                                        className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-xs font-semibold capitalize ${getStatusStyle(
                                            service.approvalStatus
                                        )}`}
                                    >
                                        {service.approvalStatus}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="mb-3 flex items-center justify-between gap-3">
                                        <span className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400">
                                            {service.category}
                                        </span>

                                        <span className="text-sm font-bold text-orange-500">
                                            ${service.basePrice}
                                        </span>
                                    </div>

                                    <h2 className="text-lg font-bold text-white">
                                        {service.title}
                                    </h2>

                                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                                        {service.description}
                                    </p>

                                    <div className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
                                        <div className="flex justify-between gap-3">
                                            <span className="text-gray-500">
                                                Service Mode
                                            </span>
                                            <span className="text-gray-200">
                                                {service.serviceMode || "Not specified"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-gray-500">
                                                Service Area
                                            </span>
                                            <span className="text-right text-gray-200">
                                                {service.serviceArea || "Not specified"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-gray-500">
                                                Duration
                                            </span>
                                            <span className="text-gray-200">
                                                {service.estimatedDuration || "Not specified"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3">
                                            <span className="text-gray-500">
                                                Availability
                                            </span>
                                            <span className={service.isAvailable ? "text-green-400" : "text-red-400"}>
                                                {service.isAvailable ? "Available" : "Unavailable"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 border-t border-white/10 pt-4">
                                        <p className="text-xs text-gray-500">
                                            Submitted:{" "}
                                            {service.createdAt
                                                ? new Date(service.createdAt).toLocaleDateString()
                                                : "Not available"}
                                        </p>

                                        {/* Edit and Delete Actions */}
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20"
                                            >
                                                ✎ Edit
                                            </button>

                                            <button
                                                onClick={() => setDeleteService(service)}
                                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                                            >
                                                ✕ Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Service Modal */}
            {editingService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
                    <div className="my-8 w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl sm:p-8">
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    Edit <span className="text-orange-500">Service</span>
                                </h2>
                                <p className="mt-2 text-sm text-gray-400">
                                    Update your service information.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditingService(null)}
                                disabled={saving}
                                className="rounded-lg border border-white/10 px-3 py-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUpdateService} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Service Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    minLength={3}
                                    value={formData.title}
                                    onChange={(e) => handleInputChange("title", e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-white outline-none transition focus:border-orange-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    required
                                    minLength={10}
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    className="w-full resize-y rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-white outline-none transition focus:border-orange-500"
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => handleInputChange("category", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-white outline-none transition focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">
                                        Service Mode
                                    </label>
                                    <select
                                        required
                                        value={formData.serviceMode}
                                        onChange={(e) => handleInputChange("serviceMode", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-white outline-none transition focus:border-orange-500"
                                    >
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">
                                        Base Price
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        step="0.01"
                                        value={formData.basePrice}
                                        onChange={(e) => handleInputChange("basePrice", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-white outline-none transition focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-300">
                                        Estimated Duration
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.estimatedDuration}
                                        onChange={(e) => handleInputChange("estimatedDuration", e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-white outline-none transition focus:border-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-300">
                                    Service Area
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.serviceArea}
                                    onChange={(e) => handleInputChange("serviceArea", e.target.value)}
                                    className="w-full rounded-xl border border-white/10 bg-[#080808] px-4 py-3 text-white outline-none transition focus:border-orange-500"
                                />
                            </div>

                            <p className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-xs leading-5 text-yellow-400">
                                After updating, your service will be submitted for admin approval again.
                            </p>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditingService(null)}
                                    disabled={saving}
                                    className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {saving ? "Updating..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
                        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400">
                            ✕
                        </div>

                        <h2 className="text-xl font-bold text-white">
                            Delete Service?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-gray-400">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-white">
                                {deleteService.title}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setDeleteService(null)}
                                disabled={deleting}
                                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:bg-white/10 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteService}
                                disabled={deleting}
                                className="rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
