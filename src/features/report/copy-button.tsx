"use client";

import { useState } from "react";
import { Icon } from "@/components/icons/icon";

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [state, setState] = useState(label);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("Copied");
      setTimeout(() => setState(label), 1800);
    } catch {
      setState("Copy failed");
    }
  }
  return (
    <button type="button" className="copy-button" onClick={copy}>
      <Icon name="copy" size={17} />
      {state}
    </button>
  );
}
