"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

/**
 * Admin Projects CMS Page
 * - List all projects (published + unpublished)
 * - Create / Edit / Delete projects
 * - Toggle publish/featured status
 */

interface ProjectRow {
    id: string;
    titleEn: string;
    titleAr: string;
    slug: string;
    isPublished: boolean;
    isFeatured: boolean;
    order: number;
}

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<ProjectRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<ProjectRow | null>(null);
    const [form, setForm] = useState({
        titleAr: "",
        titleEn: "",
        summaryAr: "",
        summaryEn: "",
        bodyAr: "",
        bodyEn: "",
        previewUrl: "",
        skills: "",
        buildTime: "",
        order: 0,
        isPublished: false,
        isFeatured: false,
        coverImage: "",
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    async function fetchProjects() {
        try {
            const res = await fetch("/api/admin/projects");
            const data = await res.json();
            if (data.success) setProjects(data.data);
        } catch {
            // Handle error
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const url = editing
            ? `/api/admin/projects/${editing.id}`
            : "/api/admin/projects";
        const method = editing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    skills: form.skills
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    coverImage: form.coverImage || undefined,
                }),
            });

            if (res.ok) {
                setShowForm(false);
                setEditing(null);
                resetForm();
                fetchProjects();
            }
        } catch {
            // Handle error
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
            fetchProjects();
        } catch {
            // Handle error
        }
    }

    async function togglePublish(project: ProjectRow) {
        try {
            await fetch(`/api/admin/projects/${project.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isPublished: !project.isPublished }),
            });
            fetchProjects();
        } catch {
            // Handle error
        }
    }

    function editProject(project: ProjectRow) {
        setEditing(project);
        setForm({
            titleAr: project.titleAr || "",
            titleEn: project.titleEn || "",
            summaryAr: "",
            summaryEn: "",
            bodyAr: "",
            bodyEn: "",
            previewUrl: "",
            skills: "",
            buildTime: "",
            order: project.order,
            isPublished: project.isPublished,
            isFeatured: project.isFeatured,
            coverImage: "",
        });
        setShowForm(true);
    }

    function resetForm() {
        setForm({
            titleAr: "",
            titleEn: "",
            summaryAr: "",
            summaryEn: "",
            bodyAr: "",
            bodyEn: "",
            previewUrl: "",
            skills: "",
            buildTime: "",
            order: 0,
            isPublished: false,
            isFeatured: false,
            coverImage: "",
        });
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Projects</h2>
                <button
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditing(null);
                        resetForm();
                    }}
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                >
                    {showForm ? "Cancel" : "+ New Project"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 space-y-4 rounded-xl border border-gray-800 bg-[#0D1117] p-6"
                >
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
                            placeholder="Summary (English)"
                            value={form.summaryEn}
                            onChange={(e) => setForm({ ...form, summaryEn: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            rows={2}
                        />
                        <textarea
                            placeholder="الملخص (عربي)"
                            value={form.summaryAr}
                            onChange={(e) => setForm({ ...form, summaryAr: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            rows={2}
                            dir="rtl"
                        />
                        <textarea
                            placeholder="Full Story (English)"
                            value={form.bodyEn}
                            onChange={(e) => setForm({ ...form, bodyEn: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            rows={4}
                        />
                        <textarea
                            placeholder="القصة الكاملة (عربي)"
                            value={form.bodyAr}
                            onChange={(e) => setForm({ ...form, bodyAr: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                            rows={4}
                            dir="rtl"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <input
                            placeholder="Preview URL"
                            value={form.previewUrl}
                            onChange={(e) => setForm({ ...form, previewUrl: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                        />
                        <input
                            placeholder="Skills (comma separated)"
                            value={form.skills}
                            onChange={(e) => setForm({ ...form, skills: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                        />
                        <input
                            placeholder="Build Time"
                            value={form.buildTime}
                            onChange={(e) => setForm({ ...form, buildTime: e.target.value })}
                            className="rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                        />
                    </div>

                    {/* Project Cover Image Upload */}
                    <ImageUpload
                        value={form.coverImage}
                        onChange={(url) => setForm({ ...form, coverImage: url })}
                        folder="projects"
                        label="Project Cover Image"
                    />

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={form.isPublished}
                                onChange={(e) =>
                                    setForm({ ...form, isPublished: e.target.checked })
                                }
                                className="rounded"
                            />
                            Published
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-300">
                            <input
                                type="checkbox"
                                checked={form.isFeatured}
                                onChange={(e) =>
                                    setForm({ ...form, isFeatured: e.target.checked })
                                }
                                className="rounded"
                            />
                            Featured
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
                    >
                        {editing ? "Update Project" : "Create Project"}
                    </button>
                </form>
            )}

            {/* Projects List */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                </div>
            ) : projects.length === 0 ? (
                <div className="rounded-xl border border-gray-800 bg-[#0D1117] p-12 text-center">
                    <p className="text-gray-400">No projects yet. Create your first project!</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-800">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800/50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-300">
                                    Title
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-300">
                                    Slug
                                </th>
                                <th className="px-4 py-3 text-center font-medium text-gray-300">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-gray-300">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-800/30">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-white">{project.titleEn}</p>
                                            <p className="text-xs text-gray-400" dir="rtl">
                                                {project.titleAr}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{project.slug}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => togglePublish(project)}
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${project.isPublished
                                                ? "bg-green-500/10 text-green-400"
                                                : "bg-gray-700 text-gray-400"
                                                }`}
                                        >
                                            {project.isPublished ? "Published" : "Draft"}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => editProject(project)}
                                            className="mr-2 text-teal-400 hover:text-teal-300"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
