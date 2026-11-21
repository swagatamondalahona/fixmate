
import Link from "next/link";

const categories = [
    { name: "Smartphone", icon: "📱", description: "Screen, battery & mobile repair" },
    { name: "Laptop & PC", icon: "💻", description: "Computer & laptop servicing" },
    { name: "AC", icon: "❄️", description: "Air conditioner repair" },
    { name: "Refrigerator", icon: "🧊", description: "Fridge repair & servicing" },
    { name: "TV", icon: "📺", description: "Television repair services" },
    { name: "Washing Machine", icon: "🫧", description: "Washing machine repair" },
    { name: "Electrical", icon: "⚡", description: "Electrical wiring & repair" },
];

export default function PopularCategories() {
    return (
        <section className="bg-zinc-50 px-6 py-20 dark:bg-black">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-12 text-center">
                    <span className="font-semibold uppercase tracking-wider text-orange-500">
                        Explore Categories
                    </span>

                    <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white md:text-4xl">
                        Popular <span className="text-orange-500">Categories</span>
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
                        Find the right repair service for your devices and home appliances.
                    </p>
                </div>

                {/* Category Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={`/services?category=${encodeURIComponent(category.name)}`}
                            className="group min-w-0 rounded-2xl border border-zinc-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-2 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900"
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition group-hover:bg-orange-500 dark:bg-orange-500/10">
                                {category.icon}
                            </div>

                            <h3 className="mt-5 break-words text-lg font-bold text-zinc-900 transition group-hover:text-orange-500 dark:text-white">
                                {category.name}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                {category.description}
                            </p>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}
