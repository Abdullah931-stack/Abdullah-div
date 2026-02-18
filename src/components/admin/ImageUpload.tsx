"use client";

import { useState, useRef } from "react";

/**
 * Reusable Image Upload Component for Admin CMS.
 * Uploads to /api/admin/upload and returns the public URL.
 */
interface ImageUploadProps {
    /** Current image URL (for preview) */
    value: string;
    /** Callback when image is uploaded */
    onChange: (url: string) => void;
    /** Storage folder name */
    folder?: string;
    /** Label text */
    label?: string;
}

export default function ImageUpload({
    value,
    onChange,
    folder = "general",
    label = "Image",
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileRef = useRef<HTMLInputElement>(null);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);

            const res = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (data.success) {
                onChange(data.data.url);
            } else {
                setError(data.error || "Upload failed");
            }
        } catch {
            setError("Upload failed. Please try again.");
        } finally {
            setIsUploading(false);
            // Reset file input so same file can be re-selected
            if (fileRef.current) fileRef.current.value = "";
        }
    }

    function handleRemove() {
        onChange("");
    }

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
                {label}
            </label>

            {/* Preview */}
            {value && (
                <div className="relative inline-block">
                    <img
                        src={value}
                        alt="Preview"
                        className="h-32 w-auto rounded-lg border border-gray-700 object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white hover:bg-red-700"
                        title="Remove image"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Upload Button */}
            <div className="flex items-center gap-3">
                <label
                    className={`cursor-pointer rounded-lg border border-dashed px-4 py-2.5 text-sm transition-colors ${isUploading
                            ? "border-gray-600 text-gray-500"
                            : "border-gray-600 text-gray-400 hover:border-teal-500 hover:text-teal-400"
                        }`}
                >
                    {isUploading ? (
                        <span className="flex items-center gap-2">
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
                            Uploading...
                        </span>
                    ) : (
                        `📁 ${value ? "Change" : "Upload"} ${label}`
                    )}
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={handleUpload}
                        disabled={isUploading}
                        className="hidden"
                    />
                </label>

                {/* Or paste URL manually */}
                <span className="text-xs text-gray-500">or</span>
                <input
                    placeholder="Paste image URL"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                />
            </div>

            {/* Error */}
            {error && (
                <p className="text-xs text-red-400">{error}</p>
            )}
        </div>
    );
}
