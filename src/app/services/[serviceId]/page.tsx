
"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

type Service = {
    _id: string;
    title: string;
    description?: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    image?: string;
    area?: string;
    serviceArea?: string;
    technicianName?: string;
    technician?: string;
    technicianEmail?: string;
    createdAt: string;
};

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function ServiceDetailsPageContent() {
    const params = useParams<{ serviceId: string }>();
    const serviceId = params.serviceId;

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [bookingDate, setBookingDate] = useState("");
    const [address, setAddress] = useState("");
    const [notes, setNotes] = useState("");

    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingMessage, setBookingMessage] = useState("");
    const [bookingError, setBookingError] = useState("");

    useEffect(() => {
        if (!serviceId) return;

        const controller = new AbortController();

        const fetchService = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/services/${serviceId}`,
                    { signal: controller.signal }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to load service"
                    );
                }

                setService(result.data);
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchService();

        return () => controller.abort();
    }, [serviceId]);

    const handleBooking = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setBookingMessage("");
        setBookingError("");

        if (!bookingDate || !address.trim()) {
            setBookingError("Please provide booking date and address.");
            return;
        }

        try {
            setBookingLoading(true);

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (tokenResponse.error || !token) {
                setBookingError("Please sign in before booking.");
                return;
            }

            const response = await fetch(`${API_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId,
                    bookingDate,
                    address: address.trim(),
                    notes: notes.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Booking could not be created."
                );
            }

            setBookingMessage(
                "Booking request submitted successfully! Your booking is waiting for technician approval."
            );

            setBookingDate("");
            setAddress("");
            setNotes("");
        } catch (err) {
            setBookingError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-orange-500 dark:bg-[#080808]">
                Loading Service Details...
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-100 px-6 text-center dark:bg-[#080808]">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Service Not Found
                </h2>

                <p className="mt-3 text-zinc-500 dark:text-gray-400">
                    {error || "This service is unavailable."}
                </p>

                <Link
                    href="/services"
                    className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400"
                >
                    Back to Services
                </Link>
            </div>
        );
    }

    const technician =
        service.technicianName ||
        service.technician ||
        service.technicianEmail ||
        "Not specified";

    const serviceArea =
        service.area || service.serviceArea || "Not specified";

    const serviceMode =
        service.serviceMode === "On-site"
            ? "Home Visit"
            : service.serviceMode;

    const inputClass =
        "w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-orange-500 dark:border-white/10 dark:bg-[#080808] dark:text-white dark:placeholder:text-gray-600";

    const labelClass =
        "mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-300";

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-100 text-zinc-900 dark:bg-[#080808] dark:text-white">
            {/* Repair Tools Watermark */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="grid grid-cols-4 gap-12 p-8 text-5xl opacity-[0.045] grayscale sm:grid-cols-6 md:grid-cols-8">
                    {Array.from({ length: 64 }).map((_, index) => (
                        <span
                            key={index}
                            className="flex items-center justify-center"
                        >
                            {["⚙️", "🔧", "🪛", "🔩", "🔨", "🛠️"][index % 6]}
                        </span>
                    ))}
                </div>
            </div>

            <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[130px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="mb-3 font-semibold uppercase tracking-[0.3em] text-orange-500">
                        FixMate Service Details
                    </p>

                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        Service Details
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-500 dark:text-gray-400">
                        Explore service information, pricing and repair
                        details before booking your trusted technician.
                    </p>
                </div>

                <Link
                    href="/services"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-400 dark:text-orange-400 dark:hover:text-orange-300"
                >
                    ← Back to Services
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Service Information */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#111111]/90 dark:shadow-black/30">
                            <div className="flex min-h-56 items-center justify-center bg-gradient-to-br from-orange-500/15 to-zinc-200 p-8 dark:to-[#151515]">
                                {service.image ? (
                                    service.image.startsWith("http") ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="max-h-64 w-full rounded-xl object-contain"
                                        />
                                    ) : (
                                        <span className="text-8xl">
                                            {service.image}
                                        </span>
                                    )
                                ) : (
                                    <div className="text-8xl">🔧</div>
                                )}
                            </div>

                            <div className="space-y-6 p-6 sm:p-8">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                        {service.category}
                                    </span>

                                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                                        {serviceMode}
                                    </span>

                                    <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                        Available
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold sm:text-3xl">
                                    {service.title}
                                </h2>

                                <div>
                                    <h3 className="mb-3 text-lg font-bold text-orange-500 dark:text-orange-400">
                                        About This Service
                                    </h3>

                                    <p className="leading-7 text-zinc-600 dark:text-gray-400">
                                        {service.description ||
                                            "No description available."}
                                    </p>
                                </div>

                                <div className="grid gap-4 border-t border-zinc-200 pt-6 dark:border-white/10 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Service Category
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {service.category}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Service Mode
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {serviceMode}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Service Area
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {serviceArea}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Availability
                                        </p>
                                        <p className="mt-1 font-semibold text-green-600 dark:text-green-400">
                                            Available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technician Information */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]/90 sm:p-8">
                            <h3 className="mb-6 text-xl font-bold">
                                Technician Information
                            </h3>

                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-3xl">
                                    👨‍🔧
                                </div>

                                <div>
                                    <p className="text-sm text-zinc-500 dark:text-gray-500">
                                        Service Technician
                                    </p>

                                    <p className="mt-1 font-semibold">
                                        {technician}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 border-t border-zinc-200 pt-5 dark:border-white/10">
                                <p className="text-sm text-zinc-500 dark:text-gray-500">
                                    Service Area
                                </p>

                                <p className="mt-1 font-semibold">
                                    {serviceArea}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price and Booking Form */}
                    <div className="space-y-6">
                        <div className="h-fit rounded-2xl border border-orange-500/30 bg-white p-6 shadow-xl shadow-orange-500/5 dark:bg-[#111111]/95">
                            <p className="text-sm font-semibold text-zinc-500 dark:text-gray-400">
                                Starting Price
                            </p>

                            <h2 className="mt-2 text-4xl font-extrabold text-orange-500 dark:text-orange-400">
                                ৳{service.basePrice.toLocaleString("en-BD")}
                            </h2>

                            <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-gray-500">
                                Final service cost may depend on the repair
                                requirements.
                            </p>
                        </div>

                        {/* Customer Booking Form */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#111111]/95">
                            <h3 className="mb-2 text-xl font-bold">
                                Book This Service
                            </h3>

                            <p className="mb-6 text-sm text-zinc-500 dark:text-gray-400">
                                Submit your booking request to the technician.
                            </p>

                            <form
                                onSubmit={handleBooking}
                                className="space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="bookingDate"
                                        className={labelClass}
                                    >
                                        Booking Date & Time
                                    </label>

                                    <input
                                        id="bookingDate"
                                        type="datetime-local"
                                        required
                                        min={new Date()
                                            .toISOString()
                                            .slice(0, 16)}
                                        value={bookingDate}
                                        onChange={(event) =>
                                            setBookingDate(event.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="address"
                                        className={labelClass}
                                    >
                                        Service Address
                                    </label>

                                    <textarea
                                        id="address"
                                        required
                                        rows={3}
                                        value={address}
                                        onChange={(event) =>
                                            setAddress(event.target.value)
                                        }
                                        placeholder="Enter your full service address"
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="notes"
                                        className={labelClass}
                                    >
                                        Additional Notes (Optional)
                                    </label>

                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={notes}
                                        onChange={(event) =>
                                            setNotes(event.target.value)
                                        }
                                        placeholder="Describe your repair problem..."
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>

                                {bookingError && (
                                    <div
                                        role="alert"
                                        className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
                                    >
                                        {bookingError}
                                    </div>
                                )}

                                {bookingMessage && (
                                    <div
                                        role="status"
                                        className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-600 dark:text-green-400"
                                    >
                                        {bookingMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className="w-full rounded-lg bg-orange-500 px-5 py-3.5 font-bold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {bookingLoading
                                        ? "Submitting Booking..."
                                        : "Confirm Booking →"}
                                </button>

                                <p className="text-center text-xs leading-5 text-zinc-500 dark:text-gray-500">
                                    Your booking will be submitted as a
                                    request. The technician must accept it
                                    before the service is confirmed.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServiceDetailsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-orange-500 dark:bg-[#080808]">
                    Loading Service Details...
                </div>
            }
        >
            <ServiceDetailsPageContent />
        </Suspense>
    );
}
