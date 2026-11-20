
"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

function getServiceIcon(category: string) {
    const value = category.toLowerCase();

    if (value.includes("laptop") || value.includes("computer")) return "💻";
    if (value.includes("phone") || value.includes("smartphone")) return "📱";
    if (value.includes("ac") || value.includes("air conditioner")) return "❄️";
    if (value.includes("refrigerator")) return "🧊";
    if (value.includes("tv")) return "📺";
    if (value.includes("washing")) return "🫧";
    if (value.includes("electrical")) return "⚡";

    return "🔧";
}

function ServiceDetailsPageContent() {
    const params = useParams<{ serviceId: string }>();
    const serviceId = params.serviceId;

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch single service from Backend
    useEffect(() => {
        if (!serviceId) return;

        const controller = new AbortController();

        const fetchService = async () => {
            try {
                setLoading(true);
                setError("");

                const API_URL =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:5000";

                const response = await fetch(
                    `${API_URL}/api/services/${serviceId}`,
                    {
                        signal: controller.signal,
                    }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Unable to load service details."
                    );
                }

                setService(result.data);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                console.error("Service details error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );

                setService(null);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchService();

        return () => controller.abort();
    }, [serviceId]);

    const technician =
        service?.technicianName ||
        service?.technician ||
        service?.technicianEmail ||
        "Not specified";

    const serviceArea =
        service?.area || service?.serviceArea || "Not specified";

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">

            {/* Repair Tools Watermark */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
                <div className="absolute inset-0 grid grid-cols-3 gap-16 p-8 opacity-[0.045] sm:grid-cols-4 lg:grid-cols-6">
                    {Array.from({ length: 36 }).map((_, index) => (
                        <span
                            key={index}
                            className="flex items-center justify-center text-5xl text-orange-500 grayscale sm:text-6xl"
                            style={{
                                transform: `rotate(${(index % 4) * 15 - 20}deg)`,
                            }}
                        >
                            {["⚙", "🔧", "🪛", "🔩", "🔨", "🔧"][index % 6]}
                        </span>
                    ))}
                </div>
            </div>

            {/* Background Effects */}
            <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-orange-600/10 blur-[130px]" />
            <div className="pointer-events-none absolute -right-40 top-[700px] h-96 w-96 rounded-full bg-orange-500/10 blur-[130px]" />

            {/* Page Header */}
            <section className="relative border-b border-orange-500/20 bg-gradient-to-br from-[#111111] via-[#15100d] to-[#261006] px-5 py-16 sm:py-20">

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/[0.04] to-transparent" />

                <div className="relative mx-auto max-w-7xl text-center">

                    <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />

                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
                            FixMate Service Details
                        </p>
                    </div>

                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
                        Service
                        <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">
                            {" "}Details
                        </span>
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                        Explore service information, pricing and repair
                        details before booking your trusted technician.
                    </p>

                    <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                </div>
            </section>

            {/* Main Content */}
            <section className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">

                {/* Back Button */}
                <Link
                    href="/services"
                    className="mb-8 inline-flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/10 px-5 py-3 text-sm font-semibold text-orange-400 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                >
                    <span>←</span>
                    Back to Services
                </Link>

                {/* Loading */}
                {loading && (
                    <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#171717] to-[#120d09] px-5 py-24 text-center">
                        <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />

                        <p className="font-semibold text-orange-400">
                            Loading service details...
                        </p>

                        <p className="mt-2 text-sm text-zinc-500">
                            Please wait while we fetch the information.
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-20 text-center">

                        <div className="mb-5 text-5xl">⚠️</div>

                        <h2 className="mb-3 text-2xl font-bold text-white">
                            Unable to Load Service
                        </h2>

                        <p className="mx-auto mb-7 max-w-md text-sm leading-7 text-zinc-400">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Service Not Found */}
                {!loading && !error && !service && (
                    <div className="rounded-2xl border border-orange-500/20 bg-[#151515] px-5 py-20 text-center">

                        <div className="mb-5 text-5xl">🔍</div>

                        <h2 className="mb-3 text-2xl font-bold text-white">
                            Service Not Found
                        </h2>

                        <p className="mb-7 text-sm text-zinc-400">
                            This service may be unavailable or no longer exist.
                        </p>

                        <Link
                            href="/services"
                            className="inline-flex rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                            Explore Services
                        </Link>
                    </div>
                )}

                {/* Service Details */}
                {!loading && !error && service && (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

                        {/* Left: Service Image */}
                        <div className="lg:col-span-2">

                            <div className="group relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#242424] via-[#191919] to-[#291307] shadow-[0_0_35px_rgba(249,115,22,0.06)]">

                                <div className="absolute inset-0 bg-orange-500/[0.03]" />

                                <div className="relative flex min-h-[300px] items-center justify-center sm:min-h-[400px]">

                                    <div className="absolute h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

                                    {service.image?.startsWith("http") ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="relative h-full min-h-[300px] max-h-[450px] w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <span className="relative text-8xl transition duration-500 group-hover:scale-110">
                                            {service.image ||
                                                getServiceIcon(service.category)}
                                        </span>
                                    )}
                                </div>

                                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                            </div>

                            {/* Service Information */}
                            <div className="mt-6 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#171717] via-[#111111] to-[#1c110c] p-6">

                                <h3 className="mb-5 flex items-center gap-3 text-lg font-bold text-white">
                                    <span className="h-7 w-1 rounded-full bg-orange-500" />
                                    Service Information
                                </h3>

                                <div className="space-y-5">

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm text-zinc-500">
                                            Category
                                        </span>
                                        <span className="text-right text-sm font-semibold text-orange-400">
                                            {service.category}
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10" />

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm text-zinc-500">
                                            Service Mode
                                        </span>
                                        <span className="text-right text-sm font-semibold text-white">
                                            {service.serviceMode === "On-site"
                                                ? "Home Visit"
                                                : service.serviceMode}
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10" />

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm text-zinc-500">
                                            Service Area
                                        </span>
                                        <span className="text-right text-sm font-semibold text-white">
                                            {serviceArea}
                                        </span>
                                    </div>

                                    <div className="border-t border-white/10" />

                                    <div className="flex items-start justify-between gap-4">
                                        <span className="text-sm text-zinc-500">
                                            Availability
                                        </span>
                                        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Details */}
                        <div className="lg:col-span-3">

                            <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#171717] via-[#111111] to-[#1c110c] p-6 shadow-[0_0_35px_rgba(249,115,22,0.05)] sm:p-8">

                                <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

                                <div className="relative">

                                    <div className="mb-6 flex flex-wrap items-center gap-3">

                                        <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold text-orange-400">
                                            {service.category}
                                        </span>

                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-zinc-400">
                                            {service.serviceMode === "On-site"
                                                ? "Home Visit"
                                                : service.serviceMode}
                                        </span>
                                    </div>

                                    <h2 className="mb-6 text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                                        {service.title}
                                    </h2>

                                    {/* Description */}
                                    <div className="mb-8">
                                        <h3 className="mb-3 flex items-center gap-3 text-lg font-bold text-white">
                                            <span className="h-7 w-1 rounded-full bg-orange-500" />
                                            About This Service
                                        </h3>

                                        <p className="whitespace-pre-line text-sm leading-8 text-zinc-400 sm:text-base">
                                            {service.description ||
                                                "Service description is not available."}
                                        </p>
                                    </div>

                                    <div className="mb-8 border-t border-white/10" />

                                    {/* Technician */}
                                    <div className="mb-8">
                                        <h3 className="mb-5 flex items-center gap-3 text-lg font-bold text-white">
                                            <span className="h-7 w-1 rounded-full bg-orange-500" />
                                            Technician Information
                                        </h3>

                                        <div className="rounded-xl border border-white/10 bg-black/30 p-5">

                                            <div className="flex items-center gap-4">

                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-2xl">
                                                    👨‍🔧
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-xs text-zinc-500">
                                                        Service Technician
                                                    </p>

                                                    <p className="mt-1 break-words font-semibold text-white">
                                                        {technician}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5 border-t border-white/10 pt-4">
                                                <p className="text-sm text-zinc-500">
                                                    Service Area
                                                </p>

                                                <p className="mt-1 text-sm font-medium text-zinc-300">
                                                    {serviceArea}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-8 border-t border-white/10" />

                                    {/* Price */}
                                    <div className="rounded-xl border border-orange-500/30 bg-orange-500/[0.06] p-5 sm:p-6">

                                        <p className="mb-2 text-sm font-medium text-zinc-400">
                                            Starting Price
                                        </p>

                                        <p className="text-3xl font-extrabold text-orange-500 sm:text-4xl">
                                            ৳{service.basePrice.toLocaleString("en-BD")}
                                        </p>

                                        <p className="mt-2 text-xs text-zinc-500">
                                            Final service cost may depend on the repair requirements.
                                        </p>
                                    </div>

                                    {/* Booking Button */}
                                    <div className="mt-7">
                                        <Link
                                            href="/sign-in"
                                            className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-1 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/30"
                                        >
                                            Sign In to Book
                                            <span>→</span>
                                        </Link>

                                        <p className="mt-3 text-center text-xs text-zinc-500">
                                            Sign in to continue with your service booking.
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}

export default function ServiceDetailsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#080808] flex items-center justify-center text-orange-500">
                Loading Service Details...
            </div>
        }>
            <ServiceDetailsPageContent />
        </Suspense>
    );
}