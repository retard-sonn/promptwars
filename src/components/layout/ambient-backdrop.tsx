import { parallax, progress } from "@/lib/string-tune";

export function AmbientBackdrop() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__blob ambient__blob--one" data-depth="slow" {...parallax("0.72")} />
      <div className="ambient__blob ambient__blob--two" data-depth="slow" {...parallax("0.88")} />
      <div className="ambient__ribbon" data-depth="medium" {...parallax("1.08")} />
      <div className="ambient__detail" data-depth="fast" {...parallax("1.2")} />
      <div className="ambient__progress" {...progress} />
    </div>
  );
}
