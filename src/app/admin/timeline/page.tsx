"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import type { TimelineRow } from "@/types";

/**
 * Admin Timeline CMS Page
 * - List all timeline entries
 * - Create / Edit / Delete entries
 */

export default function AdminTimelinePage() {
    const [entries, setEntries] = useState<TimelineRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<TimelineRow | null>(null);
    const [form, setForm] = useState({
        date: "",
        age: 0,
        titleAr: "",
        titleEn: "",
        storyAr: "",
        storyEn: "",
        imageUrl: "",
        order: 0,
    });

    useEffect(() => {
        fetchEntries();
    }, []);

    async function fetchEntries() {
        try {
            const res = await fetch("/api/admin/timeline");
            const data = await res.json();
            if (data.success) setEntries(data.data);
        } catch {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editing
            ? `/api/admin/timeline/${editing.id}`
            : "/api/admin/timeline";
        const method = editing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setShowForm(false);
                setEditing(null);
                resetForm();
                fetchEntries();
            }
        } catch {
            // Handle error
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this entry?")) return;
        try {
            await fetch(`/api/admin/timeline/${id}`, { method: "DELETE" });
            fetchEntries();
        } catch {
            // Handle error
        }
    }

    function editEntry(entry: TimelineRow) {
        setEditing(entry);
        setForm({
            date: entry.date.split("T")[0],
            age: entry.age,
            titleAr: entry.titleAr,
            titleEn: entry.titleEn,
            storyAr: entry.storyAr,
            storyEn: entry.storyEn,
            imageUrl: entry.imageUrl || "",
            order: entry.order,
        });
        setShowForm(true);
    }

    function resetForm() {
        setForm({
            date: "",
            age: 0,
            titleAr: "",
            titleEn: "",
            storyAr: "",
            storyEn: "",
            imageUrl: "",
            order: 0,
        });
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Timeline</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditing(null);
                        resetForm();
                    }}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                    {showForm ? "Cancel" : "+ New Entry"}
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 space-y-4 rounded-xl border border-gray-800 bg-[#0D1117] p-6"
                >
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Age"
                            value={form.age || ""}
                            onChange={(e) =>
                                setForm({ ...form, age: parseInt(e.target.value) || 0 })
                            }
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            required
                        />
                        <input
                            type="number"
                            placeholder="Order"
                            value={form.order || ""}
                            onChange={(e) =>
                                setForm({ ...form, order: parseInt(e.target.value) || 0 })
                            }
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input
                            placeholder="Title (English)"
                            value={form.titleEn}
                            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            required
                        />
                        <input
                            placeholder="العنوان (عربي)"
                            value={form.titleAr}
                            onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            dir="rtl"
                            required
                        />
                        <textarea
                            placeholder="Story (English)"
                            value={form.storyEn}
                            onChange={(e) => setForm({ ...form, storyEn: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            rows={3}
                        />
                        <textarea
                            placeholder="القصة (عربي)"
                            value={form.storyAr}
                            onChange={(e) => setForm({ ...form, storyAr: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            rows={3}
                            dir="rtl"
                        />
                    </div>
                    <ImageUpload
                        value={form.imageUrl}
                        onChange={(url) => setForm({ ...form, imageUrl: url })}
                        folder="timeline"
                        label="Timeline Image"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        {editing ? "Update Entry" : "Create Entry"}
                    </button>
                </form>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
            ) : entries.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-12 text-center">
                    <p className="text-gray-400">No timeline entries yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#0D1117] p-4"
                        >
                            <div>
                                <p className="font-medium">{entry.titleEn}</p>
                                <p className="text-xs text-gray-400">
                                    {new Date(entry.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                    })}{" "}
                                    — Age: {entry.age}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => editEntry(entry)}
                                    className="text-xs text-teal-400 hover:text-teal-300"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    className="text-xs text-red-400 hover:text-red-300"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
