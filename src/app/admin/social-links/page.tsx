"use client";

import { useState, useEffect } from "react";
import type { SocialLink } from "@/types";

/**
 * Admin Social Links CMS Page
 * - List all social links
 * - Create / Edit / Delete links
 * - Toggle active status
 */

export default function AdminSocialLinksPage() {
    const [links, setLinks] = useState<SocialLink[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<SocialLink | null>(null);
    const [form, setForm] = useState({
        platform: "",
        url: "",
        labelAr: "",
        labelEn: "",
        icon: "",
        order: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchLinks();
    }, []);

    async function fetchLinks() {
        try {
            const res = await fetch("/api/admin/social-links");
            const data = await res.json();
            if (data.success) setLinks(data.data);
        } catch { } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editing
            ? `/api/admin/social-links/${editing.id}`
            : "/api/admin/social-links";
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
                fetchLinks();
            }
        } catch { }
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this link?")) return;
        try {
            await fetch(`/api/admin/social-links/${id}`, { method: "DELETE" });
            fetchLinks();
        } catch { }
    }

    async function toggleActive(link: SocialLink) {
        try {
            await fetch(`/api/admin/social-links/${link.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !link.isActive }),
            });
            fetchLinks();
        } catch { }
    }

    function editLink(link: SocialLink) {
        setEditing(link);
        setForm({
            platform: link.platform,
            url: link.url,
            labelAr: link.labelAr,
            labelEn: link.labelEn,
            icon: link.icon || "",
            order: link.order,
            isActive: link.isActive,
        });
        setShowForm(true);
    }

    function resetForm() {
        setForm({ platform: "", url: "", labelAr: "", labelEn: "", icon: "", order: 0, isActive: true });
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Social Links</h2>
                <button
                    onClick={() => { setShowForm(!showForm); setEditing(null); resetForm(); }}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                    {showForm ? "Cancel" : "+ New Link"}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="mb-8 space-y-4 rounded-xl border border-gray-800 bg-[#0D1117] p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <input placeholder="Platform (e.g. github)" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none" required />
                        <input placeholder="URL" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none" required />
                        <input placeholder="Label (English)" value={form.labelEn} onChange={(e) => setForm({ ...form, labelEn: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none" />
                        <input placeholder="التسمية (عربي)" value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none" dir="rtl" />
                    </div>
                    <button type="submit" className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700">
                        {editing ? "Update Link" : "Create Link"}
                    </button>
                </form>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
            ) : links.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-12 text-center">
                    <p className="text-gray-400">No social links yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {links.map((link) => (
                        <div key={link.id} className="flex items-center justify-between rounded-xl border border-gray-800 bg-[#0D1117] p-4">
                            <div>
                                <p className="font-medium">{link.platform}</p>
                                <p className="text-xs text-gray-400">{link.url}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggleActive(link)} className={`rounded-full px-3 py-1 text-xs font-medium ${link.isActive ? "bg-green-500/10 text-green-400" : "bg-gray-700 text-gray-400"}`}>
                                    {link.isActive ? "Active" : "Inactive"}
                                </button>
                                <button onClick={() => editLink(link)} className="text-xs text-teal-400 hover:text-teal-300">Edit</button>
                                <button onClick={() => handleDelete(link.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
