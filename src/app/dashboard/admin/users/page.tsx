
"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface User {
    _id: string;
    id?: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    area?: string;
    image?: string;
    createdAt?: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

    const getAuthToken = async (): Promise<string> => {
        const { data, error: tokenError } = await authClient.token();

        if (tokenError) {
            throw new Error(
                tokenError.message || "Unable to get authentication token."
            );
        }

        if (!data?.token) {
            throw new Error("Authentication required. Please sign in again.");
        }

        return data.token;
    };

    // Fetch all users
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            if (!API_URL) {
                throw new Error("Backend API URL is not configured.");
            }

            const token = await getAuthToken();

            const response = await fetch(`${API_URL}/api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Failed to load users.");
            }

            setUsers(Array.isArray(result.data) ? result.data : []);
        } catch (err) {
            setUsers([]);
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Update user role
    const updateUserRole = async (
        userId: string,
        role: "customer" | "technician"
    ) => {
        try {
            setProcessingId(userId);
            setError("");
            setMessage("");

            if (!API_URL) {
                throw new Error("Backend API URL is not configured.");
            }

            const token = await getAuthToken();

            const response = await fetch(
                `${API_URL}/api/admin/users/${userId}/role`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ role }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Failed to update user role."
                );
            }

            setUsers((previous) =>
                previous.map((user) =>
                    user._id === userId
                        ? { ...user, role }
                        : user
                )
            );

            setMessage(result.message || "User role updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setProcessingId("");
        }
    };

    return (
        <main className="min-h-screen bg-zinc-100 px-5 py-12 text-zinc-900 transition-colors duration-300 dark:bg-black dark:text-white sm:px-8 lg:px-12">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                            FixMate Administration
                        </p>

                        <h1 className="text-3xl font-bold sm:text-5xl">
                            Manage{" "}
                            <span className="text-orange-500">Users</span>
                        </h1>

                        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                            View users and manage their account roles.
                        </p>
                    </div>

                    <button
                        onClick={fetchUsers}
                        disabled={loading}
                        className="rounded-xl border border-orange-500/40 bg-orange-500/10 px-6 py-3 font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-black disabled:opacity-50 dark:text-orange-400"
                    >
                        {loading ? "Loading..." : "Refresh Users"}
                    </button>
                </div>

                {/* Statistics */}
                <div className="mb-8 grid gap-5 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Total Users
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-orange-500">
                            {users.length}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Customers
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">
                            {users.filter((user) => user.role === "customer").length}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Technicians
                        </p>

                        <h2 className="mt-3 text-3xl font-bold text-zinc-900 dark:text-white">
                            {users.filter((user) => user.role === "technician").length}
                        </h2>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <div
                        role="alert"
                        className="mb-6 rounded-xl border border-red-500/30 bg-red-50 p-4 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                    >
                        {error}
                    </div>
                )}

                {message && (
                    <div
                        role="status"
                        className="mb-6 rounded-xl border border-green-500/30 bg-green-50 p-4 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400"
                    >
                        {message}
                    </div>
                )}

                {/* Users Table */}
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl transition-colors duration-300 dark:border-white/10 dark:bg-zinc-950">
                    <div className="border-b border-zinc-200 p-6 dark:border-white/10">
                        <h2 className="text-xl font-bold">
                            All <span className="text-orange-500">Users</span>
                        </h2>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500" />

                            <p className="text-zinc-600 dark:text-zinc-400">
                                Loading users...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center">
                            <p className="text-zinc-600 dark:text-zinc-400">
                                Unable to load users.
                            </p>

                            <button
                                onClick={fetchUsers}
                                className="mt-4 rounded-xl bg-orange-500 px-5 py-2 font-semibold text-black transition hover:bg-orange-400"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="p-12 text-center text-zinc-600 dark:text-zinc-400">
                            No users found.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[750px] text-left text-sm">
                                <thead className="bg-zinc-100 text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-zinc-200 dark:divide-white/10">
                                    {users.map((user) => {
                                        const userId = user._id || user.id || "";
                                        const isAdmin = user.role === "admin";

                                        return (
                                            <tr
                                                key={userId}
                                                className="transition hover:bg-zinc-50 dark:hover:bg-white/[0.03]"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        {user.image ? (
                                                            <img
                                                                src={user.image}
                                                                alt={user.name}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 font-bold text-orange-500">
                                                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                                                            </div>
                                                        )}

                                                        <div>
                                                            <p className="font-semibold text-zinc-900 dark:text-white">
                                                                {user.name}
                                                            </p>

                                                            {isAdmin && (
                                                                <span className="text-xs text-orange-600 dark:text-orange-400">
                                                                    Administrator
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="break-all px-6 py-5 text-zinc-600 dark:text-zinc-400">
                                                    {user.email}
                                                </td>

                                                <td className="px-6 py-5 text-zinc-600 dark:text-zinc-400">
                                                    {user.phone || "—"}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${isAdmin
                                                                ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                                                                : user.role === "technician"
                                                                    ? "bg-blue-500/10 text-blue-700 dark:text-blue-400"
                                                                    : "bg-green-500/10 text-green-700 dark:text-green-400"
                                                            }`}
                                                    >
                                                        {user.role}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    {isAdmin ? (
                                                        <span className="text-xs text-zinc-500">
                                                            Protected
                                                        </span>
                                                    ) : (
                                                        <select
                                                            value={user.role}
                                                            disabled={processingId === userId}
                                                            onChange={(event) =>
                                                                updateUserRole(
                                                                    userId,
                                                                    event.target.value as
                                                                    | "customer"
                                                                    | "technician"
                                                                )
                                                            }
                                                            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 outline-none focus:border-orange-500 disabled:opacity-50 dark:border-white/10 dark:bg-black dark:text-white"
                                                        >
                                                            <option value="customer">
                                                                Customer
                                                            </option>

                                                            <option value="technician">
                                                                Technician
                                                            </option>
                                                        </select>
                                                    )}

                                                    {processingId === userId && (
                                                        <p className="mt-2 text-xs text-orange-600 dark:text-orange-400">
                                                            Updating...
                                                        </p>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
