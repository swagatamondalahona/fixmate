
import Link from "next/link";
import { connection } from "next/server";

interface Service {
    _id: string;
    title: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    technicianName?: string;
    image?: string;
}

interface FeaturedServicesResponse {
    success: boolean;
    data: Service[];
}

export default async function FeaturedServices() {
    await connection();

    let services: Service[] = [];
    let hasError = false;

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_API_URL is missing");
        }

        const response = await fetch(
            `${apiUrl.replace(/\/+$/, "")}/api/services/featured`,
            {
                cache: "no-store",
                signal: AbortSignal.timeout(10000),
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to fetch featured services: ${response.status}`
            );
        }

        const result: FeaturedServicesResponse = await response.json();

        if (result.success && Array.isArray(result.data)) {
            services = result.data;
        } else {
            throw new Error("Invalid featured services response");
        }
    } catch (error) {
        console.error("Featured Services Error:", error);
        hasError = true;
    }

    return (
        <section className="bg-zinc-50 px-4 py-14 sm:px-6 sm:py-16 lg:py-20 dark:bg-black">
            <div className="mx-auto max-w-7xl">
                <div className="mb-9 text-center sm:mb-12">
                    <span className="text-sm font-semibold uppercase tracking-wider text-orange-500">
                        Our Services
                    </span>

                    <h2 className="mt-3 text-2xl font-bold text-zinc-900 sm:text-3xl md:text-4xl dark:text-white">
                        Featured{" "}
                        <span className="text-orange-500">Services</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600 sm:text-base dark:text-zinc-400">
                        Find reliable repair services for your devices and home
                        appliances from trusted technicians.
                    </p>
                </div>

                {hasError ? (
                    <div className="rounded-2xl border border-red-300 bg-white px-4 py-12 text-center sm:px-6 sm:py-16 dark:border-red-900 dark:bg-zinc-900">
                        <h3 className="text-lg font-bold text-zinc-900 sm:text-xl dark:text-white">
                            Unable to Load Services
                        </h3>

                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            Please try again later.
                        </p>

                        <Link
                            href="/services"
                            className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Browse All Services
                        </Link>
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                        {services.map((service) => {
                            const technicianName =
                                service.technicianName?.trim() ||
                                "Not available";

                            const formattedPrice = Number(
                                service.basePrice || 0
                            ).toLocaleString("en-BD");

                            return (
                                <article
                                    key={service._id}
                                    className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                                >
                                    {service.image?.trim() ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            loading="lazy"
                                            className="h-44 w-full object-cover sm:h-48 lg:h-52"
                                        />
                                    ) : (
                                        <div className="flex h-44 w-full items-center justify-center bg-orange-50 text-5xl sm:h-48 lg:h-52 dark:bg-zinc-800">
                                            🔧
                                        </div>
                                    )}

                                    <div className="flex flex-1 flex-col p-4 sm:p-5 lg:p-6">
                                        <div>
                                            <span className="inline-block max-w-full truncate rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                                {service.category}
                                            </span>

                                            <h3 className="mt-4 line-clamp-2 text-lg font-bold text-zinc-900 sm:text-xl dark:text-white">
                                                {service.title}
                                            </h3>

                                            <p className="mt-2 break-words text-sm text-zinc-600 dark:text-zinc-400">
                                                <span className="font-semibold text-zinc-800 dark:text-zinc-300">
                                                    Technician:
                                                </span>{" "}
                                                {technicianName}
                                            </p>

                                            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                                <span className="font-semibold text-zinc-800 dark:text-zinc-300">
                                                    Mode:
                                                </span>{" "}
                                                {service.serviceMode || "Not specified"}
                                            </p>
                                        </div>

                                        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                                            <p className="text-lg font-bold text-orange-500">
                                                ৳{formattedPrice}
                                            </p>

                                            <Link
                                                href={`/services/${service._id}`}
                                                className="rounded-lg bg-orange-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-orange-600"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-4 py-12 text-center sm:px-6 sm:py-16 dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl dark:bg-orange-500/10">
                            🔧
                        </div>

                        <h3 className="mt-5 text-lg font-bold text-zinc-900 sm:text-xl dark:text-white">
                            No Featured Services Yet
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                            Our verified technicians are preparing their
                            services. Please check back soon!
                        </p>

                        <Link
                            href="/services"
                            className="mt-7 inline-block rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                        >
                            Browse All Services →
                        </Link>
                    </div>
                )}

                <div className="mt-9 text-center sm:mt-10">
                    <Link
                        href="/services"
                        className="inline-block font-semibold text-orange-500 transition hover:text-orange-600"
                    >
                        View All Services →
                    </Link>
                </div>
            </div>
        </section>
    );
}
