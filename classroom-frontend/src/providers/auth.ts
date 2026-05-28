import { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
    login: async ({ email, password }) => {
        try {
            const { error } = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                return {
                    success: false,
                    error: {
                        message: error.message || "Login failed",
                        name: "Invalid Credentials",
                    },
                };
            }

            return {
                success: true,
                redirectTo: "/",
            };
        } catch (error) {
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : "Login failed",
                    name: "Login Error",
                },
            };
        }
    },
    logout: async () => {
        try {
            // Clear guest mode if active
            localStorage.removeItem('guest_mode');
            await authClient.signOut();
            return {
                success: true,
                redirectTo: "/login",
            };
        } catch (error) {
            // Clear guest mode even if there's an error
            localStorage.removeItem('guest_mode');
            return {
                success: false,
                error: {
                    message: error instanceof Error ? error.message : "Logout failed",
                    name: "Logout Error",
                },
            };
        }
    },
    check: async () => {
        try {
            // Check if guest mode is enabled
            const isGuestMode = localStorage.getItem('guest_mode') === 'true';
            if (isGuestMode) {
                return {
                    authenticated: true,
                };
            }

            const { data: session } = await authClient.getSession();
            if (session) {
                return {
                    authenticated: true,
                };
            }

            return {
                authenticated: false,
                redirectTo: "/login",
                logout: true,
            };
        } catch (error) {
            return {
                authenticated: false,
                redirectTo: "/login",
                logout: true,
            };
        }
    },
    getPermissions: async () => {
        try {
            // Check if guest mode is enabled
            const isGuestMode = localStorage.getItem('guest_mode') === 'true';
            if (isGuestMode) {
                return ['guest'];
            }

            const { data: session } = await authClient.getSession();
            return session?.user?.role ? [session.user.role] : null;
        } catch (error) {
            return null;
        }
    },
    getIdentity: async () => {
        try {
            // Check if guest mode is enabled
            const isGuestMode = localStorage.getItem('guest_mode') === 'true';
            if (isGuestMode) {
                return {
                    id: 'guest',
                    name: 'Guest User',
                    email: 'guest@guest.com',
                    avatar: undefined,
                    role: 'guest',
                };
            }

            const { data: session } = await authClient.getSession();
            if (session) {
                return {
                    id: session.user.id,
                    name: session.user.name,
                    email: session.user.email,
                    avatar: session.user.image,
                    role: session.user.role,
                };
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    onError: async (error) => {
        if (error.statusCode === 401 || error.statusCode === 403) {
            return {
                logout: true,
                redirectTo: "/login",
            };
        }
        return { error };
    },
};
