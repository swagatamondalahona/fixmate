export const SERVICE_CATEGORIES = [
    "Smartphone",
    "Laptop & PC",
    "AC",
    "Refrigerator",
    "TV",
    "Washing Machine",
    "Electrical",
] as const;

export const SERVICE_MODES = [
    "Home Visit",
    "Shop Drop-off",
] as const;

export function formatServiceMode(mode?: string): string {
    if (!mode) return "Home Visit";
    if (mode === "On-site") return "Home Visit";
    if (mode === "Remote") return "Shop Drop-off";
    return mode;
}

export function getDashboardPathByRole(role?: string): string {
    const normalized = role?.toLowerCase();

    if (normalized === "admin") return "/dashboard/admin";
    if (normalized === "technician") return "/dashboard/technician";
    if (normalized === "customer") return "/dashboard/customer";

    return "/dashboard/profile";
}

export function getBookingStatusStyle(status: string): string {
    switch (status) {
        case "requested":
            return "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400";
        case "accepted":
            return "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400";
        case "in-progress":
            return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
        case "completed":
            return "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400";
        case "rejected":
            return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400";
        case "cancelled":
            return "border-zinc-500/30 bg-zinc-500/10 text-zinc-700 dark:text-zinc-400";
        default:
            return "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
}
