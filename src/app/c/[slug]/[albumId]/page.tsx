"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Image as ImageIcon,
} from "lucide-react";

interface MediaItem {
  id: string;
  type: "image" | "video";
  filename: string;
  caption: string | null;
  url: string;
  thumbnailUrl: string;
  width: number | null;
  height: number | null;
}

export default function PortalAlbumPage() {
  const params = useParams();
  const slug = params.slug as string;
  const albumId = params.albumId as string;

  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/client/media?slug=${slug}&albumId=${albumId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setAlbumTitle(data.data.album.title);
        setAlbumDesc(data.data.album.description || "");
        setMedia(data.data.media);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, albumId]);

  async function handleDownload(mediaId: string, filename: string) {
    setDownloading(mediaId);
    try {
      const res = await fetch(
        `/api/client/download?slug=${slug}&mediaId=${mediaId}`
      );
      const data = await res.json();
      if (data.data?.url) {
        const a = document.createElement("a");
        a.href = data.data.url;
        a.download = filename;
        a.click();
      }
    } catch {
      // silent fail
    } finally {
      setDownloading(null);
    }
  }

  function openLightbox(index: number) {
    setLightboxIndex(index);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightboxIndex(null);
    document.body.style.overflow = "";
  }

  function prevSlide() {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? media.length - 1 : lightboxIndex - 1);
    }
  }

  function nextSlide() {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === media.length - 1 ? 0 : lightboxIndex + 1);
    }
  }

  // Keyboard nav for lightbox
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href={`/c/${slug}`}
        className="inline-flex items-center text-sm text-surface-500 hover:text-surface-700 mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        All Albums
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">{albumTitle}</h1>
          {albumDesc && (
            <p className="mt-1 text-sm text-surface-500">{albumDesc}</p>
          )}
        </div>
        <p className="text-sm text-surface-400">
          {media.length} file{media.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Gallery Grid */}
      {media.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.map((m, i) => (
            <div
              key={m.id}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-200 bg-surface-100"
              onClick={() => openLightbox(i)}
            >
              <div className="aspect-square relative">
                {m.type === "image" ? (
                  <img
                    src={m.thumbnailUrl || m.url}
                    alt={m.caption || m.filename}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-surface-200">
                    <Play className="h-10 w-10 text-surface-400" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex w-full items-center justify-between p-3">
                    <p className="truncate text-xs text-white/90">
                      {m.caption || m.filename}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(m.id, m.filename);
                      }}
                      className="rounded-full bg-white/20 p-1.5 text-white hover:bg-white/40 transition-colors"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-surface-300" />
          <p className="mt-4 text-surface-500">No media in this album yet.</p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && media[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Nav prev */}
          {media.length > 1 && (
            <button
              onClick={prevSlide}
              className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Content */}
          <div className="max-h-[85vh] max-w-[90vw]">
            {media[lightboxIndex].type === "image" ? (
              <img
                src={media[lightboxIndex].url}
                alt={media[lightboxIndex].caption || media[lightboxIndex].filename}
                className="max-h-[85vh] max-w-[90vw] object-contain"
              />
            ) : (
              <video
                src={media[lightboxIndex].url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-[90vw]"
              />
            )}
          </div>

          {/* Nav next */}
          {media.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors top-1/2 -translate-y-1/2"
              style={{ right: "1rem" }}
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Caption + Download bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
            <div>
              <p className="text-sm text-white">
                {media[lightboxIndex].caption || media[lightboxIndex].filename}
              </p>
              <p className="text-xs text-white/60">
                {lightboxIndex + 1} of {media.length}
              </p>
            </div>
            <button
              onClick={() =>
                handleDownload(
                  media[lightboxIndex!].id,
                  media[lightboxIndex!].filename
                )
              }
              disabled={downloading === media[lightboxIndex].id}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
            >
              <Download size={16} />
              {downloading === media[lightboxIndex].id
                ? "Downloading..."
                : "Download"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 border-t border-surface-200 pt-6 text-center text-xs text-surface-400">
        Powered by HannahContentCo
      </div>
    </div>
  );
}
