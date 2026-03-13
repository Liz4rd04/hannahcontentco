import { createServerSupabase } from "@/lib/supabase/server";
import { Users, Image, FolderOpen, Activity } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createServerSupabase();

  // Fetch counts
  const [clientsRes, albumsRes, mediaRes] = await Promise.all([
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("albums").select("id", { count: "exact", head: true }),
    supabase.from("media").select("id", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Total Clients",
      value: clientsRes.count ?? 0,
      icon: Users,
      href: "/admin/clients",
    },
    {
      label: "Albums",
      value: albumsRes.count ?? 0,
      icon: FolderOpen,
      href: "/admin/clients",
    },
    {
      label: "Media Files",
      value: mediaRes.count ?? 0,
      icon: Image,
      href: "/admin/clients",
    },
  ];

  // Recent activity
  const { data: recentMedia } = await supabase
    .from("media")
    .select("id, filename, type, created_at, clients(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
      <p className="mt-1 text-sm text-surface-500">
        Welcome back. Here&apos;s an overview of your account.
      </p>

      {/* Stats Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-surface-900">{stat.value}</p>
                  <p className="text-sm text-surface-500">{stat.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Uploads */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-surface-900">Recent Uploads</h2>
        {recentMedia && recentMedia.length > 0 ? (
          <div className="mt-4 card p-0 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-surface-100 bg-surface-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-surface-500">File</th>
                  <th className="px-4 py-3 text-left font-medium text-surface-500 hidden sm:table-cell">Client</th>
                  <th className="px-4 py-3 text-left font-medium text-surface-500">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-surface-500 hidden sm:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100">
                {recentMedia.map((m: any) => (
                  <tr key={m.id} className="hover:bg-surface-50">
                    <td className="px-4 py-3 font-medium text-surface-900 truncate max-w-[200px]">
                      {m.filename}
                    </td>
                    <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">
                      {(m.clients as any)?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.type === "image"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">
                      {new Date(m.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4 card text-center text-sm text-surface-400 py-12">
            <Activity className="mx-auto h-8 w-8 mb-2 text-surface-300" />
            No uploads yet. Create a client and start uploading media.
          </div>
        )}
      </div>
    </div>
  );
}
