import Image from "next/image";
import Link from "next/link";

const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
];

const categories = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-orange-500/20 bg-black text-zinc-300 shadow-[0_-15px_50px_rgba(0,0,0,0.9)]">
            {/* Subtle Tech Grid Pattern Background */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(#71717a 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* Ambient Dark Orange & Blue Glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-32 left-1/4 h-56 w-[30rem] rounded-full bg-orange-600/10 blur-[120px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 right-1/4 h-64 w-[30rem] rounded-full bg-blue-950/20 blur-[120px]"
            />

            {/* 1. Top-Left Circuit & Microchip Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-4 h-44 w-80 select-none text-zinc-600 opacity-[0.08]"
                viewBox="0 0 320 160"
                fill="none"
            >
                <path
                    d="M0 30H95L125 60H210"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="210" cy="60" r="4.5" fill="currentColor" />
                <path
                    d="M0 85H65L95 115H165"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="165" cy="115" r="4.5" fill="currentColor" />
            </svg>

            {/* 2. Top-Right Extended Circuit Trace Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-4 h-52 w-[28rem] select-none text-zinc-600 opacity-[0.09]"
                viewBox="0 0 440 200"
                fill="none"
            >
                <path
                    d="M440 25H290L255 60H120"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="120" cy="60" r="5" fill="currentColor" />
                <path
                    d="M440 75H330L295 110H185"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="185" cy="110" r="5" fill="currentColor" />
                <path
                    d="M440 130H360L335 155H245"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="245" cy="155" r="4.5" fill="currentColor" />
            </svg>

            {/* 3. Center-Top Subtle Wrench Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 -rotate-12 select-none text-orange-500 opacity-[0.04]"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>

            {/* 4. Bottom-Left Double Interlocking Gears Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 left-8 h-80 w-80 select-none text-zinc-600 opacity-[0.07] md:left-28"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute bottom-20 left-64 hidden h-48 w-48 select-none text-orange-500 opacity-[0.06] sm:block md:left-80"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>

            {/* 5. Bottom-Right Gear & Circuit Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-12 right-6 h-64 w-64 select-none text-zinc-600 opacity-[0.06]"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>

            <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <Image
                                src="/fixmatelogo.png"
                                alt="FixMate Logo"
                                width={150}
                                height={50}
                                className="h-auto w-36"
                            />
                            <span className="text-2xl font-extrabold text-white">
                                Fix<span className="text-orange-500">Mate</span>
                            </span>
                        </Link>

                        <p className="mt-5 max-w-xs text-sm leading-7 text-zinc-400">
                            Your trusted partner for smart device and home appliance
                            repair services. Find reliable technicians with FixMate.
                        </p>

                        {/* Social Links */}
                        <div className="mt-6 flex gap-3">
                            <a
                                href="https://www.facebook.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 shadow-[0_0_15px_rgba(255,107,0,0.1)] transition duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                            >
                                f
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 shadow-[0_0_15px_rgba(255,107,0,0.1)] transition duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                            >
                                ◎
                            </a>

                            <a
                                href="https://x.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-sm font-bold shadow-[0_0_15px_rgba(255,107,0,0.1)] transition duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                            >
                                𝕏
                            </a>

                            <a
                                href="https://www.linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/90 text-sm font-bold shadow-[0_0_15px_rgba(255,107,0,0.1)] transition duration-300 hover:border-orange-500 hover:bg-orange-500 hover:text-white hover:shadow-[0_0_20px_rgba(255,107,0,0.4)]"
                            >
                                in
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Quick Links
                        </h3>

                        <ul className="mt-6 space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-zinc-400 transition hover:text-orange-500"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Popular Categories
                        </h3>

                        <ul className="mt-6 space-y-4">
                            {categories.map((category) => (
                                <li key={category}>
                                    <Link
                                        href={`/services?category=${encodeURIComponent(category)}`}
                                        className="text-sm text-zinc-400 transition hover:text-orange-500"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-bold text-white">
                            Contact Us
                        </h3>

                        <ul className="mt-6 space-y-5 text-sm">
                            <li className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-base text-orange-500">
                                    ✉
                                </span>
                                <span className="break-all text-zinc-300">
                                    support@fixmate.com
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-base text-orange-500">
                                    ☎
                                </span>
                                <span className="text-zinc-300">+880 1XXXXXXXXX</span>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-orange-500/20 bg-orange-500/10 text-base text-orange-500">
                                    📍
                                </span>
                                <span className="text-zinc-300">Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="mt-14 border-t border-zinc-900 pt-7">
                    <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
                        <p className="text-sm text-zinc-500">
                            © 2026 FixMate. All rights reserved.
                        </p>

                        <p className="text-sm text-zinc-500">
                            Made with <span className="text-orange-500">♥</span> for better repair services.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}