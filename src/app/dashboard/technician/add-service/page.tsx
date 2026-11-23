
"use client";

import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { formatUSD, MIN_SERVICE_PRICE_USD } from "@/lib/currency";
import { SERVICE_CATEGORIES, SERVICE_MODES } from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export default function AddServicePage() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { data: session } = useSession();
    const techUser = session?.user as
        | { name?: string; email?: string }
        | undefined;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [serviceMode, setServiceMode] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [estimatedDuration, setEstimatedDuration] = useState("");
    const [serviceArea, setServiceArea] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const inputClass =
        "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 dark:border-white/10 dark:bg-[#080808] dark:text-white dark:placeholder:text-gray-600";

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setMessage("");
        setError("");

        if (!API_URL || !IMGBB_API_KEY) {
            setError("API URL or ImgBB API key is missing.");
            return;
        }

        if (!image) {
            setError("Please select a service image.");
            return;
        }

        if (!image.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (image.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        const parsedPrice = Number(basePrice);
        if (
            !basePrice.trim() ||
            !Number.isFinite(parsedPrice) ||
            parsedPrice < MIN_SERVICE_PRICE_USD
        ) {
            setError(
                `Base price must be at least ${formatUSD(MIN_SERVICE_PRICE_USD, { decimals: true })} USD (minimum required for online payment).`
            );
            return;
        }

        try {
            setLoading(true);

            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (tokenResponse.error || !token) {
                throw new Error("Authentication token not found. Please sign in again.");
            }

            // Upload image to ImgBB
            const imageFormData = new FormData();
            imageFormData.append("image", image);

            const imageResponse = await fetch(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                {
                    method: "POST",
                    body: imageFormData,
                }
            );

            let imageData: { success?: boolean; data?: { url?: string } } | null = null;
            try {
                imageData = await imageResponse.json();
            } catch {
                imageData = null;
            }

            const uploadedImageUrl = imageData?.data?.url;
            if (!imageResponse.ok || !imageData?.success || !uploadedImageUrl) {
                throw new Error("Image upload failed. Please try again.");
            }

            // Submit service to backend
            const response = await fetch(`${API_URL}/api/services`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: title.trim(),
                    description: description.trim(),
                    category: category.trim(),
                    serviceMode,
                    basePrice: parsedPrice,
                    estimatedDuration: estimatedDuration.trim(),
                    serviceArea: serviceArea.trim(),
                    image: uploadedImageUrl,
                }),
            });

            let data: { success?: boolean; message?: string } | null = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || "Failed to add service.");
            }

            setMessage("Service submitted successfully! Waiting for admin approval.");
            toast.success("Service submitted! Waiting for admin approval.");

            setTitle("");
            setDescription("");
            setCategory("");
            setServiceMode("");
            setBasePrice("");
            setEstimatedDuration("");
            setServiceArea("");
            setImage(null);

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
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

    return (
        <div className="relative min-h-screen overflow-hidden bg-zinc-100 px-4 py-8 text-zinc-900 transition-colors duration-300 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">

            {/* Background glow */}
            <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />
            <div className="pointer-events-none absolute -right-40 bottom-10 h-96 w-96 rounded-full bg-orange-500/5 blur-[120px]" />

            {/* Watermark */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
                <span className="absolute -left-5 top-32 rotate-[-35deg] text-[180px] text-orange-500/[0.045]">
                    ⚒
                </span>
                <span className="absolute -right-8 top-[35%] rotate-[45deg] text-[200px] text-orange-500/[0.04]">
                    🔧
                </span>
                <span className="absolute bottom-10 left-[30%] rotate-[-25deg] text-[160px] text-orange-500/[0.035]">
                    ⚙
                </span>
            </div>

            <div className="relative z-10 mx-auto max-w-3xl">

                {/* Heading */}
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2">
                        <span className="h-2 w-2 rounded-full bg-orange-500" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">
                            Technician Workspace
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Add New <span className="text-orange-500">Service</span>
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600 dark:text-gray-400 sm:text-base">
                        Add your repair service details and submit them for admin review and approval.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-black/5 backdrop-blur-sm transition-colors duration-300 dark:border-white/10 dark:bg-[#111111]/95 dark:shadow-black/30 sm:p-8"
                >
                    <div className="mb-7 flex items-center gap-3 border-b border-zinc-200 pb-5 dark:border-white/10">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-xl text-orange-600 dark:text-orange-500">
                            ⚒
                        </div>
                        <div>
                            <h2 className="font-semibold text-zinc-900 dark:text-white">Service Information</h2>
                            <p className="mt-1 text-xs text-zinc-500 dark:text-gray-500">Fill in the details below</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                    Technician Name (Read-only)
                                </label>
                                <input
                                    type="text"
                                    value={techUser?.name || ""}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-500 outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                    Technician Email (Read-only)
                                </label>
                                <input
                                    type="email"
                                    value={techUser?.email || ""}
                                    readOnly
                                    className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-3 text-zinc-500 outline-none dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                Service Title
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="Example: Laptop Repair Service"
                                required
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                Service Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Describe your repair service..."
                                rows={5}
                                required
                                className={`${inputClass} resize-y`}
                            />
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                    required
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="" className="bg-white text-zinc-900 dark:bg-[#111111] dark:text-white">
                                        Select category
                                    </option>
                                    {SERVICE_CATEGORIES.map((item) => (
                                        <option
                                            key={item}
                                            value={item}
                                            className="bg-white text-zinc-900 dark:bg-[#111111] dark:text-white"
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                    Service Mode
                                </label>
                                <select
                                    value={serviceMode}
                                    onChange={(event) => setServiceMode(event.target.value)}
                                    required
                                    className={`${inputClass} appearance-none`}
                                >
                                    <option value="" className="bg-white text-zinc-900 dark:bg-[#111111] dark:text-white">
                                        Select service mode
                                    </option>
                                    {SERVICE_MODES.map((item) => (
                                        <option
                                            key={item}
                                            value={item}
                                            className="bg-white text-zinc-900 dark:bg-[#111111] dark:text-white"
                                        >
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                    Estimated Duration
                                </label>
                                <input
                                    type="text"
                                    value={estimatedDuration}
                                    onChange={(event) => setEstimatedDuration(event.target.value)}
                                    placeholder="Example: 2-3 hours"
                                    required
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                    Service Area
                                </label>
                                <input
                                    type="text"
                                    value={serviceArea}
                                    onChange={(event) => setServiceArea(event.target.value)}
                                    placeholder="Example: Dhaka"
                                    required
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                Base Price ($ USD — min {formatUSD(MIN_SERVICE_PRICE_USD, { decimals: true })})
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-orange-500">
                                    $
                                </span>
                                <input
                                    type="number"
                                    min={MIN_SERVICE_PRICE_USD}
                                    step="0.01"
                                    value={basePrice}
                                    onChange={(event) => setBasePrice(event.target.value)}
                                    placeholder={`Enter service price (min ${formatUSD(MIN_SERVICE_PRICE_USD, { decimals: true })})`}
                                    required
                                    className={`${inputClass} pl-9`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-gray-200">
                                Service Image
                            </label>
                            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-5 transition hover:border-orange-500/50 dark:border-white/20 dark:bg-[#080808]">
                                <input
                                    ref={fileInputRef}
                                    id="service-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => setImage(event.target.files?.[0] || null)}
                                    required
                                    className="w-full text-sm text-zinc-600 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-500/10 file:px-4 file:py-2.5 file:font-semibold file:text-orange-600 hover:file:bg-orange-500/20 dark:text-gray-400 dark:file:text-orange-400"
                                />
                                <p className="mt-3 text-xs text-zinc-500 dark:text-gray-500">
                                    Select an image. It will be uploaded to ImgBB.
                                </p>
                                {image && (
                                    <p className="mt-2 break-all text-xs text-orange-600 dark:text-orange-400">
                                        Selected: {image.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        {message && (
                            <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-700 dark:text-green-400">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-500/10 transition hover:bg-orange-600 hover:shadow-orange-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                    Submitting Service...
                                </>
                            ) : (
                                <>＋ Submit Service</>
                            )}
                        </button>

                        <p className="text-center text-xs text-zinc-500 dark:text-gray-500">
                            Your service will remain pending until admin approval.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
