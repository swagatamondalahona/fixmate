"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { formatUSD } from "@/lib/currency";
import { formatServiceMode } from "@/lib/constants";

type Service = {
    _id: string;
    title: string;
    description?: string;
    category: string;
    serviceMode: string;
    basePrice: number;
    estimatedDuration?: string;
    image?: string;
    area?: string;
    serviceArea?: string;
    technicianName?: string;
    technician?: string;
    technicianEmail?: string;
    technicianImage?: string;
    technicianArea?: string;
    technicianBio?: string;
    createdAt: string;
};

type SessionUser = {
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    area?: string;
};

const API_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

function getTodayDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function ServiceDetailsPageContent() {
    const params = useParams<{ serviceId: string }>();
    const router = useRouter();
    const serviceId = params.serviceId;
    const { data: session, isPending: sessionLoading } = useSession();

    const user = session?.user as SessionUser | undefined;
    const userRole = user?.role?.toLowerCase() || "";

    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showRequestForm, setShowRequestForm] = useState(false);
    const [customerPhone, setCustomerPhone] = useState("");
    const [preferredDate, setPreferredDate] = useState("");
    const [address, setAddress] = useState("");
    const [problemDescription, setProblemDescription] = useState("");

    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingError, setBookingError] = useState("");

    useEffect(() => {
        if (user?.phone && !customerPhone) {
            setCustomerPhone(user.phone);
        }
        if (user?.area && !address) {
            setAddress(user.area);
        }
    }, [user?.phone, user?.area, customerPhone, address]);

    useEffect(() => {
        if (!serviceId) return;

        const controller = new AbortController();

        const fetchService = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/services/${serviceId}`,
                    { signal: controller.signal }
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Failed to load service"
                    );
                }

                setService(result.data);
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchService();

        return () => controller.abort();
    }, [serviceId]);

    const handleRequestClick = () => {
        if (!session) {
            toast.info("Please sign in as a customer to request this repair.");
            router.push(
                `/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`
            );
            return;
        }

        if (userRole !== "customer") {
            toast.error("Only customers can request a repair.");
            return;
        }

        setShowRequestForm(true);
    };

    const handleBooking = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setBookingError("");
        setBookingSuccess(false);

        if (!customerPhone.trim()) {
            const msg = "Please enter your contact phone number.";
            setBookingError(msg);
            toast.error(msg);
            return;
        }

        if (!preferredDate) {
            const msg = "Please choose today or a future preferred date.";
            setBookingError(msg);
            toast.error(msg);
            return;
        }

        if (preferredDate < getTodayDateString()) {
            const msg = "Preferred date must be today or a future date.";
            setBookingError(msg);
            toast.error(msg);
            return;
        }

        if (!address.trim()) {
            const msg = "Please enter your service or pickup address.";
            setBookingError(msg);
            toast.error(msg);
            return;
        }

        if (problemDescription.trim().length < 20) {
            const msg =
                "Problem description must be at least 20 characters so the technician understands the issue.";
            setBookingError(msg);
            toast.error(msg);
            return;
        }

        try {
            setBookingLoading(true);

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (tokenResponse.error || !token) {
                toast.error("Please sign in before booking.");
                router.push(
                    `/sign-in?redirect=${encodeURIComponent(`/services/${serviceId}`)}`
                );
                return;
            }

            const response = await fetch(`${API_URL}/api/bookings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    serviceId,
                    customerPhone: customerPhone.trim(),
                    preferredDate,
                    bookingDate: preferredDate,
                    address: address.trim(),
                    problemDescription: problemDescription.trim(),
                    notes: problemDescription.trim(),
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Booking could not be created."
                );
            }

            setBookingSuccess(true);
            setPreferredDate("");
            setProblemDescription("");
            toast.success(
                "Repair request submitted! Waiting for technician approval."
            );
        } catch (err) {
            const msg =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";
            setBookingError(msg);
            toast.error(msg);
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-orange-500 dark:bg-[#080808]">
                <div className="text-center">
                    <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />
                    <p>Loading Service Details...</p>
                </div>
            </div>
        );
    }

    if (error || !service) {
        return (
            <div className="flex min-h-[80vh] flex-col items-center justify-center bg-zinc-100 px-6 text-center dark:bg-[#080808]">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-4xl">
                    🔧
                </div>

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-500">
                    404 • Not Found
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-zinc-900 dark:text-white">
                    Service Not Found
                </h2>

                <p className="mt-3 max-w-md text-sm text-zinc-500 dark:text-gray-400">
                    {error ||
                        "This service does not exist or is currently unavailable."}
                </p>

                <Link
                    href="/services"
                    className="mt-6 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
                >
                    Browse Available Services
                </Link>
            </div>
        );
    }

    const technicianName =
        service.technicianName ||
        service.technician ||
        service.technicianEmail ||
        "Verified Technician";

    const serviceArea =
        service.serviceArea || service.area || "Not specified";

    const technicianArea = service.technicianArea || serviceArea;
    const serviceMode = formatServiceMode(service.serviceMode);
    const minDate = getTodayDateString();

    const inputClass =
        "w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-orange-500 dark:border-white/10 dark:bg-[#080808] dark:text-white dark:placeholder:text-gray-600";

    const readOnlyClass =
        "w-full cursor-not-allowed rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 text-sm text-zinc-500 outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400";

    const labelClass =
        "mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-300";

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-100 text-zinc-900 dark:bg-[#080808] dark:text-white">
            {/* Repair Tools Watermark */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
            >
                <div className="grid grid-cols-4 gap-12 p-8 text-5xl opacity-[0.045] grayscale sm:grid-cols-6 md:grid-cols-8">
                    {Array.from({ length: 64 }).map((_, index) => (
                        <span
                            key={index}
                            className="flex items-center justify-center"
                        >
                            {["⚙️", "🔧", "🪛", "🔩", "🔨", "🛠️"][index % 6]}
                        </span>
                    ))}
                </div>
            </div>

            <div className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-orange-500/10 blur-[130px]" />

            <div className="relative z-10 mx-auto max-w-7xl px-5 py-12 sm:px-8">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="mb-3 font-semibold uppercase tracking-[0.3em] text-orange-500">
                        FixMate Service Details
                    </p>

                    <h1 className="text-3xl font-extrabold sm:text-5xl">
                        {service.title}
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-zinc-500 dark:text-gray-400">
                        Explore service information, pricing, duration, and
                        technician profile before submitting your repair
                        request.
                    </p>
                </div>

                <Link
                    href="/services"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition hover:text-orange-400 dark:text-orange-400 dark:hover:text-orange-300"
                >
                    ← Back to Services
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Service Information */}
                    <div className="space-y-6 lg:col-span-2">
                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl shadow-black/5 dark:border-white/10 dark:bg-[#111111]/90 dark:shadow-black/30">
                            <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-orange-500/15 to-zinc-200 p-6 dark:to-[#151515]">
                                {service.image ? (
                                    service.image.startsWith("http") ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="max-h-80 w-full rounded-xl object-cover"
                                        />
                                    ) : (
                                        <span className="text-8xl">
                                            {service.image}
                                        </span>
                                    )
                                ) : (
                                    <div className="text-8xl">🔧</div>
                                )}
                            </div>

                            <div className="space-y-6 p-6 sm:p-8">
                                <div className="flex flex-wrap items-center gap-3">
                                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-semibold text-orange-600 dark:text-orange-400">
                                        {service.category}
                                    </span>

                                    <span className="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                                        {serviceMode}
                                    </span>

                                    <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-600 dark:text-green-400">
                                        Available
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold sm:text-3xl">
                                    {service.title}
                                </h2>

                                <div>
                                    <h3 className="mb-3 text-lg font-bold text-orange-500 dark:text-orange-400">
                                        What This Service Includes
                                    </h3>

                                    <p className="leading-7 text-zinc-600 dark:text-gray-400">
                                        {service.description ||
                                            "No description available."}
                                    </p>
                                </div>

                                <div className="grid gap-4 border-t border-zinc-200 pt-6 dark:border-white/10 sm:grid-cols-2">
                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Service Category
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {service.category}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Service Mode
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {serviceMode}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Estimated Duration
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {service.estimatedDuration ||
                                                "1–2 hours"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-zinc-500 dark:text-gray-500">
                                            Service Area
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {serviceArea}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technician Summary */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-white/10 dark:bg-[#111111]/90 sm:p-8">
                            <h3 className="mb-6 text-xl font-bold">
                                Technician Summary
                            </h3>

                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                                {service.technicianImage ? (
                                    <img
                                        src={service.technicianImage}
                                        alt={technicianName}
                                        className="h-16 w-16 shrink-0 rounded-full border-2 border-orange-500/40 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-orange-500/30 bg-orange-500/10 text-2xl font-bold text-orange-500">
                                        {technicianName.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                <div className="min-w-0 flex-1 space-y-2">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                                            Verified Technician
                                        </p>
                                        <p className="mt-0.5 text-lg font-bold">
                                            {technicianName}
                                        </p>
                                    </div>

                                    <p className="text-sm text-zinc-600 dark:text-gray-400">
                                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                                            Coverage Area:
                                        </span>{" "}
                                        {technicianArea}
                                    </p>

                                    <p className="text-sm leading-6 text-zinc-600 dark:text-gray-400">
                                        {service.technicianBio ||
                                            "Experienced FixMate repair specialist committed to transparent pricing and pay-after-service quality."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Price & Role-Restricted Repair Request */}
                    <div className="space-y-6">
                        <div className="h-fit rounded-2xl border border-orange-500/30 bg-white p-6 shadow-xl shadow-orange-500/5 dark:bg-[#111111]/95">
                            <p className="text-sm font-semibold text-zinc-500 dark:text-gray-400">
                                Starting Price
                            </p>

                            <h2 className="mt-2 text-4xl font-extrabold text-orange-500 dark:text-orange-400">
                                {formatUSD(service.basePrice)}
                            </h2>

                            <p className="mt-4 text-sm leading-6 text-zinc-500 dark:text-gray-500">
                                Pay online through Stripe only after the
                                technician completes your repair.
                            </p>
                        </div>

                        {/* Request Repair Card */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#111111]/95">
                            <h3 className="mb-2 text-xl font-bold">
                                Request Repair
                            </h3>

                            {sessionLoading ? (
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Checking account status...
                                </p>
                            ) : !session ? (
                                <div className="space-y-4">
                                    <p className="text-sm leading-6 text-zinc-600 dark:text-gray-400">
                                        Sign in with a customer account to send
                                        a repair request for this service.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleRequestClick}
                                        className="w-full rounded-lg bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
                                    >
                                        Request Repair →
                                    </button>
                                </div>
                            ) : userRole !== "customer" ? (
                                <div className="space-y-4">
                                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-400">
                                        Only customers can request a repair. You
                                        are currently signed in as{" "}
                                        <span className="font-semibold capitalize">
                                            {userRole}
                                        </span>
                                        .
                                    </div>

                                    <button
                                        type="button"
                                        disabled
                                        className="w-full cursor-not-allowed rounded-lg bg-zinc-300 px-5 py-3.5 text-sm font-bold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                                    >
                                        Request Repair (Customers Only)
                                    </button>
                                </div>
                            ) : !showRequestForm && !bookingSuccess ? (
                                <div className="space-y-4">
                                    <p className="text-sm leading-6 text-zinc-600 dark:text-gray-400">
                                        Ready to schedule this repair? Click
                                        below to describe the issue and pick
                                        your preferred date.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleRequestClick}
                                        className="w-full rounded-lg bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
                                    >
                                        Request Repair →
                                    </button>
                                </div>
                            ) : bookingSuccess ? (
                                <div className="space-y-4">
                                    <div
                                        role="status"
                                        className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400"
                                    >
                                        Repair request submitted successfully!
                                        Your booking is waiting for technician
                                        approval.
                                    </div>

                                    <Link
                                        href="/dashboard/customer/bookings"
                                        className="block w-full rounded-lg bg-orange-500 px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-orange-600"
                                    >
                                        View My Bookings →
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setBookingSuccess(false);
                                            setShowRequestForm(true);
                                        }}
                                        className="w-full rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-orange-500 hover:text-orange-500 dark:border-white/15 dark:text-zinc-300"
                                    >
                                        Back to Request Form
                                    </button>
                                </div>
                            ) : (
                                <form
                                    onSubmit={handleBooking}
                                    className="space-y-4"
                                >
                                    <p className="text-sm text-zinc-500 dark:text-gray-400">
                                        Fill in your contact and device problem
                                        details below.
                                    </p>

                                    <div>
                                        <label className={labelClass}>
                                            Your Name (Read-only)
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.name || ""}
                                            readOnly
                                            className={readOnlyClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Your Email (Read-only)
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            readOnly
                                            className={readOnlyClass}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="customerPhone"
                                            className={labelClass}
                                        >
                                            Phone Number
                                        </label>
                                        <input
                                            id="customerPhone"
                                            type="tel"
                                            required
                                            value={customerPhone}
                                            onChange={(event) =>
                                                setCustomerPhone(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="e.g. +880 17XX-XXXXXX"
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="preferredDate"
                                            className={labelClass}
                                        >
                                            Preferred Date
                                        </label>
                                        <input
                                            id="preferredDate"
                                            type="date"
                                            required
                                            min={minDate}
                                            value={preferredDate}
                                            onChange={(event) =>
                                                setPreferredDate(
                                                    event.target.value
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="address"
                                            className={labelClass}
                                        >
                                            Service / Pickup Address
                                        </label>
                                        <textarea
                                            id="address"
                                            required
                                            rows={2}
                                            value={address}
                                            onChange={(event) =>
                                                setAddress(event.target.value)
                                            }
                                            placeholder="Enter your full service address"
                                            className={`${inputClass} resize-none`}
                                        />
                                    </div>

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <label
                                                htmlFor="problemDescription"
                                                className="text-sm font-medium text-zinc-700 dark:text-gray-300"
                                            >
                                                Problem Description
                                            </label>
                                            <span
                                                className={`text-xs ${
                                                    problemDescription.trim()
                                                        .length >= 20
                                                        ? "text-green-600 dark:text-green-400"
                                                        : "text-zinc-500 dark:text-zinc-400"
                                                }`}
                                            >
                                                {
                                                    problemDescription.trim()
                                                        .length
                                                }
                                                /20 min
                                            </span>
                                        </div>
                                        <textarea
                                            id="problemDescription"
                                            required
                                            minLength={20}
                                            rows={4}
                                            value={problemDescription}
                                            onChange={(event) =>
                                                setProblemDescription(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Describe what is wrong with your device (minimum 20 characters)..."
                                            className={`${inputClass} resize-none`}
                                        />
                                    </div>

                                    {bookingError && (
                                        <div
                                            role="alert"
                                            className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400"
                                        >
                                            {bookingError}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={bookingLoading}
                                        className="w-full rounded-lg bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {bookingLoading
                                            ? "Submitting Request..."
                                            : "Submit Repair Request →"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ServiceDetailsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-zinc-100 text-orange-500 dark:bg-[#080808]">
                    Loading Service Details...
                </div>
            }
        >
            <ServiceDetailsPageContent />
        </Suspense>
    );
}
