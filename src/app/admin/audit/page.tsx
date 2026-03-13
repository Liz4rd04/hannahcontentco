import { createServerSupabase } from "@/lib/supabase/server";
import { ScrollText } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

export default async function AuditPage() {
  const supabase = await createServerSupabase();
  const { data: logs } = await supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900">Audit Log</h1>
      <p className="mt-1 text-sm text-surface-500">Recent activity across your account.</p>

      {logs && logs.length > 0 ? (
        <div className="mt-6 card p-0 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-surface-100 bg-surface-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-surface-500">Time</th>
                <th className="px-4 py-3 text-left font-medium text-surface-500">Action</th>
                <th className="px-4 py-3 text-left font-medium text-surface-500">Entity</th>
                <th className="px-4 py-3 text-left font-medium text-surface-500">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {logs.map((log: any) => (
                <tr key={log.id} className="hover:bg-surface-50">
                  <td className="px-4 py-3 text-surface-500 whitespace-nowrap">
                    {formatDateTime(log.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-surface-100 px-2 py-0.5 text-xs font-medium text-surface-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-surface-500">
                    {log.entity_type || "—"}
                  </td>
                  <td className="px-4 py-3 text-surface-400 text-xs max-w-[200px] truncate">
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 card text-center py-16">
          <ScrollText className="mx-auto h-10 w-10 text-surface-300" />
          <p className="mt-3 text-sm text-surface-500">No activity yet.</p>
        </div>
      )}
    </div>
  );
}
