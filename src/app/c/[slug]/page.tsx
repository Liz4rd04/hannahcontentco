"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FolderOpen, Image as ImageIcon } from "lucide-react";

interface AlbumData {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  mediaCount: number;
}

export default function ClientPortalPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [clientName, setClientName] = useState("");
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/client/albums?slug=${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setClientName(data.data.client.name);
        setAlbums(data.data.albums);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <p className="text-lg font-semibold text-surface-900">Access Denied</p>
          <p className="mt-2 text-sm text-surface-500">
            This link may have expired. Please contact your media team for a new link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-surface-900">{clientName}</h1>
        <p className="mt-2 text-surface-500">Your media gallery</p>
      </div>

      {/* Albums Grid */}
      {albums.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/c/${slug}/${album.id}`}
              className="group overflow-hidden rounded-2xl border border-surface-200 bg-white transition-all hover:shadow-lg hover:border-surface-300"
            >
              <div className="aspect-[4/3] bg-surface-100 relative overflow-hidden">
                {album.coverUrl ? (
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <FolderOpen className="h-12 w-12 text-surface-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-surface-900 group-hover:text-brand-600">
                  {album.title}
                </h2>
                {album.description && (
                  <p className="mt-1 text-sm text-surface-500 line-clamp-2">
                    {album.description}
                  </p>
                )}
                <p className="mt-2 flex items-center gap-1 text-xs text-surface-400">
                  <ImageIcon size={14} />
                  {album.mediaCount} file{album.mediaCount !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-surface-300" />
          <p className="mt-4 text-surface-500">No albums available yet.</p>
          <p className="text-sm text-surface-400">
            Check back soon — your media team is working on it!
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 border-t border-surface-200 pt-6 text-center text-xs text-surface-400">
        Powered by HannahContentCo
      </div>
    </div>
  );
}
