
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

type UserInfo = {
    name?: string;
    email?: string;
    role?: string;
    image?: string;
};

const menus: Record<
    string,
    { label: string; href: string; icon: string }[]
> = {
    admin: [
        { label: "Overview", href: "/dashboard/admin", icon: "⌂" },
        { label: "Manage Users", href: "/dashboard/admin/users", icon: "♙" },
        { label: "Manage Services", href: "/dashboard/admin/services", icon: "⚒" },
        { label: "Manage Bookings", href: "/dashboard/admin/bookings", icon: "▤" },
        { label: "Transactions", href: "/dashboard/admin/transactions", icon: "＄" },
    ],
    customer: [
        { label: "Overview", href: "/dashboard/customer", icon: "⌂" },
        { label: "My Bookings", href: "/dashboard/customer/bookings", icon: "▤" },
        { label: "Payment History", href: "/dashboard/customer/payments", icon: "＄" },
    ],
    technician: [
        { label: "Overview", href: "/dashboard/technician", icon: "⌂" },
        { label: "Add Service", href: "/dashboard/technician/add-service", icon: "+" },
        { label: "My Services", href: "/dashboard/technician/my-services", icon: "⚒" },
        { label: "Service Requests", href: "/dashboard/technician/requests", icon: "▤" },
    ],
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [signingOut, setSigningOut] = useState(false);

    const user = session?.user as UserInfo | undefined;
    const role = user?.role?.toLowerCase() || "";

    useEffect(() => {
        if (isPending) return;

        if (!session) {
            router.replace("/sign-in");
            return;
        }

        if (
            role &&
            ["admin", "customer", "technician"].includes(role)
        ) {
            const rolePath = `/dashboard/${role}`;

            if (
                pathname.startsWith("/dashboard/admin") &&
                role !== "admin"
            ) {
                router.replace(rolePath);
            } else if (
                pathname.startsWith("/dashboard/customer") &&
                role !== "customer"
            ) {
                router.replace(rolePath);
            } else if (
                pathname.startsWith("/dashboard/technician") &&
                role !== "technician"
            ) {
                router.replace(rolePath);
            }
        }
    }, [isPending, session, role, pathname, router]);

    const handleSignOut = async () => {
        try {
            setSigningOut(true);
            await authClient.signOut();
            router.replace("/sign-in");
            router.refresh();
        } catch (error) {
            console.error("Sign out failed:", error);
            setSigningOut(false);
        }
    };

    if (isPending || !session || !role) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-orange-500" />
                    <p className="mt-4 text-sm text-gray-400">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    const roleMenus = menus[role];

    if (!roleMenus) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black text-white">
                <p>Invalid user role. Please contact administrator.</p>
            </div>
        );
    }

    const displayName = user?.name || "FixMate User";
    const initials = displayName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="relative flex min-h-screen overflow-hidden bg-[#080808] text-white">
            {/* Background Watermark */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed bottom-0 right-0 z-0 select-none text-[320px] font-black leading-none text-white/[0.015]"
            >
                ⚙
            </div>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setMobileMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0d0d0d] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-3"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <img
                            src="/fixmatelogo.png"
                            alt="FixMate"
                            className="h-12 w-9 object-contain"
                        />
                        <span className="text-2xl font-extrabold">
                            Fix<span className="text-orange-500">Mate</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-xl text-gray-400 hover:text-orange-500 lg:hidden"
                        aria-label="Close menu"
                    >
                        ✕
                    </button>
                </div>

                {/* Role */}
                <div className="px-6 py-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Workspace
                    </p>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5">
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        <span className="text-xs font-bold capitalize text-orange-400">
                            {role} Panel
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 overflow-y-auto px-4 pb-6">
                    <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                        Menu
                    </p>

                    {roleMenus.map((item) => {
                        const active =
                            pathname === item.href ||
                            (item.href !== `/dashboard/${role}` &&
                                pathname.startsWith(`${item.href}/`));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all ${active
                                        ? "border border-orange-500/20 bg-orange-500/10 text-orange-400"
                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className="w-6 text-center text-lg">
                                    {item.icon}
                                </span>
                                {item.label}
                                {active && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-orange-500" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="border-t border-white/10 p-5">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition hover:bg-white/5 hover:text-orange-400"
                    >
                        <span className="text-lg">←</span>
                        Back to Website
                    </Link>
                </div>
            </aside>

            {/* Main Dashboard */}
            <div className="relative z-10 flex min-w-0 flex-1 flex-col">
                {/* Topbar */}
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0b0b0b]/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open sidebar"
                            className="rounded-lg border border-white/10 px-3 py-2 text-xl text-white hover:border-orange-500 hover:text-orange-500 lg:hidden"
                        >
                            ☰
                        </button>

                        <div>
                            <p className="text-xs text-gray-500">
                                FixMate Dashboard
                            </p>
                            <h1 className="text-sm font-bold capitalize text-white sm:text-base">
                                {role} Panel
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-5">
                        <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-3"
                        >
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={displayName}
                                    className="h-10 w-10 rounded-full border border-orange-500/40 object-cover"
                                />
                            ) : (
                                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-sm font-bold text-orange-400">
                                    {initials}
                                </span>
                            )}

                            <span className="hidden text-left sm:block">
                                <span className="block max-w-36 truncate text-sm font-semibold text-white">
                                    {displayName}
                                </span>
                                <span className="block text-xs capitalize text-gray-500">
                                    {role}
                                </span>
                            </span>
                        </Link>

                        <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:border-orange-500 hover:text-orange-400 disabled:opacity-50 sm:px-4 sm:text-sm"
                        >
                            {signingOut ? "Signing Out..." : "Sign Out"}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="w-full flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
