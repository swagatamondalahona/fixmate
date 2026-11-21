
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signIn } from "@/lib/auth-client";

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await signIn.email({
                email,
                password,
            });

            if (result.error) {
                setError(
                    result.error.message || "Invalid email or password."
                );
                return;
            }

            router.push("/");
            router.refresh();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
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

            {/* Orange Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-orange-600/20 blur-[130px]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-1/3 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[130px]"
            />

            {/* Blue Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-40 left-1/4 h-[450px] w-[600px] rounded-full bg-blue-700/20 blur-[140px]"
            />

            {/* Left Circuit */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-16 hidden h-64 w-[380px] text-orange-500/40 md:block"
                viewBox="0 0 380 260"
                fill="none"
            >
                <path
                    d="M0 35H90L130 75H230L270 35H380"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M0 100H55L100 145H180"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M0 185H120L160 225H290"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="230" cy="75" r="5" fill="currentColor" />
                <circle cx="180" cy="145" r="5" fill="currentColor" />
                <circle cx="290" cy="225" r="5" fill="currentColor" />
            </svg>

            {/* Right Circuit */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-20 hidden h-64 w-[380px] text-blue-400/40 md:block"
                viewBox="0 0 380 260"
                fill="none"
            >
                <path
                    d="M380 35H290L250 75H150L110 35H0"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M380 100H325L280 145H200"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M380 185H260L220 225H90"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <circle cx="150" cy="75" r="5" fill="currentColor" />
                <circle cx="200" cy="145" r="5" fill="currentColor" />
                <circle cx="90" cy="225" r="5" fill="currentColor" />
            </svg>

            {/* Wrench Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 bottom-10 h-64 w-64 -rotate-12 text-orange-500/10"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>

            {/* Gear Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -right-10 h-80 w-80 text-blue-400/10"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>

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

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* Email */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                Email Address
                            </label>

                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                className={inputClass}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200">
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className={`${inputClass} pr-12`}
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
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-orange-500 dark:text-zinc-400"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M3 3l18 18" />
                                            <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                            <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 9 4 10 7-.4 1.1-1.2 2.2-2.2 3.2" />
                                            <path d="M6.2 6.2C3.8 7.5 2.4 9.6 2 12c1 3 5 7 10 7 1 0 2-.2 2.9-.5" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
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
