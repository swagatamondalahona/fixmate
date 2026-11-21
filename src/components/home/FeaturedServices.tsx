
import Link from "next/link";
import { connection } from "next/server";

interface Service {
    _id: string;
    title: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    technicianName: string;
    image?: string;
}

interface FeaturedServicesResponse {
    success: boolean;
    data: Service[];
}

export default async function FeaturedServices() {
    // Defer API request until an actual request comes in.
    await connection();

    let services: Service[] = [];
    let hasError = false;

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
            throw new Error("NEXT_PUBLIC_API_URL is missing");
        }

        const response = await fetch(
            `${apiUrl}/api/services/featured`,
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

        const result: FeaturedServicesResponse =
            await response.json();

        if (result.success && Array.isArray(result.data)) {
            services = result.data;
        }
    } catch (error) {
        console.error("Featured Services Error:", error);
        hasError = true;
    }

    return (
        <section className="bg-zinc-50 px-6 py-20 dark:bg-black">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-12 text-center">
                    <span className="font-semibold uppercase tracking-wider text-orange-500">
                        Our Services
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white md:text-4xl">
                        Featured{" "}
                        <span className="text-orange-500">
                            Services
                        </span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                        Find reliable repair services for your devices and home
                        appliances from trusted technicians.
                    </p>
                </div>

                {/* Error State */}
                {hasError ? (
                    <div className="rounded-2xl border border-red-300 bg-white px-6 py-16 text-center dark:border-red-900 dark:bg-zinc-900">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                            Unable to Load Services
                        </h3>

                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            Please try again later.
                        </p>
                    </div>
                ) : services.length > 0 ? (
                    /* Services Grid */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                {service.image && (
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="h-52 w-full object-cover"
                                    />
                                )}

                                <div className="p-6">
                                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                                        {service.category}
                                    </span>

                                    <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-white">
                                        {service.title}
                                    </h3>

                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        Technician: {service.technicianName}
                                    </p>

                                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        Mode: {service.serviceMode}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">
                                        <p className="text-lg font-bold text-orange-500">
                                            ৳
                                            {Number(
                                                service.basePrice || 0
                                            ).toLocaleString("en-BD")}
                                        </p>

                                        <Link
                                            href={`/services/${service._id}`}
                                            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
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
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-3xl dark:bg-orange-500/10">
                            🔧
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-zinc-900 dark:text-white">
                            No Featured Services Yet
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                            Our verified technicians are preparing their services.
                            Please check back soon!
                        </p>

                        <Link
                            href="/services"
                            className="mt-7 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                        >
                            Browse All Services →
                        </Link>
                    </div>
                )}

                {/* View All Button */}
                <div className="mt-10 text-center">
                    <Link
                        href="/services"
                        className="font-semibold text-orange-500 transition hover:text-orange-600"
                    >
                        View All Services →
                    </Link>
                </div>

            </div>
        </section>
    );
}
