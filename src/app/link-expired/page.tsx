import Link from "next/link";
import { LinkIcon } from "lucide-react";

export default function LinkExpiredPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-100">
          <LinkIcon className="h-8 w-8 text-surface-400" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900">Link Expired</h1>
        <p className="mt-3 text-surface-500">
          This access link is no longer valid. It may have been rotated or
          expired. Please contact your media team for a new link.
        </p>
        <Link href="/" className="btn-secondary mt-6 inline-flex">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
