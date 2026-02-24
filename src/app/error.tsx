/**
 * @file src/app/error.tsx
 * @version v1.0.1
 */
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
      <p className="mb-8 text-muted-foreground">{error.message}</p>
      <button
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
