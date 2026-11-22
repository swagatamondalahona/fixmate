
import Link from "next/link";

export default function NotFound() {
    return (
        <main className="relative isolate flex min-h-[75vh] items-center justify-center overflow-hidden bg-zinc-100 px-4 py-16 text-zinc-900 dark:bg-black dark:text-white">

            {/* Background Grid */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
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
                className="pointer-events-none absolute inset-0 -z-10 dark:hidden"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 20%, rgba(255,255,255,0.65) 100%)",
                }}
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
                style={{
                    background:
                        "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.85) 100%)",
                }}
            />

            {/* Orange Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-32 -top-32 -z-10 h-[500px] w-[500px] rounded-full bg-orange-600/20 blur-[130px]"
            />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-40 top-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-orange-500/10 blur-[130px]"
            />

            {/* Left Circuit */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-16 -z-10 hidden h-64 w-[380px] text-orange-500/40 md:block"
                viewBox="0 0 380 260"
                fill="none"
            >
                <path d="M0 35H90L130 75H230L270 35H380" stroke="currentColor" strokeWidth="2" />
                <path d="M0 100H55L100 145H180" stroke="currentColor" strokeWidth="2" />
                <path d="M0 185H120L160 225H290" stroke="currentColor" strokeWidth="2" />
                <circle cx="230" cy="75" r="5" fill="currentColor" />
                <circle cx="180" cy="145" r="5" fill="currentColor" />
                <circle cx="290" cy="225" r="5" fill="currentColor" />
            </svg>

            {/* Right Circuit */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-20 -z-10 hidden h-64 w-[380px] text-blue-400/40 md:block"
                viewBox="0 0 380 260"
                fill="none"
            >
                <path d="M380 35H290L250 75H150L110 35H0" stroke="currentColor" strokeWidth="2" />
                <path d="M380 100H325L280 145H200" stroke="currentColor" strokeWidth="2" />
                <path d="M380 185H260L220 225H90" stroke="currentColor" strokeWidth="2" />
                <circle cx="150" cy="75" r="5" fill="currentColor" />
                <circle cx="200" cy="145" r="5" fill="currentColor" />
                <circle cx="90" cy="225" r="5" fill="currentColor" />
            </svg>

            {/* Wrench Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute -left-10 bottom-10 -z-10 h-64 w-64 -rotate-12 text-orange-500/10"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
            </svg>

            {/* Gear Watermark */}
            <svg
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-16 -right-10 -z-10 h-80 w-80 text-blue-400/10"
                viewBox="0 0 24 24"
                fill="currentColor"
            >
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.56 1.13-.94 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
            </svg>

            {/* 404 Content */}
            <div className="relative z-10 mx-auto w-full max-w-lg text-center">

                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-orange-500">
                    FixMate
                </p>

                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-5xl">
                    🔧
                </div>

                <h1 className="text-7xl font-extrabold tracking-tight">
                    404
                </h1>

                <h2 className="my-4 text-2xl font-bold">
                    Page Not Found
                </h2>

                <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                    Oops! The page you are looking for may have been moved,
                    removed, or is temporarily unavailable.
                    Let's get you back to FixMate.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-7 py-3 font-bold text-white shadow-lg shadow-orange-500/20 transition-all duration-200 hover:bg-orange-600"
                >
                    <span className="text-lg">⌂</span>
                    Back to Home
                </Link>

                <p className="mt-10 text-xs text-zinc-500 dark:text-zinc-500">
                    © 2026 FixMate. All rights reserved.
                </p>
            </div>
        </main>
    );
}
