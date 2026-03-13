"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit3, Image as ImageIcon, Play, X, Save } from "lucide-react";
import { toast } from "sonner";
import type { Media } from "@/lib/types";

interface Props {
  media: Media[];
  clientId: string;
  albumId: string;
}

export default function MediaGrid({ media, clientId, albumId }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const router = useRouter();

  function startEdit(m: Media) {
    setEditingId(m.id);
    setEditCaption(m.caption || "");
  }

  async function saveCaption(mediaId: string) {
    try {
      const res = await fetch(`/api/admin/media`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaId, caption: editCaption }),
      });
      if (!res.ok) throw new Error();
      toast.success("Caption saved!");
      setEditingId(null);
      router.refresh();
    } catch {
      toast.error("Failed to save caption");
    }
  }

  async function deleteMedia(mediaId: string) {
    setDeleting(mediaId);
    try {
      const res = await fetch(`/api/admin/media?mediaId=${mediaId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("File deleted");
      setShowDeleteConfirm(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setDeleting(null);
    }
  }

  if (media.length === 0) {
    return (
      <div className="text-center py-12 text-sm text-surface-400">
        <ImageIcon className="mx-auto h-8 w-8 text-surface-300 mb-2" />
        No media uploaded yet. Use the uploader above to add files.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-surface-500">{media.length} file(s)</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {media.map((m) => (
          <div
            key={m.id}
            className="group relative rounded-lg border border-surface-200 overflow-hidden bg-surface-100"
          >
            {/* Thumbnail */}
            <div className="aspect-square relative">
              {m.type === "image" ? (
                m.thumbnail_url ? (
                  <img
                    src={m.thumbnail_url}
                    alt={m.caption || m.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-surface-300" />
                  </div>
                )
              ) : (
                <div className="flex h-full items-center justify-center bg-surface-200">
                  <Play className="h-8 w-8 text-surface-400" />
                </div>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(m)}
                  className="rounded-full bg-white/90 p-2 text-surface-700 hover:bg-white"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(m.id)}
                  className="rounded-full bg-white/90 p-2 text-red-600 hover:bg-white"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-2">
              <p className="truncate text-xs text-surface-600">{m.filename}</p>
              {m.caption && (
                <p className="truncate text-xs text-surface-400 mt-0.5">{m.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Caption Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="card mx-4 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-900">Edit Caption</h3>
              <button onClick={() => setEditingId(null)} className="btn-ghost p-1">
                <X size={18} />
              </button>
            </div>
            <textarea
              className="input-field resize-none"
              rows={3}
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              placeholder="Add a caption..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setEditingId(null)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={() => saveCaption(editingId)} className="btn-primary">
                <Save className="mr-2 h-4 w-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="card mx-4 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-surface-900">Delete File</h3>
            <p className="mt-2 text-sm text-surface-500">
              This will permanently delete the file. This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn-secondary"
                disabled={!!deleting}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMedia(showDeleteConfirm)}
                className="btn-danger"
                disabled={!!deleting}
              >
                {deleting === showDeleteConfirm ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
