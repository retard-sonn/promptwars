"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/icon";
import { PageHero } from "@/components/layout/page-hero";
import { useRegion } from "@/components/layout/region-provider";
import { CopyButton } from "@/features/report/copy-button";
import { buildChecklist, emergencyOptions, type EmergencyAction } from "./emergency-data";

export function EmergencyFlow() {
  const { region } = useRegion();
  const [actions, setActions] = useState<EmergencyAction[]>([]);
  const checklist = buildChecklist(actions, region);
  function toggle(action: EmergencyAction) {
    setActions((current) =>
      current.includes(action)
        ? current.filter((item) => item !== action)
        : [...current, action],
    );
  }
  return (
    <main className="help-page">
      <PageHero title="If you already clicked, paid or shared a code">
        <p>
          Choose everything that happened. The checklist is ordered for the first hour,
          the first day and the first week. If money is still moving, call your bank
          first.
        </p>
      </PageHero>
      <div className="container emergency-layout">
        <fieldset className="emergency-choices glass-strong panel-40">
          <legend>What did you do?</legend>
          {emergencyOptions.map(([value, label]) => (
            <label
              key={value}
              className={
                actions.includes(value)
                  ? "emergency-choice emergency-choice-active"
                  : "emergency-choice"
              }
            >
              <input
                type="checkbox"
                checked={actions.includes(value)}
                onChange={() => toggle(value)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>
        <section className="emergency-results" aria-live="polite">
          {!actions.length ? (
            <div className="practice-empty glass-tint panel-28">
              <Icon name="clock" size={42} />
              <h2>Your checklist appears here</h2>
              <p>
                You can choose more than one action. Payment and shared-code steps come
                first.
              </p>
            </div>
          ) : (
            <div className="timeline">
              {(
                [
                  ["First hour", checklist.hour],
                  ["First day", checklist.day],
                  ["First week", checklist.week],
                ] as const
              ).map(([title, items]) => (
                <section className="timeline-block glass-strong panel-28" key={title}>
                  <h2>{title}</h2>
                  <ol>
                    {items.map((item, index) => (
                      <li key={item}>
                        <span>{item}</span>
                        <CopyButton text={item} label={`Copy step ${index + 1}`} />
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
