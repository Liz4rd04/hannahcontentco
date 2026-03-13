import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import ClientForm from "@/components/admin/ClientForm";
import type { Client } from "@/lib/types";

interface Props {
  params: Promise<{ clientId: string }>;
}

export default async function EditClientPage({ params }: Props) {
  const { clientId } = await params;
  const supabase = await createServerSupabase();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", clientId)
    .single();

  if (!client) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900">Edit Client</h1>
      <p className="mt-1 text-sm text-surface-500">
        Update {(client as Client).name}&apos;s details.
      </p>
      <div className="mt-6">
        <ClientForm client={client as Client} />
      </div>
    </div>
  );
}
