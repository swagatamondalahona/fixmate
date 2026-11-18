
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
        <footer className="bg-zinc-950 text-zinc-300">
            <div className="mx-auto max-w-7xl px-6 py-16">

                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3">
                            <Image
                                src="/fixmatelogo.png"
                                alt="FixMate Logo"
                                width={150}
                                height={50}
                                className="w-36 h-auto"
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
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                            >
                                f
                            </a>

                            <a
                                href="https://www.instagram.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                            >
                                ◎
                            </a>

                            <a
                                href="https://x.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="X"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-sm font-bold transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
                            >
                                𝕏
                            </a>

                            <a
                                href="https://www.linkedin.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 text-sm font-bold transition hover:border-orange-500 hover:bg-orange-500 hover:text-white"
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
                                        className="text-sm transition hover:text-orange-500"
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
                                        className="text-sm transition hover:text-orange-500"
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
                            <li className="flex items-start gap-3">
                                <span className="text-lg text-orange-500">✉</span>
                                <span className="break-all">
                                    support@fixmate.com
                                </span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-lg text-orange-500">☎</span>
                                <span>+880 1XXXXXXXXX</span>
                            </li>

                            <li className="flex items-start gap-3">
                                <span className="text-lg text-orange-500">📍</span>
                                <span>Dhaka, Bangladesh</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Bottom Footer */}
                <div className="mt-14 border-t border-zinc-800 pt-7">
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
