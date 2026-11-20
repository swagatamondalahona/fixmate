
"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
    createdAt: string;
};

const categories = [
    "All Categories",
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
];

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

function ServicesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(
        searchParams.get("search") || ""
    );

    const [category, setCategory] = useState(
        searchParams.get("category") || "All Categories"
    );

    const [mode, setMode] = useState(
        searchParams.get("mode") || "All Modes"
    );

    const [sort, setSort] = useState(
        searchParams.get("sort") || "newest"
    );

    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Restore filters when URL changes
    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setCategory(searchParams.get("category") || "All Categories");
        setMode(searchParams.get("mode") || "All Modes");
        setSort(searchParams.get("sort") || "newest");
    }, [searchParams]);

    // Save filters in URL
    useEffect(() => {
        const params = new URLSearchParams();

        if (search.trim()) {
            params.set("search", search.trim());
        }

        if (category !== "All Categories") {
            params.set("category", category);
        }

        if (mode !== "All Modes") {
            params.set("mode", mode);
        }

        if (sort !== "newest") {
            params.set("sort", sort);
        }

        const queryString = params.toString();

        const newUrl = queryString
            ? `/services?${queryString}`
            : "/services";

        const currentUrl = `/services${searchParams.toString()
            ? `?${searchParams.toString()}`
            : ""
            }`;

        if (newUrl !== currentUrl) {
            router.replace(newUrl, { scroll: false });
        }
    }, [search, category, mode, sort, router, searchParams]);

    // Fetch services from Backend API
    useEffect(() => {
        const controller = new AbortController();

        const fetchServices = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams();

                if (search.trim()) {
                    params.set("search", search.trim());
                }

                if (category !== "All Categories") {
                    params.set("category", category);
                }

                if (mode !== "All Modes") {
                    params.set(
                        "mode",
                        mode === "Home Visit" ? "On-site" : mode
                    );
                }

                params.set("sort", sort);

                const API_URL =
                    process.env.NEXT_PUBLIC_API_URL ||
                    "http://localhost:5000";

                const response = await fetch(
                    `${API_URL}/api/services?${params.toString()}`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch services from server.");
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message || "Unable to load services."
                    );
                }

                setServices(result.data || []);
            } catch (err) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                console.error("Services fetch error:", err);

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );

                setServices([]);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchServices();

        return () => controller.abort();
    }, [search, category, mode, sort]);

    // Dynamic categories from database
    const availableCategories = [
        ...new Set([
            ...categories,
            ...services.map((service) => service.category),
        ]),
    ];

    const resetFilters = () => {
        setSearch("");
        setCategory("All Categories");
        setMode("All Modes");
        setSort("newest");

        router.replace("/services", { scroll: false });
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#080808] text-white">

            {/* Background Design */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                    backgroundSize: "45px 45px",
                }}
            />

            <div className="pointer-events-none absolute -left-40 top-40 h-96 w-96 rounded-full bg-orange-600/10 blur-[130px]" />
            <div className="pointer-events-none absolute -right-40 top-[700px] h-96 w-96 rounded-full bg-orange-500/10 blur-[130px]" />

            {/* Page Header */}
            <section className="relative border-b border-orange-500/20 bg-gradient-to-br from-[#111111] via-[#15100d] to-[#261006] px-5 py-20">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/[0.04] to-transparent" />

                <div className="relative mx-auto max-w-7xl text-center">

                    <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_#f97316]" />
                        <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400">
                            FixMate Services
                        </p>
                    </div>

                    <h1 className="mb-5 text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Find the Right
                        <span className="block bg-gradient-to-r from-orange-400 via-orange-500 to-amber-300 bg-clip-text text-transparent">
                            Repair Service
                        </span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                        Find trusted technicians for your smartphones,
                        laptops and home appliances. Quality repair
                        services you can rely on.
                    </p>

                    <div className="mx-auto mt-8 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                </div>
            </section>

            {/* Services Section */}
            <section className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8">

                {/* Search and Filters */}
                <div className="relative mb-12 overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-[#171717] via-[#111111] to-[#1c110c] p-5 shadow-[0_0_35px_rgba(249,115,22,0.05)] sm:p-7">

                    <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

                    <div className="relative mb-7">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="h-8 w-1 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]" />

                            <h2 className="text-xl font-bold text-white">
                                Explore Services
                            </h2>
                        </div>

                        <p className="text-sm text-zinc-400">
                            Search and filter services to find what you need.
                        </p>
                    </div>

                    <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

                        {/* Search */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-zinc-300">
                                Search Services
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by service name..."
                                className="w-full rounded-xl border border-white/10 bg-[#090909] px-4 py-3.5 text-sm text-white outline-none transition duration-300 placeholder:text-zinc-600 hover:border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-zinc-300">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#090909] px-4 py-3.5 text-sm text-white outline-none transition duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                            >
                                {availableCategories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Service Mode */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-zinc-300">
                                Service Mode
                            </label>

                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#090909] px-4 py-3.5 text-sm text-white outline-none transition duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                            >
                                <option value="All Modes">All Modes</option>
                                <option value="Home Visit">Home Visit</option>
                                <option value="Drop-off">Drop-off</option>
                            </select>
                        </div>

                        {/* Sorting */}
                        <div>
                            <label className="mb-2 block text-sm font-semibold text-zinc-300">
                                Sort By
                            </label>

                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full cursor-pointer rounded-xl border border-white/10 bg-[#090909] px-4 py-3.5 text-sm text-white outline-none transition duration-300 hover:border-orange-500/30 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10"
                            >
                                <option value="newest">Newest First</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Reset Filters */}
                    <div className="relative mt-6 flex justify-end border-t border-white/10 pt-5">
                        <button
                            onClick={resetFilters}
                            className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-400 transition duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]"
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* Result Count */}
                <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                            Browse Our Collection
                        </p>

                        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                            Available Repair Services
                        </h2>

                        <p className="mt-2 text-sm text-zinc-400">
                            Find the right technician for your needs.
                        </p>
                    </div>

                    <div className="rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-2.5">
                        <p className="text-sm font-semibold text-orange-400">
                            {loading ? "Loading..." : `${services.length} services found`}
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="rounded-2xl border border-orange-500/20 bg-[#151515] px-5 py-20 text-center">
                        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />
                        <p className="text-sm font-semibold text-orange-400">
                            Loading repair services...
                        </p>
                    </div>
                ) : error ? (
                    /* API Error */
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 px-5 py-16 text-center">
                        <div className="mb-5 text-5xl">⚠️</div>

                        <h3 className="mb-3 text-2xl font-bold text-white">
                            Unable to Load Services
                        </h3>

                        <p className="mx-auto mb-7 max-w-md text-sm leading-7 text-zinc-400">
                            {error}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-orange-600"
                        >
                            Try Again
                        </button>
                    </div>
                ) : services.length > 0 ? (
                    /* Service Cards */
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] via-[#111111] to-[#17100d] transition duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-[0_15px_40px_rgba(249,115,22,0.10)]"
                            >
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/[0.04] via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                                <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-br from-[#242424] via-[#191919] to-[#291307]">
                                    <div className="absolute h-32 w-32 rounded-full bg-orange-500/10 blur-3xl transition duration-500 group-hover:bg-orange-500/20" />

                                    {service.image?.startsWith("http") ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="relative h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <span className="relative text-7xl transition duration-500 group-hover:scale-125 group-hover:-rotate-3">
                                            {service.image || getServiceIcon(service.category)}
                                        </span>
                                    )}

                                    <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-orange-500 transition-all duration-500 group-hover:w-full" />
                                </div>

                                <div className="relative p-5">
                                    <div className="mb-4 flex items-center justify-between gap-2">
                                        <span className="rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-400">
                                            {service.category}
                                        </span>

                                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-400">
                                            {service.serviceMode === "On-site"
                                                ? "Home Visit"
                                                : service.serviceMode}
                                        </span>
                                    </div>

                                    <h3 className="mb-4 text-lg font-bold text-white transition duration-300 group-hover:text-orange-400">
                                        {service.title}
                                    </h3>

                                    <div className="space-y-3 text-sm text-zinc-400">
                                        <p className="flex items-center gap-2">
                                            <span className="text-orange-500">⌖</span>
                                            <span className="text-zinc-500">
                                                Service Area:
                                            </span>
                                            {service.area || service.serviceArea || "Not specified"}
                                        </p>

                                        <p className="flex items-center gap-2">
                                            <span className="text-orange-500">◈</span>
                                            <span className="text-zinc-500">
                                                Technician:
                                            </span>
                                            {service.technicianName || service.technician || "Not specified"}
                                        </p>
                                    </div>

                                    <div className="my-5 border-t border-white/10" />

                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="mb-1 text-xs font-medium text-zinc-500">
                                                Starting From
                                            </p>

                                            <p className="text-2xl font-extrabold text-orange-500">
                                                ৳{service.basePrice}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/services/${service._id}`}
                                            className="rounded-xl border border-orange-500 bg-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/10 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-orange-500/25"
                                        >
                                            View Details →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* No Services Found */
                    <div className="relative overflow-hidden rounded-2xl border border-dashed border-orange-500/30 bg-gradient-to-br from-[#191919] to-[#120d09] px-5 py-20 text-center">
                        <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl" />

                        <div className="relative">
                            <div className="mb-5 text-5xl">🔍</div>

                            <h3 className="mb-3 text-2xl font-bold text-white">
                                No Services Found
                            </h3>

                            <p className="mx-auto mb-7 max-w-md text-sm leading-7 text-zinc-400">
                                We couldn&apos;t find any services matching your search.
                                Try changing your filters.
                            </p>

                            <button
                                onClick={resetFilters}
                                className="rounded-xl bg-orange-500 px-7 py-3 text-sm font-bold text-white transition duration-300 hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.25)]"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

export default function ServicesPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#080808] text-white">
                    Loading services...
                </div>
            }
        >
            <ServicesContent />
        </Suspense>
    );
}
