"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileImage, FileVideo } from "lucide-react";
import { toast } from "sonner";

interface Props {
  clientId: string;
  albumId: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
}

export default function MediaUploader({ clientId, albumId }: Props) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback((accepted: File[]) => {
    const newFiles = accepted.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      "video/*": [".mp4", ".mov", ".webm"],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  async function uploadAll() {
    setUploading(true);
    const pendingFiles = files.filter((f) => f.status === "pending");

    for (let i = 0; i < pendingFiles.length; i++) {
      const f = pendingFiles[i];
      setFiles((prev) =>
        prev.map((p) =>
          p.file === f.file ? { ...p, status: "uploading" as const } : p
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", f.file);
        formData.append("clientId", clientId);
        formData.append("albumId", albumId);

        const res = await fetch("/api/admin/media/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error();

        setFiles((prev) =>
          prev.map((p) =>
            p.file === f.file
              ? { ...p, status: "done" as const, progress: 100 }
              : p
          )
        );
      } catch {
        setFiles((prev) =>
          prev.map((p) =>
            p.file === f.file ? { ...p, status: "error" as const } : p
          )
        );
      }
    }

    setUploading(false);
    const doneCount = files.filter((f) => f.status !== "error").length;
    if (doneCount > 0) {
      toast.success(`${pendingFiles.length} file(s) uploaded!`);
      router.refresh();
    }
  }

  function removeFile(file: File) {
    setFiles((prev) => prev.filter((f) => f.file !== file));
  }

  function clearDone() {
    setFiles((prev) => prev.filter((f) => f.status !== "done"));
  }

  return (
    <div className="card">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive
            ? "border-brand-400 bg-brand-50"
            : "border-surface-200 hover:border-surface-300 hover:bg-surface-50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-surface-400" />
        <p className="mt-2 text-sm text-surface-600">
          {isDragActive ? (
            "Drop files here..."
          ) : (
            <>
              Drag &amp; drop photos or videos, or{" "}
              <span className="font-medium text-brand-600">browse</span>
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-surface-400">
          JPG, PNG, WebP, GIF, MP4, MOV · Max 100MB each
        </p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((f, i) => (
            <div
              key={`${f.file.name}-${i}`}
              className="flex items-center gap-3 rounded-lg border border-surface-100 px-3 py-2"
            >
              {f.file.type.startsWith("image") ? (
                <FileImage className="h-5 w-5 shrink-0 text-blue-500" />
              ) : (
                <FileVideo className="h-5 w-5 shrink-0 text-purple-500" />
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm text-surface-700">{f.file.name}</p>
                <p className="text-xs text-surface-400">
                  {(f.file.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              {f.status === "done" && (
                <span className="text-xs font-medium text-green-600">Done</span>
              )}
              {f.status === "error" && (
                <span className="text-xs font-medium text-red-500">Error</span>
              )}
              {f.status === "uploading" && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
              )}
              {f.status === "pending" && (
                <button
                  onClick={() => removeFile(f.file)}
                  className="rounded p-1 text-surface-400 hover:bg-surface-100 hover:text-surface-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            {files.some((f) => f.status === "pending") && (
              <button
                onClick={uploadAll}
                disabled={uploading}
                className="btn-primary"
              >
                {uploading ? "Uploading..." : `Upload ${files.filter((f) => f.status === "pending").length} File(s)`}
              </button>
            )}
            {files.some((f) => f.status === "done") && (
              <button onClick={clearDone} className="btn-ghost text-sm">
                Clear Completed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
