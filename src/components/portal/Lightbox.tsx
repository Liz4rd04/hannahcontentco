"use client";

import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Download, Play } from "lucide-react";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string;
  caption: string | null;
  filename: string;
}

interface LightboxProps {
  items: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  slug: string;
}

export default function Lightbox({
  items,
  currentIndex,
  onClose,
  onNavigate,
  slug,
}: LightboxProps) {
  const current = items[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) onNavigate(currentIndex - 1);
  }, [hasPrev, currentIndex, onNavigate]);

  const goNext = useCallback(() => {
    if (hasNext) onNavigate(currentIndex + 1);
  }, [hasNext, currentIndex, onNavigate]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, goPrev, goNext]);

  async function handleDownload() {
    try {
      const res = await fetch(
        `/api/client/download?slug=${slug}&mediaId=${current.id}`
      );
      const json = await res.json();
      if (json.data?.url) {
        window.open(json.data.url, "_blank");
      }
    } catch {
      // Silent fail
    }
  }

  if (!current) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="text-sm text-white/60">
          {currentIndex + 1} / {items.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Download"
          >
            <Download size={20} />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center relative min-h-0">
        {/* Prev button */}
        {hasPrev && (
          <button
            onClick={goPrev}
            className="absolute left-2 z-10 rounded-full bg-black/40 p-2 text-white/80 hover:bg-black/60 hover:text-white transition-colors sm:left-4 sm:p-3"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* Media */}
        <div className="flex h-full w-full items-center justify-center px-12 sm:px-20">
          {current.type === "image" ? (
            <img
              src={current.url}
              alt={current.caption || current.filename}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <video
              src={current.url}
              controls
              autoPlay
              className="max-h-full max-w-full"
            >
              <track kind="captions" />
            </video>
          )}
        </div>

        {/* Next button */}
        {hasNext && (
          <button
            onClick={goNext}
            className="absolute right-2 z-10 rounded-full bg-black/40 p-2 text-white/80 hover:bg-black/60 hover:text-white transition-colors sm:right-4 sm:p-3"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Caption */}
      {current.caption && (
        <div className="px-4 py-3 text-center">
          <p className="text-sm text-white/70">{current.caption}</p>
        </div>
      )}
    </div>
  );
}
