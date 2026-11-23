"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signUp, useSession } from "@/lib/auth-client";
import { getDashboardPathByRole } from "@/lib/constants";

type FieldErrors = {
    name?: string;
    email?: string;
    password?: string;
};

function validatePassword(value: string): string[] {
    const errors: string[] = [];

    if (value.length < 6) {
        errors.push("At least 6 characters");
    }

    if (!/[A-Z]/.test(value)) {
        errors.push("At least one uppercase letter");
    }

    if (!/[a-z]/.test(value)) {
        errors.push("At least one lowercase letter");
    }

    return errors;
}

export default function SignUpPage() {
    const router = useRouter();
    const { data: session, isPending } = useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<"customer" | "technician">("customer");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isPending || !session?.user) return;

        const existingRole = (session.user as { role?: string }).role;
        router.replace(getDashboardPathByRole(existingRole));
    }, [isPending, session, router]);

    const passwordIssues = password ? validatePassword(password) : [];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const nextErrors: FieldErrors = {};

        if (!name.trim()) {
            nextErrors.name = "Full name is required.";
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailPattern.test(email.trim())) {
            nextErrors.email = "Please enter a valid email address.";
        }

        const pwErrors = validatePassword(password);
        if (pwErrors.length > 0) {
            nextErrors.password = `Password must contain: ${pwErrors.join(", ")}.`;
        }

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            toast.error("Please fix the form validation errors.");
            return;
        }

        setFieldErrors({});
        setLoading(true);

        try {
            const safeRole = role === "technician" ? "technician" : "customer";

            const result = await signUp.email({
                name: name.trim(),
                email: email.trim(),
                password,
                ...{ role: safeRole },
            });

            if (result.error) {
                const msg = result.error.message || "Registration failed.";
                setError(msg);
                toast.error(msg);
                return;
            }

            toast.success("Account created successfully! Welcome to FixMate.");
            router.push(getDashboardPathByRole(safeRole));
            router.refresh();
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Something went wrong.";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-lg border border-zinc-300 bg-white/90 px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-black/80 dark:text-white dark:placeholder:text-zinc-600";

    const labelClass =
        "mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-200";

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

            {/* Main Content */}
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
                        Create Your Account
                    </h1>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                        Join FixMate and get started today.
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-2xl border border-orange-500/30 bg-white/95 p-6 shadow-[0_0_50px_rgba(249,115,22,0.12)] backdrop-blur-xl dark:bg-zinc-950/95 sm:p-8">
                    <div className="mb-7 h-1 w-20 rounded-full bg-gradient-to-r from-orange-600 to-orange-300" />

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">
                        {/* Name */}
                        <div>
                            <label htmlFor="signup-name" className={labelClass}>
                                Full Name
                            </label>

                            <input
                                id="signup-name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (fieldErrors.name) {
                                        setFieldErrors((prev) => ({
                                            ...prev,
                                            name: undefined,
                                        }));
                                    }
                                }}
                                placeholder="Enter your full name"
                                className={inputClass}
                            />

                            {fieldErrors.name && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="signup-email" className={labelClass}>
                                Email Address
                            </label>

                            <input
                                id="signup-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (fieldErrors.email) {
                                        setFieldErrors((prev) => ({
                                            ...prev,
                                            email: undefined,
                                        }));
                                    }
                                }}
                                placeholder="Enter your email"
                                autoComplete="email"
                                className={inputClass}
                            />

                            {fieldErrors.email && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="signup-password" className={labelClass}>
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="signup-password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (fieldErrors.password) {
                                            setFieldErrors((prev) => ({
                                                ...prev,
                                                password: undefined,
                                            }));
                                        }
                                    }}
                                    placeholder="Min 6 chars, uppercase & lowercase"
                                    autoComplete="new-password"
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
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>

                            {fieldErrors.password && (
                                <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                                    {fieldErrors.password}
                                </p>
                            )}

                            <ul className="mt-2 space-y-1 text-xs">
                                <li
                                    className={
                                        password.length >= 6
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-zinc-500 dark:text-zinc-400"
                                    }
                                >
                                    {password.length >= 6 ? "✓" : "•"} At least
                                    6 characters
                                </li>
                                <li
                                    className={
                                        /[A-Z]/.test(password)
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-zinc-500 dark:text-zinc-400"
                                    }
                                >
                                    {/[A-Z]/.test(password) ? "✓" : "•"} At
                                    least one uppercase letter
                                </li>
                                <li
                                    className={
                                        /[a-z]/.test(password)
                                            ? "text-green-600 dark:text-green-400"
                                            : "text-zinc-500 dark:text-zinc-400"
                                    }
                                >
                                    {/[a-z]/.test(password) ? "✓" : "•"} At
                                    least one lowercase letter
                                </li>
                            </ul>
                        </div>

                        {/* Role Selection Cards */}
                        <div>
                            <span className={labelClass}>Register As</span>

                            <div className="grid grid-cols-2 gap-3">
                                {([
                                    {
                                        value: "customer",
                                        title: "Customer",
                                        subtitle: "Book repair services",
                                    },
                                    {
                                        value: "technician",
                                        title: "Technician",
                                        subtitle: "Offer repair services",
                                    },
                                ] as const).map((option) => {
                                    const selected = role === option.value;

                                    return (
                                        <label
                                            key={option.value}
                                            className={`cursor-pointer rounded-xl border p-3.5 transition ${
                                                selected
                                                    ? "border-orange-500 bg-orange-500/10"
                                                    : "border-zinc-300 bg-white hover:border-orange-500/40 dark:border-zinc-800 dark:bg-black/60"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={option.value}
                                                checked={selected}
                                                onChange={() =>
                                                    setRole(option.value)
                                                }
                                                className="sr-only"
                                            />

                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                                                    {option.title}
                                                </span>

                                                <span
                                                    className={`h-4 w-4 rounded-full border-2 ${
                                                        selected
                                                            ? "border-orange-500 bg-orange-500"
                                                            : "border-zinc-400 dark:border-zinc-600"
                                                    }`}
                                                />
                                            </div>

                                            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                                                {option.subtitle}
                                            </p>
                                        </label>
                                    );
                                })}
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
                            disabled={
                                loading ||
                                (Boolean(password) && passwordIssues.length > 0)
                            }
                            className="w-full rounded-lg border border-orange-400/30 bg-gradient-to-r from-orange-600 to-orange-500 py-3 font-bold text-white shadow-[0_0_20px_rgba(249,115,22,0.2)] transition duration-300 hover:from-orange-500 hover:to-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="my-6 border-t border-zinc-200 dark:border-zinc-800" />

                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-semibold text-orange-500 transition hover:text-orange-400"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="mt-7 text-center text-xs text-zinc-500">
                    © 2026 FixMate. All rights reserved.
                </p>
            </div>
        </main>
    );
}
