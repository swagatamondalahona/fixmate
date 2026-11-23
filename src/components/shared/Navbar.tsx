"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { getDashboardPathByRole } from "@/lib/constants";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
];

type Theme = "dark" | "light";

type SessionUser = {
    name?: string;
    email?: string;
    role?: string;
    image?: string | null;
};

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>("dark");
    const [isSigningOut, setIsSigningOut] = useState(false);

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const { data: session, isPending } = useSession();

    const user = session?.user as SessionUser | undefined;
    const userRole = user?.role?.toLowerCase() || "customer";
    const displayName = user?.name || "FixMate User";
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const dashboardPath = getDashboardPathByRole(userRole);

    // Load saved theme and apply it globally
    useEffect(() => {
        const savedTheme = localStorage.getItem("fixmate-theme");

        const initialTheme: Theme =
            savedTheme === "light" || savedTheme === "dark"
                ? savedTheme
                : "dark";

        setTheme(initialTheme);

        document.documentElement.setAttribute("data-theme", initialTheme);
        localStorage.setItem("fixmate-theme", initialTheme);
    }, []);

    // Close dropdown on outside click or Escape key
    useEffect(() => {
        if (!isProfileOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isProfileOpen]);

    // Toggle theme globally
    const toggleTheme = () => {
        const newTheme: Theme = theme === "dark" ? "light" : "dark";

        setTheme(newTheme);

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("fixmate-theme", newTheme);
    };

    // Sign Out
    const handleSignOut = async () => {
        try {
            setIsSigningOut(true);

            await authClient.signOut();

            setIsProfileOpen(false);
            setIsMenuOpen(false);
            toast.success("Signed out successfully.");
            router.push("/");
            router.refresh();
        } catch (error) {
            console.error("Sign out error:", error);
            toast.error("Unable to sign out. Please try again.");
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white text-zinc-900 transition-colors duration-200 dark:border-white/10 dark:bg-black dark:text-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src="/fixmatelogo.png"
                        alt="FixMate"
                        className="h-14 w-10 object-contain"
                    />

                    <span className="text-2xl font-extrabold">
                        <span className="text-zinc-900 dark:text-white">
                            Fix
                        </span>
                        <span className="text-orange-500">Mate</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {navLinks.map((link) => {
                        const active =
                            link.href === "/"
                                ? pathname === "/"
                                : pathname === link.href ||
                                  pathname.startsWith(`${link.href}/`);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`relative py-2 text-sm font-medium transition-colors duration-200 hover:text-orange-500 ${
                                    active
                                        ? "text-orange-500"
                                        : "text-zinc-700 dark:text-white"
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

                {/* Desktop Auth & Theme */}
                <div className="hidden items-center gap-4 md:flex">
                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label="Toggle color theme"
                        title={
                            theme === "dark"
                                ? "Switch to Light Mode"
                                : "Switch to Dark Mode"
                        }
                        className="rounded-lg border border-zinc-300 px-3 py-2 text-lg text-zinc-800 transition-colors hover:border-orange-500 hover:text-orange-500 dark:border-white/20 dark:text-white"
                    >
                        {theme === "dark" ? "☀️" : "🌙"}
                    </button>

                    {isPending ? (
                        <span className="text-sm text-zinc-500 dark:text-gray-400">
                            Loading...
                        </span>
                    ) : session ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                onClick={() =>
                                    setIsProfileOpen((previous) => !previous)
                                }
                                aria-label="Open user menu"
                                aria-expanded={isProfileOpen}
                                className="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-zinc-50 p-1 pr-3 transition hover:border-orange-500 dark:border-white/15 dark:bg-zinc-900"
                            >
                                {user?.image ? (
                                    <img
                                        src={user.image}
                                        alt={displayName}
                                        className="h-9 w-9 rounded-full border border-orange-500/40 object-cover"
                                    />
                                ) : (
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/15 text-xs font-bold text-orange-600 dark:text-orange-400">
                                        {initials}
                                    </span>
                                )}

                                <span className="max-w-28 truncate text-sm font-semibold text-zinc-800 dark:text-white">
                                    {displayName}
                                </span>

                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    ▾
                                </span>
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111111]">
                                    {/* User Info */}
                                    <div className="border-b border-zinc-200 px-4 py-4 dark:border-white/10">
                                        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                                            {displayName}
                                        </p>

                                        {user?.email && (
                                            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                                                {user.email}
                                            </p>
                                        )}

                                        <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-orange-600 dark:text-orange-400">
                                            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                            {userRole}
                                        </span>
                                    </div>

                                    {/* Links */}
                                    <div className="p-2">
                                        <Link
                                            href={dashboardPath}
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-orange-500/10 hover:text-orange-600 dark:text-zinc-200 dark:hover:text-orange-400"
                                        >
                                            <span>⌂</span>
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() =>
                                                setIsProfileOpen(false)
                                            }
                                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-orange-500/10 hover:text-orange-600 dark:text-zinc-200 dark:hover:text-orange-400"
                                        >
                                            <span>✎</span>
                                            Update Profile
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            disabled={isSigningOut}
                                            className="mt-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-500/10 disabled:opacity-50 dark:text-red-400"
                                        >
                                            <span>↪</span>
                                            {isSigningOut
                                                ? "Signing Out..."
                                                : "Sign Out"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/sign-in"
                                className="text-sm font-semibold text-zinc-800 transition-colors hover:text-orange-500 dark:text-white"
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
                    className="text-2xl text-zinc-900 transition-colors hover:text-orange-500 dark:text-white md:hidden"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>
            </nav>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="border-t border-zinc-200 bg-white px-5 py-5 dark:border-white/10 dark:bg-black md:hidden">
                    <div className="flex flex-col gap-5">
                        {navLinks.map((link) => {
                            const active =
                                link.href === "/"
                                    ? pathname === "/"
                                    : pathname === link.href ||
                                      pathname.startsWith(`${link.href}/`);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                                        active
                                            ? "text-orange-500"
                                            : "text-zinc-700 dark:text-white"
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
                            className="flex items-center gap-3 border-t border-zinc-200 pt-5 text-left text-sm font-semibold text-zinc-800 hover:text-orange-500 dark:border-white/10 dark:text-white"
                        >
                            <span className="text-xl">
                                {theme === "dark" ? "☀️" : "🌙"}
                            </span>

                            {theme === "dark"
                                ? "Switch to Light Mode"
                                : "Switch to Dark Mode"}
                        </button>

                        <div className="border-t border-zinc-200 pt-5 dark:border-white/10">
                            {isPending ? (
                                <span className="text-sm text-zinc-500 dark:text-gray-400">
                                    Loading...
                                </span>
                            ) : session ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        {user?.image ? (
                                            <img
                                                src={user.image}
                                                alt={displayName}
                                                className="h-10 w-10 rounded-full border border-orange-500/40 object-cover"
                                            />
                                        ) : (
                                            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/15 text-sm font-bold text-orange-600 dark:text-orange-400">
                                                {initials}
                                            </span>
                                        )}

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                                                {displayName}
                                            </p>

                                            <span className="inline-block rounded-full bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold capitalize text-orange-600 dark:text-orange-400">
                                                {userRole}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <Link
                                            href={dashboardPath}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-sm font-semibold text-zinc-800 hover:text-orange-500 dark:text-white"
                                        >
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/dashboard/profile"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-sm font-semibold text-zinc-800 hover:text-orange-500 dark:text-white"
                                        >
                                            Update Profile
                                        </Link>

                                        <button
                                            type="button"
                                            onClick={handleSignOut}
                                            disabled={isSigningOut}
                                            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                                        >
                                            {isSigningOut
                                                ? "Signing Out..."
                                                : "Sign Out"}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-wrap items-center gap-5">
                                    <Link
                                        href="/sign-in"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-sm font-semibold text-zinc-800 hover:text-orange-500 dark:text-white"
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
