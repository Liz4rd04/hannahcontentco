import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-surface-200">404</p>
        <h1 className="mt-4 text-2xl font-bold text-surface-900">Page Not Found</h1>
        <p className="mt-2 text-surface-500">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn-primary mt-6 inline-flex">
          Go Home
        </Link>
      </div>
    </div>
  );
}
