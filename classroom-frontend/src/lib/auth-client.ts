import { createAuthClient } from "better-auth/react";
import { BACKEND_BASE_URL } from "@/constants";

const baseURL = BACKEND_BASE_URL.replace(/\/api\/?$/, "");

export const authClient = createAuthClient({
    baseURL,
    fetchOptions: {
        credentials: "include", // Important: include cookies
    },
});

export const { signIn, signUp, signOut, useSession } = authClient;
