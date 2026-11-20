
"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

type UserProfile = {
    name: string;
    email: string;
    role: string;
    image?: string;
    phone?: string;
    area?: string;
    bio?: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        role: "",
        image: "",
        phone: "",
        area: "",
        bio: "",
    });

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const tokenResponse = await authClient.token();
                const token = tokenResponse.data?.token;

                if (!token) {
                    throw new Error("Authentication token not found. Please sign in again.");
                }

                const response = await fetch(`${API_URL}/api/users/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || "Failed to load profile.");
                }

                const user = result.data;

                setProfile({
                    name: user.name || "",
                    email: user.email || "",
                    role: user.role || "",
                    image: user.image || "",
                    phone: user.phone || "",
                    area: user.area || "",
                    bio: user.bio || "",
                });

                setPreview(user.image || "");
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load profile."
                );
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5 MB.");
            return;
        }

        setError("");
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setSaving(true);
        setMessage("");
        setError("");

        try {
            const tokenResponse = await authClient.token();
            const token = tokenResponse.data?.token;

            if (!token) {
                throw new Error("Authentication token not found. Please sign in again.");
            }

            let imageUrl = profile.image || "";

            if (selectedFile) {
                const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

                if (!imgbbKey) {
                    throw new Error(
                        "ImgBB API key is missing. Configure NEXT_PUBLIC_IMGBB_API_KEY in .env.local."
                    );
                }

                const formData = new FormData();
                formData.append("image", selectedFile);

                const uploadResponse = await fetch(
                    `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
                    {
                        method: "POST",
                        body: formData,
                    }
                );

                const uploadResult = await uploadResponse.json();

                if (!uploadResponse.ok || !uploadResult.success) {
                    throw new Error("Profile photo upload failed.");
                }

                imageUrl = uploadResult.data.url;
            }

            const response = await fetch(`${API_URL}/api/users/profile`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    area: profile.area,
                    bio: profile.bio,
                    image: imageUrl,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Profile update failed.");
            }

            setProfile((previous) => ({
                ...previous,
                ...result.data,
            }));

            setPreview(result.data.image || imageUrl);
            setSelectedFile(null);

            // Update BetterAuth session data for the navbar and dashboard.
            await authClient.updateUser({
                name: result.data.name,
                image: result.data.image || "",
            });

            setMessage("Profile updated successfully!");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while updating your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-black text-white">
                <p className="text-orange-400">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                        Account Settings
                    </p>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Update Profile
                    </h1>

                    <p className="mt-2 text-gray-400">
                        Manage your personal information and profile photo.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-xl sm:p-8"
                >
                    <div className="mb-8 flex flex-col items-center gap-4 border-b border-white/10 pb-8 sm:flex-row">
                        <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-orange-500 bg-zinc-800">
                            {preview ? (
                                <Image
                                    src={preview}
                                    alt="Profile preview"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                    sizes="96px"
                                />
                            ) : (
                                <span className="text-3xl font-bold text-orange-400">
                                    {profile.name.charAt(0).toUpperCase() || "U"}
                                </span>
                            )}
                        </div>

                        <div className="text-center sm:text-left">
                            <h2 className="text-lg font-semibold">
                                {profile.name || "Your Profile"}
                            </h2>
                            <p className="text-sm capitalize text-gray-400">
                                {profile.role}
                            </p>

                            <label className="mt-3 inline-flex cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400">
                                Upload Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            <p className="mt-2 text-xs text-gray-500">
                                Image only, maximum 5 MB.
                            </p>
                        </div>
                    </div>

                    {message && (
                        <div className="mb-5 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-orange-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Email (Read Only)
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                readOnly
                                className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-gray-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Role (Read Only)
                            </label>
                            <input
                                type="text"
                                value={profile.role}
                                readOnly
                                className="w-full cursor-not-allowed rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 capitalize text-gray-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={profile.phone || ""}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-orange-500"
                                placeholder="Enter phone number"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Area / City
                            </label>
                            <input
                                type="text"
                                name="area"
                                value={profile.area || ""}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-orange-500"
                                placeholder="e.g. Mirpur, Dhaka"
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-gray-300">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={profile.bio || ""}
                                onChange={handleChange}
                                rows={4}
                                className="w-full resize-none rounded-lg border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-orange-500"
                                placeholder="Write a short bio..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-orange-500 px-7 py-3 font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
