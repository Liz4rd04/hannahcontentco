import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { createServerSupabase } from "@/lib/supabase/server";
import type { Client } from "@/lib/types";

export default async function ClientsPage() {
  const supabase = await createServerSupabase();
  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Clients</h1>
          <p className="mt-1 text-sm text-surface-500">
            Manage your food &amp; drink clients.
          </p>
        </div>
        <Link href="/admin/clients/new" className="btn-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Client
        </Link>
      </div>

      {clients && clients.length > 0 ? (
        <div className="mt-6 card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-surface-100 bg-surface-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-surface-500">Name</th>
                <th className="px-4 py-3 text-left font-medium text-surface-500 hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-surface-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-surface-500 hidden sm:table-cell">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {(clients as Client[]).map((client) => (
                <tr key={client.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="font-medium text-surface-900 hover:text-brand-600"
                    >
                      {client.name}
                    </Link>
                    <p className="text-xs text-surface-400">/{client.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">
                    {client.contact_name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        client.is_active
                          ? "bg-green-50 text-green-700"
                          : "bg-surface-100 text-surface-500"
                      }`}
                    >
                      {client.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-surface-500 hidden sm:table-cell">
                    {new Date(client.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 card text-center py-16">
          <Users className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-sm text-surface-500">No clients yet.</p>
          <Link href="/admin/clients/new" className="btn-primary mt-4 inline-flex">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Client
          </Link>
        </div>
      )}
    </div>
  );
}
