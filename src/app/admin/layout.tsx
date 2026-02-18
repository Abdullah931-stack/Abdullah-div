"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

/**
 * Admin Dashboard Layout
 * Per 04-PAGE-SPECIFICATIONS.md:
 * - Sidebar navigation
 * - Auth check — redirects to /admin/login if not authenticated
 * - CMS sections: Projects, Timeline, Social Links, Messages, Survey, Export
 */

const SIDEBAR_LINKS = [
    {
        href: "/admin",
        label: "Overview",
        icon: "📊",
    },
    {
        href: "/admin/projects",
        label: "Projects",
        icon: "📁",
    },
    {
        href: "/admin/timeline",
        label: "Timeline",
        icon: "📅",
    },
    {
        href: "/admin/social-links",
        label: "Social Links",
        icon: "🔗",
    },
    {
        href: "/admin/messages",
        label: "Messages",
        icon: "✉️",
    },
    {
        href: "/admin/survey",
        label: "Survey Analytics",
        icon: "📈",
    },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication
    useEffect(() => {
        const token = localStorage.getItem("sb-access-token");
        if (!token && pathname !== "/admin/login" && pathname !== "/admin/signup") {
            router.push("/admin/login");
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [router, pathname]);

    // Don't render layout for login/signup pages
    if (pathname === "/admin/login" || pathname === "/admin/signup") {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0A0F14]">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    function handleLogout() {
        localStorage.removeItem("sb-access-token");
        localStorage.removeItem("sb-refresh-token");
        router.push("/admin/login");
    }

    return (
        <div className="flex min-h-screen bg-[#0A0F14] text-white">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-800 bg-[#0D1117] transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo */}
                <div className="flex h-16 items-center border-b border-gray-800 px-6">
                    <h1 className="text-lg font-bold text-teal-400">Admin Panel</h1>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 p-4">
                    {SIDEBAR_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all ${isActive
                                    ? "bg-teal-500/10 text-teal-400"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                <span>{link.icon}</span>
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 w-full border-t border-gray-800 p-4">
                    {/* Export */}
                    <a
                        href="/api/admin/export"
                        className="mb-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-400 transition-all hover:bg-gray-800 hover:text-white"
                    >
                        <span>💾</span> Export Data
                    </a>

                    {/* Back to Site */}
                    <Link
                        href="/"
                        className="mb-2 flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-gray-400 transition-all hover:bg-gray-800 hover:text-white"
                    >
                        <span>🌐</span> View Site
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-red-400 transition-all hover:bg-red-500/10"
                    >
                        <span>🚪</span> Sign Out
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                {/* Top Bar */}
                <header className="flex h-16 items-center justify-between border-b border-gray-800 px-6">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="rounded-lg p-2 text-gray-400 hover:text-white md:hidden"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <div className="hidden md:block" />

                    <div className="text-sm text-gray-400">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
