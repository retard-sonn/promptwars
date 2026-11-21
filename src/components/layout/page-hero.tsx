import type { ReactNode } from "react";

export function PageHero({ title, children }: { title: string; children: ReactNode }) {
  return (
    <header className="page-hero container">
      <h1>{title}</h1>
      <div className="page-hero-copy">{children}</div>
    </header>
  );
}
