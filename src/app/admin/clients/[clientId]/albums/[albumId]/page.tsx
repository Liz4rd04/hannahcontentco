import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabase } from "@/lib/supabase/server";
import { Edit, Eye, EyeOff, ArrowLeft } from "lucide-react";
import MediaGrid from "@/components/admin/MediaGrid";
import MediaUploader from "@/components/admin/MediaUploader";
import type { Album, Media } from "@/lib/types";

interface Props {
  params: Promise<{ clientId: string; albumId: string }>;
}

export default async function AlbumDetailPage({ params }: Props) {
  const { clientId, albumId } = await params;
  const supabase = await createServerSupabase();

  const { data: album } = await supabase
    .from("albums")
    .select("*")
    .eq("id", albumId)
    .eq("client_id", clientId)
    .single();

  if (!album) notFound();

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("album_id", albumId)
    .order("sort_order")
    .order("created_at", { ascending: false });

  // Generate signed URLs for thumbnails
  const mediaWithUrls: Media[] = [];
  if (media) {
    for (const m of media as Media[]) {
      const path = m.thumbnail_path || m.storage_path;
      const { data: signedUrl } = await supabase.storage
        .from("client-media")
        .createSignedUrl(path, 3600);
      mediaWithUrls.push({
        ...m,
        thumbnail_url: signedUrl?.signedUrl || "",
      });
    }
  }

  return (
    <div>
      {/* Header */}
      <Link
        href={`/admin/clients/${clientId}`}
        className="mb-4 inline-flex items-center text-sm text-surface-500 hover:text-surface-700"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Client
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-surface-900">
            {(album as Album).title}
          </h1>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              (album as Album).is_published
                ? "bg-green-50 text-green-700"
                : "bg-surface-100 text-surface-500"
            }`}
          >
            {(album as Album).is_published ? (
              <>
                <Eye size={12} /> Published
              </>
            ) : (
              <>
                <EyeOff size={12} /> Draft
              </>
            )}
          </span>
        </div>
        <Link
          href={`/admin/clients/${clientId}/albums/${albumId}/edit`}
          className="btn-secondary"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Album
        </Link>
      </div>

      {(album as Album).description && (
        <p className="mt-2 text-sm text-surface-500">
          {(album as Album).description}
        </p>
      )}

      {/* Upload Section */}
      <div className="mt-6">
        <MediaUploader clientId={clientId} albumId={albumId} />
      </div>

      {/* Media Grid */}
      <div className="mt-6">
        <MediaGrid
          media={mediaWithUrls}
          clientId={clientId}
          albumId={albumId}
        />
      </div>
    </div>
  );
}
