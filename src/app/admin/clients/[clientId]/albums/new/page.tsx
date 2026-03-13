"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewAlbumPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const router = useRouter();

  const [form, setForm] = useState({ title: "", description: "", is_published: false });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, client_id: clientId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Album created!");
      router.push(`/admin/clients/${clientId}/albums/${data.data.id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to create album");
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900">New Album</h1>
      <p className="mt-1 text-sm text-surface-500">
        Create a new album to organize media.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
        <div>
          <label htmlFor="title" className="label">Album Title *</label>
          <input
            id="title"
            type="text"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Spring Menu 2025"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea
            id="description"
            rows={3}
            className="input-field resize-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Photos from the spring menu launch..."
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            id="is_published"
            type="checkbox"
            className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          <label htmlFor="is_published" className="text-sm text-surface-700">
            Published (visible in client portal)
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Album"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
