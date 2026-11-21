
import Link from "next/link";
import type { ReactNode } from "react";

type IconName =
    | "search"
    | "clipboard"
    | "wrench"
    | "card"
    | "shield"
    | "clock"
    | "users"
    | "target"
    | "eye"
    | "arrow"
    | "check";

function Icon({
    name,
    size = 24,
}: {
    name: IconName;
    size?: number;
}) {
    const paths: Record<IconName, ReactNode> = {
        search: (
            <>
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
            </>
        ),
        clipboard: (
            <>
                <rect x="5" y="4" width="14" height="17" rx="2" />
                <path d="M9 4V2h6v2M9 10h6M9 14h6" />
            </>
        ),
        wrench: (
            <>
                <path d="M14.5 6.5a5 5 0 0 0-6.8 6.8L3 18l3 3 4.7-4.7a5 5 0 0 0 6.8-6.8L14 13l-3-3z" />
            </>
        ),
        card: (
            <>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20M6 15h4" />
            </>
        ),
        shield: (
            <>
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
                <path d="m9 12 2 2 4-4" />
            </>
        ),
        clock: (
            <>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
            </>
        ),
        users: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="10" cy="7" r="4" />
                <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </>
        ),
        target: (
            <>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
            </>
        ),
        eye: (
            <>
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
            </>
        ),
        arrow: (
            <>
                <path d="M5 12h14M12 5l7 7-7 7" />
            </>
        ),
        check: (
            <>
                <circle cx="12" cy="12" r="10" />
                <path d="m8 12 3 3 5-6" />
            </>
        ),
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>
    );
}

const steps: {
    icon: IconName;
    number: string;
    title: string;
    description: string;
}[] = [
        {
            icon: "search",
            number: "01",
            title: "Find a Service",
            description:
                "Explore available repair services and choose the service that matches your needs.",
        },
        {
            icon: "clipboard",
            number: "02",
            title: "Send a Request",
            description:
                "Select your preferred date, provide your details, and submit a booking request.",
        },
        {
            icon: "wrench",
            number: "03",
            title: "Get It Repaired",
            description:
                "A technician reviews your request and provides the repair service.",
        },
        {
            icon: "card",
            number: "04",
            title: "Complete Payment",
            description:
                "Complete your payment securely after the repair service is finished.",
        },
    ];

const features: {
    icon: IconName;
    title: string;
    description: string;
}[] = [
        {
            icon: "shield",
            title: "Trusted Technicians",
            description:
                "Connect with technicians who provide reliable device and appliance repair services.",
        },
        {
            icon: "clock",
            title: "Convenient Booking",
            description:
                "Find services and submit repair requests through a simple online platform.",
        },
        {
            icon: "users",
            title: "Customer Focused",
            description:
                "We aim to make finding and managing repair services easier for everyone.",
        },
    ];

