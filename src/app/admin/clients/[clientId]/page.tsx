import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import {
  Edit,
  Plus,
  FolderOpen,
  Link2,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import type { Client, Album } from "@/lib/types";
import DeleteClientButton from "@/components/admin/DeleteClientButton";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { clientId } = await params;
  const supabase = await createServerSupabase();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (!client) notFound();

  const { data: albums } = await supabase
    .from("albums")
    .select("*, media(count)")
    .eq("client_id", clientId)
    .order("sort_order")
    .order("created_at", { ascending: false });

  const { data: activeToken } = await supabase
    .from("client_access_tokens")
    .select("id, created_at")
    .eq("client_id", clientId)
    .eq("is_active", true)
    .maybeSingle();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">
            {(client as Client).name}
          </h1>
          <p className="mt-1 text-sm text-surface-400">
            /c/{(client as Client).slug}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/clients/${clientId}/access`}
            className="btn-secondary"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Access Link
          </Link>
          <Link
            href={`/admin/clients/${clientId}/edit`}
            className="btn-secondary"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
          <DeleteClientButton clientId={clientId} clientName={(client as Client).name} />
        </div>
      </div>

      {/* Client Info Card */}
      <div className="mt-6 card">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wide">Contact</p>
            <p className="mt-1 text-sm text-surface-700">
              {(client as Client).contact_name || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wide">Email</p>
            <p className="mt-1 text-sm text-surface-700">
              {(client as Client).contact_email || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wide">Status</p>
            <p className="mt-1">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                  (client as Client).is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-surface-100 text-surface-500"
                }`}
              >
                {(client as Client).is_active ? "Active" : "Inactive"}
              </span>
            </p>
          </div>
        </div>
        {(client as Client).notes && (
          <div className="mt-4 border-t border-surface-100 pt-4">
            <p className="text-xs font-medium text-surface-400 uppercase tracking-wide">Notes</p>
            <p className="mt-1 text-sm text-surface-600">{(client as Client).notes}</p>
          </div>
        )}
      </div>

      {/* Portal Access Status */}
      <div className="mt-4 card flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeToken ? (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
              <span className="text-sm text-surface-700">
                Client portal link is active
              </span>
              <span className="text-xs text-surface-400">
                · Created {new Date(activeToken.created_at).toLocaleDateString()}
              </span>
            </>
          ) : (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-surface-300" />
              <span className="text-sm text-surface-500">
                No active portal link
              </span>
            </>
          )}
        </div>
        <Link
          href={`/admin/clients/${clientId}/access`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Manage
        </Link>
      </div>

      {/* Albums Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-surface-900">Albums</h2>
          <Link
            href={`/admin/clients/${clientId}/albums/new`}
            className="btn-primary text-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Album
          </Link>
        </div>

        {albums && albums.length > 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album: any) => (
              <Link
                key={album.id}
                href={`/admin/clients/${clientId}/albums/${album.id}`}
                className="card hover:shadow-md transition-shadow group"
              >
                <div className="aspect-[3/2] rounded-lg bg-surface-100 mb-3" />
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-surface-900 group-hover:text-brand-600">
                      {album.title}
                    </h3>
                    <p className="mt-1 text-xs text-surface-400">
                      {album.media?.[0]?.count ?? 0} files
                    </p>
                  </div>
                  <span
                    className={`shrink-0 mt-0.5 ${
                      album.is_published ? "text-green-500" : "text-surface-300"
                    }`}
                  >
                    {album.is_published ? <Eye size={16} /> : <EyeOff size={16} />}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 card text-center py-12">
            <FolderOpen className="mx-auto h-8 w-8 text-surface-300" />
            <p className="mt-2 text-sm text-surface-500">No albums yet.</p>
            <Link
              href={`/admin/clients/${clientId}/albums/new`}
              className="btn-primary mt-4 inline-flex text-sm"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Album
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
