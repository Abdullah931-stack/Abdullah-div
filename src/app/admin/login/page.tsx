"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Admin Login Page
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Simple login form (email + password)
 * - No sign-up — admin only
 * - Redirects to /admin on success
 */
export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                return;
            }

            // Store tokens
            if (data.data?.session) {
                localStorage.setItem(
                    "sb-access-token",
                    data.data.session.accessToken
                );
                localStorage.setItem(
                    "sb-refresh-token",
                    data.data.session.refreshToken
                );
            }

            router.push("/admin");
        } catch {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0F14] px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <h1 className="mb-2 text-center text-3xl font-bold text-white">
                    Dashboard
                </h1>
                <p className="mb-8 text-center text-sm text-gray-400">
                    Admin Panel — Authorized Access Only
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-gray-300">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-teal-500 focus:outline-none"
                            placeholder="admin@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-teal-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-teal-600 py-3 font-medium text-white transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    );
}
