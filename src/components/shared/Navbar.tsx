
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
];

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [isSigningOut, setIsSigningOut] = useState(false);

    const { data: session, isPending } = useSession();

    const userRole = (
        session?.user as { role?: string } | undefined
    )?.role?.toLowerCase();

    const dashboardPath =
        userRole === "admin"
            ? "/dashboard/admin"
            : userRole === "technician"
                ? "/dashboard/technician"
                : userRole === "customer"
                    ? "/dashboard/customer"
                    : "/dashboard/profile";

    useEffect(() => {
        const savedTheme = localStorage.getItem("fixmate-theme");

        if (savedTheme === "light" || savedTheme === "dark") {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("fixmate-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) => current === "dark" ? "light" : "dark");
    };

    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);
            await authClient.signOut();

            setIsMenuOpen(false);
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Sign out error:", error);
            alert("Unable to sign out. Please try again.");
        } finally {
            setIsSigningOut(false);
        }
    };

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

                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle color theme"
                        title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        className="rounded-lg border border-white/20 px-3 py-2 text-lg text-white transition-colors hover:border-orange-500 hover:text-orange-500"
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>

                    {isPending ? (
                        <span className="text-sm text-gray-400">
                            Loading...
                        </span>
                    ) : session ? (
                        <>
                            <Link
                                href={dashboardPath}
                                className="text-sm font-semibold text-white transition-colors hover:text-orange-500"
                            >
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:bg-orange-600 disabled:opacity-50"
                            >
                                {isSigningOut ? "Signing Out..." : "Sign Out"}
                            </button>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
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

                        {/* Mobile Theme Toggle */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex items-center gap-3 border-t border-white/10 pt-5 text-left text-sm font-semibold text-white hover:text-orange-500"
                        >
                            <span className="text-xl">
                                {theme === "dark" ? "☀️" : "🌙"}
                            </span>
                            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        </button>

                        <div className="flex flex-wrap items-center gap-5 border-t border-white/10 pt-5">

                            {isPending ? (
                                <span className="text-sm text-gray-400">
                                    Loading...
                                </span>
                            ) : session ? (
                                <>
                                    <Link
                                        href={dashboardPath}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-sm font-semibold text-white hover:text-orange-500"
                                    >
                                        Dashboard
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        disabled={isSigningOut}
                                        className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                                    >
                                        {isSigningOut ? "Signing Out..." : "Sign Out"}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/sign-in"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-sm font-semibold text-white hover:text-orange-500"
                                    >
                                        Sign In
                                    </Link>

                                    <Link
                                        href="/sign-up"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
