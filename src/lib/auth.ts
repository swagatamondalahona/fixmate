import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import clientPromise from "./mongodb";

const client = await clientPromise;
const db = client.db(process.env.DB_NAME || "fixmateDB");

const trustedOrigins = Array.from(
    new Set(
        [
            "http://localhost:3000",
            "https://fixmate-gules-three.vercel.app",
            process.env.BETTER_AUTH_URL?.replace(/\/+$/, ""),
            process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, ""),
        ].filter((origin): origin is string => Boolean(origin))
    )
);

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins,

    // Email and Password Authentication
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },

    // Server-side guard: never allow public sign-up with "admin" role
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    const requestedRole =
                        typeof user.role === "string"
                            ? user.role.toLowerCase()
                            : "customer";

                    const safeRole =
                        requestedRole === "technician"
                            ? "technician"
                            : "customer";

                    return {
                        data: {
                            ...user,
                            role: safeRole,
                        },
                    };
                },
            },
        },
    },

    // User Configuration
    user: {
        modelName: "users",

        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "customer",
                input: true,
            },

            phone: {
                type: "string",
                required: false,
                input: true,
            },

            area: {
                type: "string",
                required: false,
                input: true,
            },

            bio: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },

    // JWT Authentication
    plugins: [
        jwt(),
    ],
});
