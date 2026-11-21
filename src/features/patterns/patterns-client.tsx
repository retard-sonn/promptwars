"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons/icon";
import { PageHero } from "@/components/layout/page-hero";
import { patterns, type District } from "@/lib/data/patterns";

const DistrictMap = dynamic(() => import("@/features/scenes/pixel-district-map"), { ssr: false });
const districts: District[] = ["Banks", "Delivery", "Government"];
export function PatternsClient() {
  const [district, setDistrict] = useState<District | null>(null);
  const filtered = district ? patterns.filter((pattern) => pattern.district === district) : patterns;
  return <main>
    <PageHero title="Common scam patterns"><p>Compare real example messages, their warning signs and the action to take. Every example uses a reserved domain.</p></PageHero>
    <section className="container pattern-map-section" aria-labelledby="district-title">
      <div className="section-heading"><h2 id="district-title">Pattern districts</h2><button className="chip" type="button" onClick={() => setDistrict(null)}>Show all {patterns.length}</button></div>
      <DistrictMap selected={district} onSelect={(next) => setDistrict(district === next ? null : next)} />
      <div className="district-buttons">{districts.map((name) => <button type="button" className={district === name ? "chip chip-active" : "chip"} key={name} onClick={() => setDistrict(district === name ? null : name)}>{name}</button>)}</div>
    </section>
    <section className="container pattern-library" aria-labelledby="library-title">
      <h2 id="library-title">{district ?? "All patterns"}</h2>
      <div className="pattern-rows">{filtered.map((pattern) => <Link href={`/patterns/${pattern.slug}`} key={pattern.slug} className="pattern-row">
        <div><h3>{pattern.name}</h3><span>{pattern.district}</span></div><p>{pattern.explanation}</p><Icon name="arrow-up-right" size={24} />
      </Link>)}</div>
    </section>
  </main>;
}
