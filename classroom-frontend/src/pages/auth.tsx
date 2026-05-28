import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useNotification } from "@refinedev/core";
import { GraduationCap } from "lucide-react";

export default function AuthPage() {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
    const [registerName, setRegisterName] = useState("");

    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);

    const navigate = useNavigate();
    const { open } = useNotification();

    const handleGuestBrowse = () => {
        // Set a guest session in localStorage
        localStorage.setItem('guest_mode', 'true');
        open?.({
            type: "info",
            message: "Guest Mode",
            description: "Browsing as guest. Some features may be limited.",
        });
        navigate("/");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoginLoading(true);

        const { error } = await authClient.signIn.email({
            email: loginEmail,
            password: loginPassword,
        });

        setIsLoginLoading(false);

        if (error) {
            open?.({
                type: "error",
                message: "Login failed",
                description: error.message || "Invalid email or password",
            });
        } else {
            open?.({
                type: "success",
                message: "Login successful",
                description: "Welcome back!",
            });
            navigate("/");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (registerPassword !== registerConfirmPassword) {
            open?.({
                type: "error",
                message: "Passwords don't match",
                description: "Please make sure both password fields contain the same value.",
            });
            return;
        }

        setIsRegisterLoading(true);

        try {
            const result = await authClient.signUp.email({
                email: registerEmail,
                password: registerPassword,
                name: registerName,
                role: "student",
            });

            console.log("Registration result:", result);

            if (result.error) {
                open?.({
                    type: "error",
                    message: "Registration failed",
                    description: result.error.message || "Please try again",
                });
            } else {
                open?.({
                    type: "success",
                    message: "Account created",
                    description: "Please login with your credentials",
                });
                // Switch to login tab
                const loginTab = document.querySelector('[data-value="login"]') as HTMLElement;
                if (loginTab) loginTab.click();
                // Pre-fill login credentials
                setLoginEmail(registerEmail);
                setLoginPassword("");
                setRegisterPassword("");
                setRegisterConfirmPassword("");
            }
        } catch (err) {
            console.error("Registration error:", err);
            open?.({
                type: "error",
                message: "Registration failed",
                description: err instanceof Error ? err.message : "An unexpected error occurred",
            });
        } finally {
            setIsRegisterLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-md">
                <Tabs defaultValue="login" className="w-full">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-center mb-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-12 h-12 text-primary"
                            >
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                            </svg>
                        </div>
                        <CardTitle className="text-2xl text-center">Classroom</CardTitle>
                        <CardDescription className="text-center">
                            Manage your classes and learning
                        </CardDescription>
                        <TabsList className="grid w-full grid-cols-2 mt-4">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="register">Register</TabsTrigger>
                        </TabsList>
                    </CardHeader>

                    <CardContent>
                        <TabsContent value="login">
                            <form onSubmit={handleLogin}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="login-password">Password</Label>
                                        <Input
                                            id="login-password"
                                            type="password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-6" disabled={isLoginLoading}>
                                    {isLoginLoading ? "Logging in..." : "Login"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="register">
                            <form onSubmit={handleRegister}>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">Full Name</Label>
                                        <Input
                                            id="register-name"
                                            placeholder="John Doe"
                                            value={registerName}
                                            onChange={(e) => setRegisterName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-email">Email</Label>
                                        <Input
                                            id="register-email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-password">Password</Label>
                                        <Input
                                            id="register-password"
                                            type="password"
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-confirm-password">Confirm Password</Label>
                                        <Input
                                            id="register-confirm-password"
                                            type="password"
                                            value={registerConfirmPassword}
                                            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full mt-6" disabled={isRegisterLoading}>
                                    {isRegisterLoading ? "Creating account..." : "Register"}
                                </Button>
                            </form>
                        </TabsContent>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="w-full">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={handleGuestBrowse}
                        >
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Browse as Guest
                        </Button>
                    </CardFooter>
                </Tabs>
            </Card>
        </div>
    );
}
