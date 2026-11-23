"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient, signIn, useSession } from "@/lib/auth-client";
import { getDashboardPathByRole } from "@/lib/constants";

function getSafeRedirect(raw: string | null): string | null {
    if (!raw || typeof raw !== "string") return null;
    if (!raw.startsWith("/") || raw.startsWith("//")) return null;
    if (raw.startsWith("/sign-in") || raw.startsWith("/sign-up")) return null;
    return raw;
}

function SignInContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, isPending } = useSession();

    const redirectParam = getSafeRedirect(
        searchParams.get("redirect") || searchParams.get("callbackUrl")
    );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isPending || !session?.user) return;

        const userRole = (session.user as { role?: string }).role;
        router.replace(redirectParam || getDashboardPathByRole(userRole));
    }, [isPending, session, redirectParam, router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            const msg = "Please enter both email and password.";
            setError(msg);
            toast.error(msg);
            return;
        }

        setLoading(true);

        try {
            const result = await signIn.email({
                email: email.trim(),
                password,
            });

            if (result.error) {
                const msg =
                    result.error.message || "Invalid email or password.";
                setError(msg);
                toast.error(msg);
                return;
            }

            const sessionResult = await authClient.getSession();
            const signedInRole = (
                sessionResult.data?.user as { role?: string } | undefined
            )?.role;

            toast.success("Signed in successfully!");
            router.push(redirectParam || getDashboardPathByRole(signedInRole));
            router.refresh();
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-zinc-300 bg-white/90 px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-black/80 dark:text-white dark:placeholder:text-zinc-600";

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-100 px-4 py-16 text-zinc-900 dark:bg-black dark:text-white">
            {/* Background Grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(249,115,22,0.15) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(249,115,22,0.15) 1px, transparent 1px)
                    `,
                    backgroundSize: "45px 45px",
                }}
            />

            {/* Background Radial Light */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 dark:hidden"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 20%, rgba(255,255,255,0.65) 100%)",
                }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden dark:block"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.85) 100%)",
                }}
            />

            {/* Glows */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-orange-600/20 blur-[130px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-1/3 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[130px]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 left-1/4 h-[450px] w-[600px] rounded-full bg-blue-700/20 blur-[140px]"
            />

            {/* Sign In Content */}
            <div className="relative z-10 mx-auto w-full max-w-md">
                {/* Brand */}
                <div className="mb-8 text-center">
                    <Link
                        href="/"
                        className="text-4xl font-extrabold tracking-tight"
                    >
                        Fix<span className="text-orange-500">Mate</span>
                    </Link>

                    <p className="mt-3 text-xs font-semibold tracking-[0.3em] text-orange-500">
                        YOUR TRUSTED REPAIR PARTNER
                    </p>

                    <h1 className="mt-6 text-3xl font-bold text-zinc-900 dark:text-white">
                        Welcome Back!
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Sign in to continue to your FixMate account.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-orange-500/30 bg-white/95 p-6 shadow-[0_0_50px_rgba(249,115,22,0.12)] backdrop-blur-xl dark:bg-zinc-950/95 sm:p-8">
                    <div className="mb-7 h-1 w-20 rounded-full bg-gradient-to-r from-orange-600 to-orange-300" />

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="signin-email"
                                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                            >
                                Email Address
                            </label>

                            <input
                                id="signin-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                autoComplete="email"
                                className={inputClass}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="signin-password"
                                className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="signin-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className={`${inputClass} pr-16`}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-zinc-500 transition hover:text-orange-500 dark:text-zinc-400"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                role="alert"
                                className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
                            >
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg border border-orange-400/30 bg-gradient-to-r from-orange-600 to-orange-500 py-3 font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.2)] transition duration-300 hover:from-orange-500 hover:to-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <div className="my-6 border-t border-zinc-200 dark:border-zinc-800" />

                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/sign-up"
                            className="font-semibold text-orange-500 transition hover:text-orange-400"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>

                {/* Bottom Text */}
                <p className="mt-7 text-center text-xs text-zinc-500">
                    © 2026 FixMate. All rights reserved.
                </p>
            </div>
        </main>
    );
}

export default function SignInPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-orange-500 dark:bg-black">
                    Loading...
                </div>
            }
        >
            <SignInContent />
        </Suspense>
    );
}
