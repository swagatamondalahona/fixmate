
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const services = [
    {
        id: "1",
        title: "Smartphone Screen Repair",
        category: "Smartphone",
        mode: "Home Visit",
        area: "Dhaka",
        price: 800,
        technician: "Rahim Ahmed",
        image: "📱",
        createdAt: "2026-11-18",
    },
    {
        id: "2",
        title: "Laptop Hardware Repair",
        category: "Laptop & PC",
        mode: "Drop-off",
        area: "Mirpur, Dhaka",
        price: 1200,
        technician: "Karim Hasan",
        image: "💻",
        createdAt: "2026-11-17",
    },
    {
        id: "3",
        title: "Air Conditioner Servicing",
        category: "AC",
        mode: "Home Visit",
        area: "Uttara, Dhaka",
        price: 1500,
        technician: "Sakib Khan",
        image: "❄️",
        createdAt: "2026-11-16",
    },
    {
        id: "4",
        title: "Refrigerator Repair",
        category: "Refrigerator",
        mode: "Home Visit",
        area: "Dhanmondi, Dhaka",
        price: 1000,
        technician: "Hasan Mahmud",
        image: "🧊",
        createdAt: "2026-11-15",
    },
    {
        id: "5",
        title: "LED TV Repair",
        category: "TV",
        mode: "Drop-off",
        area: "Mohammadpur, Dhaka",
        price: 900,
        technician: "Rifat Islam",
        image: "📺",
        createdAt: "2026-11-14",
    },
    {
        id: "6",
        title: "Washing Machine Repair",
        category: "Washing Machine",
        mode: "Home Visit",
        area: "Badda, Dhaka",
        price: 1300,
        technician: "Nayeem Hossain",
        image: "🫧",
        createdAt: "2026-11-13",
    },
];

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

export default function ServicesPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [mode, setMode] = useState("All Modes");
    const [sort, setSort] = useState("newest");

    const filteredServices = useMemo(() => {
        let result = [...services];

        // Search by service title or category
        if (search.trim()) {
            result = result.filter((service) =>
                `${service.title} ${service.category}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Filter by category
        if (category !== "All Categories") {
            result = result.filter(
                (service) => service.category === category
            );
        }

        // Filter by service mode
        if (mode !== "All Modes") {
            result = result.filter(
                (service) => service.mode === mode
            );
        }

        // Sort services
        if (sort === "low-high") {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === "high-low") {
            result.sort((a, b) => b.price - a.price);
        } else {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
        }

        return result;
    }, [search, category, mode, sort]);

    const resetFilters = () => {
        setSearch("");
        setCategory("All Categories");
        setMode("All Modes");
        setSort("newest");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white">

            {/* Page Header */}
            <section className="border-b border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-950/30 px-5 py-16">
                <div className="mx-auto max-w-7xl text-center">

                    <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                        FixMate Services
                    </p>

                    <h1 className="mb-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
                        Find the Right
                        <span className="text-orange-500"> Repair Service</span>
                    </h1>

                    <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                        Find trusted technicians for your smartphones,
                        laptops and home appliances. Quality repair
                        services you can rely on.
                    </p>

                </div>
            </section>

            {/* Services Section */}
            <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">

                {/* Search and Filters */}
                <div className="mb-10 rounded-2xl border border-white/10 bg-zinc-900 p-5 sm:p-6">

                    <div className="mb-6">
                        <h2 className="mb-2 text-xl font-bold">
                            Explore Services
                        </h2>

                        <p className="text-sm text-zinc-400">
                            Search and filter services to find what you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">

                        {/* Search */}
                        <div className="lg:col-span-1">
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Search Services
                            </label>

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by service name..."
                                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500"
                            />
                        </div>

                        {/* Category Filter */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Category
                            </label>

                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                            >
                                {categories.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Service Mode */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Service Mode
                            </label>

                            <select
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                            >
                                <option value="All Modes">All Modes</option>
                                <option value="Home Visit">Home Visit</option>
                                <option value="Drop-off">Drop-off</option>
                            </select>
                        </div>

                        {/* Sorting */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-300">
                                Sort By
                            </label>

                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none focus:border-orange-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                        </div>

                    </div>

                    {/* Reset Filters */}
                    <div className="mt-5 flex justify-end">
                        <button
                            onClick={resetFilters}
                            className="text-sm font-semibold text-orange-500 transition hover:text-orange-400"
                        >
                            Reset Filters
                        </button>
                    </div>

                </div>

                {/* Result Count */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-bold">
                            Available Repair Services
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                            {filteredServices.length} services found
                        </p>
                    </div>
                </div>

                {/* Service Cards */}
                {filteredServices.length > 0 ? (

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {filteredServices.map((service) => (

                            <div
                                key={service.id}
                                className="group overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 transition duration-300 hover:-translate-y-1 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5"
                            >

                                {/* Service Image Placeholder */}
                                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-zinc-800 to-orange-950/40">
                                    <span className="text-7xl transition duration-300 group-hover:scale-110">
                                        {service.image}
                                    </span>
                                </div>

                                {/* Card Content */}
                                <div className="p-5">

                                    <div className="mb-3 flex items-center justify-between gap-2">
                                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-xs font-semibold text-orange-500">
                                            {service.category}
                                        </span>

                                        <span className="text-xs text-zinc-400">
                                            {service.mode}
                                        </span>
                                    </div>

                                    <h3 className="mb-3 text-lg font-bold transition group-hover:text-orange-500">
                                        {service.title}
                                    </h3>

                                    <div className="space-y-2 text-sm text-zinc-400">

                                        <p>
                                            <span className="text-zinc-500">
                                                Service Area:
                                            </span>{" "}
                                            {service.area}
                                        </p>

                                        <p>
                                            <span className="text-zinc-500">
                                                Technician:
                                            </span>{" "}
                                            {service.technician}
                                        </p>

                                    </div>

                                    <div className="my-5 border-t border-white/10" />

                                    <div className="flex items-center justify-between gap-3">

                                        <div>
                                            <p className="text-xs text-zinc-500">
                                                Starting From
                                            </p>

                                            <p className="text-xl font-extrabold text-orange-500">
                                                ৳{service.price}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/services/${service.id}`}
                                            className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
                                        >
                                            View Details
                                        </Link>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    /* Empty State */
                    <div className="rounded-2xl border border-dashed border-white/20 bg-zinc-900 px-5 py-16 text-center">

                        <div className="mb-4 text-5xl">
                            🔍
                        </div>

                        <h3 className="mb-2 text-xl font-bold">
                            No Services Found
                        </h3>

                        <p className="mb-6 text-sm text-zinc-400">
                            We couldn't find any services matching your search.
                            Try changing your filters.
                        </p>

                        <button
                            onClick={resetFilters}
                            className="rounded-lg bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
                        >
                            Clear Filters
                        </button>

                    </div>

                )}

            </section>

        </div>
    );
}
