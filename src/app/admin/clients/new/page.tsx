import ClientForm from "@/components/admin/ClientForm";

export default function NewClientPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900">New Client</h1>
      <p className="mt-1 text-sm text-surface-500">
        Add a new food &amp; drink business.
      </p>
      <div className="mt-6">
        <ClientForm />
      </div>
    </div>
  );
}
