
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import clientPromise from "./mongodb";

const client = await clientPromise;
const db = client.db(process.env.DB_NAME || "fixmateDB");

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        client,
    }),

    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

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

    plugins: [
        jwt(),
    ],
});
