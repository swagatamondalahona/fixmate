
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },

];

export default function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/fixmatelogo.png"
                        alt="FixMate"
                        className="h-16 w-10 object-contain"
                    />

                    <span className="text-2xl font-extrabold">
                        <span className="text-white">Fix</span>
                        <span className="text-orange-500">Mate</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => {
                        const active = pathname === link.href;

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative py-2 text-sm font-medium transition-colors duration-200 hover:text-orange-500 ${active ? "text-orange-500" : "text-white"
                                    }`}
                            >
                                {link.name}

                                {active && (
                                    <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-orange-500" />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop Auth Buttons */}
                <div className="hidden items-center gap-5 md:flex">
                    <Link
                        href="/sign-in"
                        className="text-sm font-semibold text-white transition-colors hover:text-orange-500"
                    >
                        Sign In
                    </Link>

                    <Link
                        href="/sign-up"
                        className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-orange-600"
                    >
                        Sign Up
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMenuOpen}
                    className="text-2xl text-white transition-colors hover:text-orange-500 md:hidden"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </nav>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="border-t border-white/10 bg-black px-5 py-5 md:hidden">
                    <div className="flex flex-col gap-5">
                        {navLinks.map((link) => {
                            const active = pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-sm font-medium transition-colors hover:text-orange-500 ${active ? "text-orange-500" : "text-white"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        <div className="flex items-center gap-5 border-t border-white/10 pt-5">
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-sm font-semibold text-white hover:text-orange-500"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                onClick={() => setIsMenuOpen(false)}
                                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
