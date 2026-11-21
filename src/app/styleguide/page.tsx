import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { iconNames } from "@/components/icons/definitions";
import { MotionIcon } from "@/components/icons/motion-icon";
import { RichText } from "@/components/icons/rich-text";
import "./styleguide.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Design system" };

const colours = [
  ["Snow", "#FFF9F4"], ["Cream", "#FFF1E6"], ["Persimmon 100", "#FFE3D1"],
  ["Persimmon 200", "#FFC7A3"], ["Persimmon 300", "#FFA571"],
  ["Persimmon 400", "#FF8340"], ["Persimmon 500", "#FF6A1F"],
  ["Persimmon 600", "#EC5800"], ["Persimmon 700", "#BF4600"],
  ["Ink", "#0A0A0A"], ["Alarm", "#D92D1A"], ["Caution", "#F5A300"], ["Ok", "#1F9D55"],
];

export default function StyleguidePage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="container section">
      <h1>Design system</h1>
      <p className="muted">Tokens and components used by ScamShield.</p>

      <section className="section" aria-labelledby="colours">
        <h2 id="colours">Colour tokens</h2>
        <div className="swatch-grid">
          {colours.map(([name, value]) => (
            <div key={name}>
              <div className="swatch" style={{ background: value }} />
              <strong>{name}</strong>
              <div className="data small">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="type">
        <h2 id="type">Type scale</h2>
        <div className="glass-strong panel-40">
          <h3 className="display-sample">Check the message.</h3>
          <p>Paste a message to see its warning signs, what they mean and what to do next.</p>
          <p className="data">case_9F42C1 · +91 98765 43210 · 72/100</p>
        </div>
      </section>

      <section className="section" aria-labelledby="glass">
        <h2 id="glass">Glass levels</h2>
        <div className="glass-demo">
          <div className="glass panel-28"><h3>Glass</h3><p>Short labels and controls sit on this surface.</p></div>
          <div className="glass-strong panel-28"><h3>Strong glass</h3><p>Longer explanations use this more opaque surface to hold contrast.</p></div>
          <div className="glass-tint panel-28"><h3>Tinted glass</h3><p>Selected states use a restrained persimmon fill.</p></div>
        </div>
      </section>

      <section className="section" aria-labelledby="controls">
        <h2 id="controls">Controls and inline icons</h2>
        <div className="glass-strong panel-40 control-stack">
          <h3><RichText text="Check a suspicious {icon:message} message before you {icon:hook} reply." /></h3>
          <p><RichText text="Inspect every {icon:link} link and keep a copy of the {icon:report} report." /></p>
          <label htmlFor="sample-input">Message</label>
          <textarea id="sample-input" className="input" placeholder="Paste a message" rows={3} />
          <div><button className="button">Check message</button></div>
        </div>
      </section>

      <section className="section" aria-labelledby="icons">
        <h2 id="icons">Custom icons</h2>
        <p className="muted">{iconNames.length} original SVG icons with duotone fills and drawn strokes.</p>
        <div className="icon-grid">
          {iconNames.map((name) => (
            <div className="icon-cell" key={name}>
              <MotionIcon name={name} size={32} />
              <span>{name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
