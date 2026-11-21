
const steps = [
    {
        number: "01",
        icon: "🔍",
        title: "Find a Service",
        description:
            "Browse available repair services and choose the one you need.",
    },
    {
        number: "02",
        icon: "📝",
        title: "Send a Request",
        description:
            "Submit your repair request with your problem details and preferred date.",
    },
    {
        number: "03",
        icon: "🛠️",
        title: "Technician Fixes It",
        description:
            "A verified technician accepts your request and repairs your device.",
    },
    {
        number: "04",
        icon: "💳",
        title: "Pay After Completion",
        description:
            "Pay securely online after your repair service is completed.",
    },
];

export default function HowItWorks() {
    return (
        <section className="bg-white px-6 py-20 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-14 text-center">
                    <span className="font-semibold uppercase tracking-wider text-orange-500">
                        Simple Process
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white md:text-4xl">
                        How <span className="text-orange-500">FixMate</span> Works
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                        Getting your device repaired is simple. Follow these
                        four easy steps to get started.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="group relative rounded-2xl border border-zinc-200 bg-zinc-50 p-7 text-center transition duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-100 text-4xl transition group-hover:bg-orange-500 dark:bg-orange-500/10">
                                {step.icon}
                            </div>

                            <h3 className="mt-6 text-xl font-bold text-zinc-900 dark:text-white">
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
    );
}
