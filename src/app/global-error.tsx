"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container page-hero">
          <h1>ScamShield could not load</h1>
          <p>Reload the application and try your check again.</p>
          <button className="button" onClick={reset}>
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
