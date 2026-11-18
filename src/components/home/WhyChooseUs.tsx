
const features = [
    {
        icon: "🛡️",
        title: "Verified Technicians",
        description:
            "Get repair services from technicians whose profiles are reviewed by our admin team.",
    },
    {
        icon: "⭐",
        title: "Reliable Repair Services",
        description:
            "Find suitable repair services for your smartphones, computers and home appliances.",
    },
    {
        icon: "💰",
        title: "Transparent Pricing",
        description:
            "Check the starting price before sending your repair request.",
    },
    {
        icon: "💳",
        title: "Pay After Completion",
        description:
            "Complete your repair first and pay securely online after the technician marks the job completed.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="bg-white px-6 py-20 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl">

                {/* Section Heading */}
                <div className="mb-14 text-center">
                    <span className="font-semibold uppercase tracking-wider text-orange-500">
                        Why FixMate
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white md:text-4xl">
                        Why Choose <span className="text-orange-500">FixMate?</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                        We make finding and managing repair services simple,
                        reliable and convenient.
                    </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition group-hover:bg-orange-500 dark:bg-orange-500/10">
                                {feature.icon}
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-zinc-900 transition group-hover:text-orange-500 dark:text-white">
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
    );
}
