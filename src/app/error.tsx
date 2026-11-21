"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container page-hero">
      <h1>Something went wrong</h1>
      <p>The page could not be completed. Your message has not been saved.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
