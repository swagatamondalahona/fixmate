
import Link from "next/link";

export default function FeaturedServices() {
    return (
        <section className="bg-zinc-50 px-6 py-20 dark:bg-black">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-12 text-center">
                    <span className="font-semibold uppercase tracking-wider text-orange-500">
                        Our Services
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white md:text-4xl">
                        Featured <span className="text-orange-500">Services</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                        Find reliable repair services for your devices and home
                        appliances from trusted technicians.
                    </p>
                </div>

                {/* Empty State */}
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
