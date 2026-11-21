"use client";

import { Tabs } from "radix-ui";
import { motion } from "motion/react";
import { useState } from "react";
import { Icon } from "@/components/icons/icon";
import { useRegion } from "@/components/layout/region-provider";
import type { Channel } from "@/lib/analysis/types";
import { magnetic } from "@/lib/string-tune";
import { useSceneStore } from "@/lib/state/scene-store";
import type { AnalysisStage } from "./use-analysis";
import { Turnstile } from "./turnstile";

const samples = [
  { label: "Parcel fee", text: "India Post parcel is held. Pay Rs 49 redelivery fee at https://indiapost-redelivery.example/pay." },
  { label: "Bank code", text: "SBI card is blocked. Verify your OTP now at https://sbi-secure.example/unblock." },
  { label: "Delivery update", text: "India Post: Your parcel is out for delivery today. The delivery agent will call before arrival." },
];
type ComposerProps = {
  analyze: (input: { message: string; region: ReturnType<typeof useRegion>["region"]; channel: Channel; image?: File; turnstileToken?: string }) => Promise<void>;
  stage: AnalysisStage;
  error: string | null;
};
export function Composer({ analyze, stage, error }: ComposerProps) {
  const { region } = useRegion();
  const { setStatus } = useSceneStore();
  const [tab, setTab] = useState("message");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [channel, setChannel] = useState<Channel>("unknown");
  const [turnstileToken, setTurnstileToken] = useState<string>();
  const busy = stage === "waiting" || stage === "rules" || stage === "links";
  const detected: Channel = /whatsapp/i.test(message) ? "whatsapp" : /from\s*:|subject\s*:/i.test(message) ? "email" : message ? "sms" : "unknown";
  function changeMessage(value: string) {
    setMessage(value);
    setChannel(detected);
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (tab === "screenshot") {
      if (file) void analyze({ message: "Screenshot upload", region, channel: "unknown", image: file, turnstileToken });
      return;
    }
    const content = tab === "link" ? url.trim() : message.trim();
    if (!content) return;
    void analyze({ message: content, region, channel: tab === "link" ? "unknown" : channel, turnstileToken });
  }
  return (
    <motion.form className="composer glass-strong panel-40" onSubmit={submit} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <Tabs.Root value={tab} onValueChange={setTab}>
        <Tabs.List className="composer-tabs" aria-label="What to check">
          {["message", "screenshot", "link"].map((name) => <Tabs.Trigger value={name} key={name}>
            {tab === name ? <motion.span className="tab-active" layoutId="composer-tab" /> : null}
            <span>{name[0]?.toUpperCase() + name.slice(1)}</span>
          </Tabs.Trigger>)}
        </Tabs.List>
        <Tabs.Content value="message">
          <label htmlFor="message-input">Message</label>
          <textarea id="message-input" className="input composer-input" value={message} onChange={(event) => {
            changeMessage(event.target.value);
            event.currentTarget.style.height = "auto";
            event.currentTarget.style.height = `${Math.min(event.currentTarget.scrollHeight, 260)}px`;
          }} onFocus={() => setStatus("focused")} onBlur={() => setStatus("idle")} placeholder="Paste an SMS, WhatsApp message or email" rows={5} maxLength={12000} />
          <div className="channel-chips" aria-label="Message channel">
            {(["sms", "whatsapp", "email", "unknown"] as Channel[]).map((name) => <button type="button" key={name} className={channel === name ? "chip chip-active" : "chip"} onClick={() => setChannel(name)}>{name === "unknown" ? "Unknown" : name === "sms" ? "SMS" : name[0]?.toUpperCase() + name.slice(1)}</button>)}
          </div>
        </Tabs.Content>
        <Tabs.Content value="screenshot">
          <label htmlFor="screenshot-input">Screenshot</label>
          <div className="file-drop"><Icon name="screenshot" size={30} /><input id="screenshot-input" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setFile(event.target.files?.[0])} /></div>
          <p className="small muted">PNG, JPEG or WebP up to 5MB. The image is discarded after processing unless you choose to save.</p>
        </Tabs.Content>
        <Tabs.Content value="link">
          <label htmlFor="link-input">Link</label>
          <input id="link-input" className="input data" type="text" inputMode="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://example.com/path" />
        </Tabs.Content>
      </Tabs.Root>
      <Turnstile onToken={setTurnstileToken} />
      <input type="hidden" name="turnstileToken" value={turnstileToken} />
      <div className="composer-actions">
        <button className="button" type="submit" {...magnetic} disabled={busy || (tab === "screenshot" ? !file : tab === "link" ? !url.trim() : !message.trim())}>
          <Icon name="scan" size={21} />{busy ? "Checking message" : tab === "link" ? "Check link" : "Check message"}
        </button>
        {busy ? <span role="status" className="small muted">Completed stage: {stage === "waiting" ? "starting" : stage}</span> : null}
      </div>
      <div className="sample-chips" aria-label="Example messages">
        {samples.map((sample) => <button type="button" className="chip" key={sample.label} onClick={() => { setTab("message"); changeMessage(sample.text); }}>{sample.label}</button>)}
      </div>
      <p className="privacy-note small">Nothing is saved unless you choose to save the report.</p>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </motion.form>
  );
}
