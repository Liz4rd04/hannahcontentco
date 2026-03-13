"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { slugify } from "@/lib/validations";
import type { Client } from "@/lib/types";

interface Props {
  client?: Client; // If provided, we're editing; otherwise creating
}

export default function ClientForm({ client }: Props) {
  const router = useRouter();
  const isEdit = !!client;

  const [form, setForm] = useState({
    name: client?.name ?? "",
    slug: client?.slug ?? "",
    contact_name: client?.contact_name ?? "",
    contact_email: client?.contact_email ?? "",
    notes: client?.notes ?? "",
    is_active: client?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleNameChange(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEdit ? prev.slug : slugify(name),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const url = isEdit
        ? `/api/admin/clients/${client.id}`
        : "/api/admin/clients";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        else toast.error(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      toast.success(isEdit ? "Client updated!" : "Client created!");
      router.push(`/admin/clients/${data.data.id}`);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div>
        <label htmlFor="name" className="label">Business Name *</label>
        <input
          id="name"
          type="text"
          className="input-field"
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="Bob's Burgers"
          required
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="slug" className="label">URL Slug *</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-surface-400">/c/</span>
          <input
            id="slug"
            type="text"
            className="input-field"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
            placeholder="bobs-burgers"
            required
          />
        </div>
        {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug}</p>}
      </div>

      <div>
        <label htmlFor="contact_name" className="label">Contact Name</label>
        <input
          id="contact_name"
          type="text"
          className="input-field"
          value={form.contact_name}
          onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
          placeholder="Bob Belcher"
        />
      </div>

      <div>
        <label htmlFor="contact_email" className="label">Contact Email</label>
        <input
          id="contact_email"
          type="email"
          className="input-field"
          value={form.contact_email}
          onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
          placeholder="bob@bobsburgers.com"
        />
      </div>

      <div>
        <label htmlFor="notes" className="label">Notes</label>
        <textarea
          id="notes"
          rows={3}
          className="input-field resize-none"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Internal notes about this client..."
        />
      </div>

      {isEdit && (
        <div className="flex items-center gap-3">
          <input
            id="is_active"
            type="checkbox"
            className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
            checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
          />
          <label htmlFor="is_active" className="text-sm text-surface-700">Active</label>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Client" : "Create Client"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
