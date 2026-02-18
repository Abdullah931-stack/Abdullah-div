"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Admin Signup Page
 * Create your admin account here.
 * After creating the account, go to /admin/login to sign in.
 */
export default function AdminSignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Signup failed");
                return;
            }

            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                router.push("/admin/login");
            }, 2000);
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
                    Create Admin Account
                </h1>
                <p className="mb-8 text-center text-sm text-gray-400">
                    Set up your admin credentials
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
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-colors focus:border-teal-500 focus:outline-none"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-400">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-teal-600 py-3 font-medium text-white transition-all hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <a href="/admin/login" className="text-teal-400 hover:text-teal-300">
                            Sign In
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
