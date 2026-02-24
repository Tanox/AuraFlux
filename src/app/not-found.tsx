/**
 * @file src/app/not-found.tsx
 * @version v1.0.1
 */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <h2 className="mb-4 text-4xl font-bold">404</h2>
      <p className="mb-8 text-xl text-muted-foreground">Page Not Found</p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  );
}