export default function AboutPage() {
    return (
        <main className="min-h-screen overflow-hidden bg-zinc-100 text-zinc-900 transition-colors duration-300 dark:bg-[#080808] dark:text-white">
            {/* Hero Section */}
            <section className="relative border-b border-zinc-200 bg-gradient-to-br from-white via-orange-50 to-zinc-100 px-5 py-24 dark:border-white/10 dark:from-[#111111] dark:via-[#0c0c0c] dark:to-black sm:py-28">
                <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-orange-400/10 blur-[110px]" />
                <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-orange-500/10 blur-[110px]" />

                <div className="relative mx-auto max-w-5xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                        <Icon name="wrench" size={16} />
                        About FixMate
                    </span>

                    <h1 className="mt-7 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                        Making Repair Services
                        <span className="block text-orange-500">
                            Simple & Reliable
                        </span>
                    </h1>

                    <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-zinc-600 dark:text-zinc-400 sm:text-lg">
                        FixMate is a smart device and home appliance repair
                        service platform that helps customers find reliable
                        technicians and manage their repair bookings in one
                        convenient place.
                    </p>

                    <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-7 py-3.5 font-bold text-white transition hover:bg-orange-600"
                        >
                            Explore Services
                            <Icon name="arrow" size={18} />
                        </Link>

                        <Link
                            href="/"
                            className="rounded-xl border border-zinc-300 px-7 py-3.5 font-semibold text-zinc-800 transition hover:border-orange-500 hover:text-orange-600 dark:border-white/20 dark:text-white dark:hover:border-orange-500 dark:hover:text-orange-400"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Introduction */}
            <section className="px-5 py-20 sm:py-24">
                <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
                    <div>
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                            Who We Are
                        </span>

                        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                            Your Trusted Partner for Repair Services
                        </h2>

                        <p className="mt-6 leading-8 text-zinc-600 dark:text-zinc-400">
                            Finding the right technician for a broken
                            smartphone, laptop, refrigerator, or other home
                            appliance can be challenging. FixMate brings
                            customers and repair technicians together through
                            one easy-to-use platform.
                        </p>

                        <p className="mt-4 leading-8 text-zinc-600 dark:text-zinc-400">
                            From exploring available services to submitting
                            booking requests and managing payments, FixMate
                            makes the repair journey more organized and
                            convenient.
                        </p>

                        <div className="mt-7 space-y-3">
                            {[
                                "Easy service discovery and booking",
                                "Convenient booking management",
                                "Dedicated customer and technician dashboards",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-start gap-3"
                                >
                                    <span className="mt-0.5 text-orange-500">
                                        <Icon name="check" size={20} />
                                    </span>
                                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl shadow-zinc-300/30 dark:border-white/10 dark:bg-[#111111] dark:shadow-black/30 sm:p-10">
                        <div className="absolute -right-3 -top-3 h-20 w-20 rounded-full bg-orange-500/10 blur-2xl" />

                        <div className="relative space-y-8">
                            <div className="flex gap-5">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                                    <Icon name="target" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">
                                        Our Mission
                                    </h3>
                                    <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
                                        To make repair services easier to
                                        discover, book, and manage by connecting
                                        customers with reliable technicians.
                                    </p>
                                </div>
                            </div>

                            <div className="h-px bg-zinc-200 dark:bg-white/10" />

                            <div className="flex gap-5">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                                    <Icon name="eye" size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">
                                        Our Vision
                                    </h3>
                                    <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-400">
                                        To create a convenient and dependable
                                        repair service experience for customers
                                        and technicians.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="border-y border-zinc-200 bg-white px-5 py-20 dark:border-white/10 dark:bg-[#0d0d0d] sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                            Simple Process
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                            How FixMate Works
                        </h2>
                        <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
                            Getting your device or home appliance repaired is
                            simple with our four-step process.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step) => (
                            <div
                                key={step.number}
                                className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 dark:border-white/10 dark:bg-[#111111]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 transition group-hover:bg-orange-500 group-hover:text-white">
                                        <Icon name={step.icon} size={27} />
                                    </div>
                                    <span className="text-3xl font-extrabold text-zinc-200 dark:text-white/10">
                                        {step.number}
                                    </span>
                                </div>

                                <h3 className="mt-7 text-xl font-bold">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose FixMate */}
            <section className="px-5 py-20 sm:py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-500">
                            Why FixMate
                        </span>
                        <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
                            A Better Repair Experience
                        </h2>
                        <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-400">
                            We focus on making the repair service experience
                            convenient, organized, and customer friendly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="rounded-2xl border border-zinc-200 bg-white p-8 transition hover:-translate-y-1 hover:border-orange-500/50 dark:border-white/10 dark:bg-[#111111]"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                                    <Icon name={feature.icon} size={28} />
                                </div>

                                <h3 className="mt-6 text-xl font-bold">
                                    {feature.title}
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-5 pb-20 sm:pb-24">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 to-orange-500 px-7 py-14 text-center text-white sm:px-12 sm:py-16">
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border-[40px] border-white/10" />
                    <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border-[40px] border-white/10" />

                    <div className="relative">
                        <h2 className="text-3xl font-extrabold sm:text-4xl">
                            Ready to Get Your Device Fixed?
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl leading-7 text-white/90">
                            Explore available repair services and find the
                            right solution for your device or home appliance.
                        </p>

                        <Link
                            href="/services"
                            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-orange-600 transition hover:bg-zinc-100"
                        >
                            Browse Services
                            <Icon name="arrow" size={18} />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
