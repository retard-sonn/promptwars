"use client";

import { districtCount, type District } from "@/lib/data/patterns";

const districts: District[] = ["Banks", "Delivery", "Government"];
export default function PixelDistrictMap({ selected = null, onSelect }: { selected?: District | null; onSelect?: (district: District) => void }) {
  return <div className="pixel-districts" aria-label="Pattern districts">
    {districts.map((district, index) => <button type="button" className={selected === district ? "pixel-district pixel-district-active" : "pixel-district"} key={district} onClick={() => onSelect?.(district)}>
      <span className="pixel-city" aria-hidden="true">
        <span className="pixel-building" style={{ height: `${districtCount(district) * 22 + 40}px` }}><i /><i /><i /></span>
        {index === 1 ? <span className="pixel-parcel" /> : index === 0 ? <span className="pixel-coin" /> : <span className="pixel-flag" />}
      </span>
      <strong>{district}</strong><span>{districtCount(district)} patterns</span>
    </button>)}
  </div>;
}
