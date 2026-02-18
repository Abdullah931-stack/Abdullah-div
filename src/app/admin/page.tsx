"use client";

import { useState, useEffect } from "react";

/**
 * Admin Dashboard — Overview Page
 * Shows quick stats: total projects, messages, survey responses
 */

interface Stats {
    projects: number;
    messages: number;
    unreadMessages: number;
    surveyResponses: number;
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projectsRes, messagesRes, surveyRes] = await Promise.all([
                    fetch("/api/admin/projects"),
                    fetch("/api/admin/messages"),
                    fetch("/api/admin/survey/analytics"),
                ]);

                const projectsData = await projectsRes.json();
                const messagesData = await messagesRes.json();
                const surveyData = await surveyRes.json();

                setStats({
                    projects: projectsData.data?.length || 0,
                    messages: messagesData.data?.length || 0,
                    unreadMessages:
                        messagesData.data?.filter((m: { isRead: boolean }) => !m.isRead)
                            .length || 0,
                    surveyResponses: surveyData.data?.summary?.totalResponses || 0,
                });
            } catch {
                // Handle errors silently
            } finally {
                setIsLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statCards = [
        {
            label: "Total Projects",
            value: stats?.projects || 0,
            icon: "📁",
            color: "text-teal-400",
        },
        {
            label: "Messages",
            value: stats?.messages || 0,
            icon: "✉️",
            color: "text-blue-400",
        },
        {
            label: "Unread Messages",
            value: stats?.unreadMessages || 0,
            icon: "🔔",
            color: "text-yellow-400",
        },
        {
            label: "Survey Responses",
            value: stats?.surveyResponses || 0,
            icon: "📈",
            color: "text-purple-400",
        },
    ];

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Dashboard Overview</h2>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-xl border border-gray-800 bg-[#0D1117] p-6"
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span className="text-2xl">{card.icon}</span>
                                <span className={`text-3xl font-bold ${card.color}`}>
                                    {card.value}
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">{card.label}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
