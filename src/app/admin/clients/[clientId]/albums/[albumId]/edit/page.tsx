"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function EditAlbumPage() {
  const params = useParams();
  const clientId = params.clientId as string;
  const albumId = params.albumId as string;
  const router = useRouter();

  const [form, setForm] = useState({ title: "", description: "", is_published: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/albums/${albumId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.data) {
          setForm({
            title: data.data.title || "",
            description: data.data.description || "",
            is_published: data.data.is_published || false,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [albumId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/albums/${albumId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Album updated!");
      router.push(`/admin/clients/${clientId}/albums/${albumId}`);
      router.refresh();
    } catch {
      toast.error("Failed to update album");
      setSaving(false);
    }
  }

  if (loading) return <div className="py-20 text-center text-sm text-surface-400">Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900">Edit Album</h1>
      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
        <div>
          <label htmlFor="title" className="label">Album Title *</label>
          <input id="title" type="text" className="input-field" value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        </div>
        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" rows={3} className="input-field resize-none" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="flex items-center gap-3">
          <input id="is_published" type="checkbox"
            className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          <label htmlFor="is_published" className="text-sm text-surface-700">
            Published (visible in client portal)
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Update Album"}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}
