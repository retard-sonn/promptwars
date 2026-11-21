"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { Flip } from "gsap/Flip";
import { analyzeMessage } from "@/lib/analysis/analyze";
import { patterns } from "@/lib/data/patterns";
import { useSceneStore } from "@/lib/state/scene-store";

gsap.registerPlugin(useGSAP, ScrollTrigger, MorphSVGPlugin, Flip);
const DistrictMap = dynamic(() => import("@/features/scenes/pixel-district-map"), { ssr: false });
const sample = analyzeMessage("India Post parcel is held. Pay Rs 49 redelivery fee at https://indiapost-redelivery.example/pay.", "in");
export function StoryChapters() {
  const root = useRef<HTMLElement>(null);
  const setProgress = useSceneStore((state) => state.setChapterProgress);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const chapters = gsap.utils.toArray<HTMLElement>(".story-chapter");
      ScrollTrigger.batch(chapters, {
        start: "top 94%",
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "expo.out" }),
      });
      ScrollTrigger.create({
        trigger: ".story-message",
        start: "top 90%",
        once: true,
        onEnter: () => {
          const chips = gsap.utils.toArray<HTMLElement>(".story-chip");
          const state = Flip.getState(chips);
          chips.forEach((chip) => chip.classList.add("story-chip-lift"));
          Flip.from(state, { duration: 0.5, absolute: false, ease: "expo.out" });
        },
      });
      ScrollTrigger.create({
        trigger: ".story-sources",
        start: "top 88%",
        once: true,
        onEnter: () => gsap.fromTo(".source-nodes > div", { opacity: 0.45 }, { opacity: 1, stagger: 0.12, duration: 0.35 }),
      });
      ScrollTrigger.create({
        trigger: ".story-shield-path",
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(".story-shield-path", { morphSVG: "M50 88 24 62 36 50 50 64 76 36 88 48Z", duration: 0.65 });
          gsap.fromTo(".story-verdict", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45 });
        },
      });
      ScrollTrigger.create({
        trigger: ".story-actions",
        start: "top 88%",
        once: true,
        onEnter: () => gsap.fromTo(".story-action", { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.1, duration: 0.35 }),
      });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => setProgress(self.progress),
      });
    });
    return () => {
      media.revert();
      setProgress(0);
    };
  }, { scope: root });
  return <section className="story-shell container" ref={root} aria-labelledby="story-title">
    <h2 id="story-title">How a check works</h2>
    <div className="story-stage">
      <article className="story-chapter story-message">
        <div><h3>The message</h3><p>The engine keeps the original text and marks exact evidence spans. This example has {sample.signals.length} rule signals.</p></div>
        <div className="story-sample glass-strong"><strong>India Post</strong><p>Your parcel is held. <span className="story-chip">Pay Rs 49 redelivery fee</span> at <span className="story-chip">indiapost-redelivery.example/pay</span>.</p></div>
      </article>
      <article className="story-chapter story-link">
        <div><h3>The link</h3><p>The destination is separated into its parts and compared with official domains for the selected region.</p></div>
        <div className="story-url-parts">{[["scheme", "https"], ["subdomain", "(none)"], ["domain", "indiapost-redelivery"], ["TLD", "example"], ["path", "/pay"]].map(([name, value]) => <div key={name}><span>{name}</span><code>{value}</code></div>)}</div>
        <p className="story-compare">indiapost-redelivery.example <span>does not match</span> indiapost.gov.in</p>
      </article>
      <article className="story-chapter story-sources">
        <div><h3>The sources</h3><p>Optional threat sources check only the extracted URL. The report shows which sources ran and which were unavailable.</p></div>
        <div className="source-nodes">{["URLhaus", "Google Web Risk", "OpenPhish", "VirusTotal"].map((source, index) => <div className="glass" key={source}><span className="source-line" style={{ height: `${44 + index * 18}px` }} /><strong>{source}</strong><span>Optional source</span></div>)}</div>
      </article>
      <article className="story-chapter story-shield">
        <div><h3>The verdict</h3><p>The score combines the highest signal in each tactic with smaller supporting evidence. This is the actual result for the example.</p></div>
        <svg viewBox="0 0 100 100" aria-hidden="true"><path className="story-shield-path" d="M50 6 88 22v30c0 26-16 40-38 46C28 92 12 78 12 52V22Z" fill="var(--persimmon-300)" stroke="var(--ink)" strokeWidth="2" /></svg>
        <div className="story-verdict"><strong>{sample.verdict}</strong><span className="data">{sample.score}/100</span></div>
      </article>
      <article className="story-chapter story-actions">
        <div><h3>What to do</h3><p>Actions are ordered for the verdict and region. The district heights below come from the {patterns.length} patterns in the library.</p></div>
        <div className="story-checklist">{["Do not pay or use the link.", "Contact India Post through its official app or website.", "Keep the message as evidence.", "Report suspected fraud through the official regional channel."].map((action) => <p className="story-action" key={action}>{action}</p>)}</div>
        <DistrictMap />
      </article>
    </div>
  </section>;
}
