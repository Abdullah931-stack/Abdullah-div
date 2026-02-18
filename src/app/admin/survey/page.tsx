"use client";

import { useState, useEffect } from "react";

/**
 * Admin Survey Analytics Page
 * - View survey question analytics
 * - Answer distribution and unique visitors count
 */

interface QuestionAnalytics {
    question: {
        id: string;
        textEn: string;
        textAr: string;
        type: string;
    };
    totalResponses: number;
    answerCounts: Record<string, number>;
}

interface AnalyticsData {
    analytics: QuestionAnalytics[];
    summary: {
        totalQuestions: number;
        totalResponses: number;
        uniqueVisitors: number;
    };
}

export default function AdminSurveyPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/admin/survey/analytics");
                const json = await res.json();
                if (json.success) setData(json.data);
            } catch { } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold">Survey Analytics</h2>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
            ) : !data || data.summary.totalQuestions === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-12 text-center">
                    <p className="text-gray-400">No survey data available yet.</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-6 text-center">
                            <p className="text-3xl font-bold text-teal-400">{data.summary.totalQuestions}</p>
                            <p className="text-sm text-gray-400">Questions</p>
                        </div>
                        <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-6 text-center">
                            <p className="text-3xl font-bold text-blue-400">{data.summary.totalResponses}</p>
                            <p className="text-sm text-gray-400">Total Responses</p>
                        </div>
                        <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-6 text-center">
                            <p className="text-3xl font-bold text-purple-400">{data.summary.uniqueVisitors}</p>
                            <p className="text-sm text-gray-400">Unique Visitors</p>
                        </div>
                    </div>

                    {/* Per-question Analytics */}
                    <div className="space-y-6">
                        {data.analytics.map((qa) => (
                            <div key={qa.question.id} className="rounded-xl border border-gray-800 bg-[#0D1117] p-6">
                                <h3 className="mb-1 font-medium">{qa.question.textEn}</h3>
                                <p className="mb-4 text-xs text-gray-500" dir="rtl">{qa.question.textAr}</p>
                                <p className="mb-3 text-sm text-gray-400">{qa.totalResponses} responses</p>

                                {/* Answer Distribution Bars */}
                                {Object.entries(qa.answerCounts).length > 0 ? (
                                    <div className="space-y-2">
                                        {Object.entries(qa.answerCounts)
                                            .sort(([, a], [, b]) => b - a)
                                            .map(([answer, count]) => {
                                                const pct = qa.totalResponses > 0 ? Math.round((count / qa.totalResponses) * 100) : 0;
                                                return (
                                                    <div key={answer}>
                                                        <div className="mb-1 flex items-center justify-between text-xs">
                                                            <span className="text-gray-300">{answer}</span>
                                                            <span className="text-gray-400">{count} ({pct}%)</span>
                                                        </div>
                                                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                                                            <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500">No responses yet</p>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
