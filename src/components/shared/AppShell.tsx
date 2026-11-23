
"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname.startsWith("/dashboard");

    return (
        <>
            <Toaster position="top-right" richColors closeButton />

            {!isDashboard && (
                <Suspense fallback={null}>
                    <Navbar />
                </Suspense>
            )}

            <main className="flex-1">
                {children}
            </main>

            {!isDashboard && <Footer />}
        </>
    );
}
