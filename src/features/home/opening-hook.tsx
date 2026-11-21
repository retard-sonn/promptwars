"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";
import { Icon } from "@/components/icons/icon";

gsap.registerPlugin(useGSAP, CustomEase, SplitText);
export function OpeningHook() {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [visible, setVisible] = useState(false);
  const [caption, setCaption] = useState("");
  function finish() {
    timeline.current?.progress(1);
    setVisible(false);
  }
  useGSAP(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("scamshield:intro") === "seen";
      sessionStorage.setItem("scamshield:intro", "seen");
    } catch {
      seen = false;
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setVisible(true);
    const ease = CustomEase.create("shield-enter", "0.16,1,0.3,1");
    const h1 = document.querySelector(".hero-copy h1");
    const tl = gsap.timeline({ defaults: { ease }, onComplete: () => setVisible(false) });
    timeline.current = tl;
    tl.fromTo(".opening-card", { y: -90, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55 }, 0.6)
      .to(".opening-card", { rotation: 1.5, duration: 0.08, yoyo: true, repeat: 3 }, 0.78)
      .call(() => setCaption("A text arrives on a Tuesday morning."), [], 0.65)
      .fromTo(".opening-message", { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.2 }, 0.9)
      .call(() => setCaption("It says your parcel is held and asks for Rs 49."), [], 2.5)
      .to(".opening-card", { scale: 1.06, duration: 0.7 }, 2.5)
      .to(".opening-payment", { borderBottomColor: "var(--persimmon-600)", duration: 0.25 }, 2.5)
      .call(() => setCaption("The sender name looks right. The link almost does."), [], 4.5)
      .to(".opening-link", { scale: 1.12, letterSpacing: "0.04em", duration: 0.55 }, 4.5)
      .to(".opening-wrong", { color: "var(--alarm)", scale: 1.2, duration: 0.35 }, 4.8)
      .call(() => setCaption("ScamShield reads it before you tap."), [], 6.5)
      .fromTo(".opening-loupe", { x: -80, autoAlpha: 0 }, { x: 260, autoAlpha: 1, duration: 0.8 }, 6.5)
      .fromTo(".opening-chip", { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.4 }, 6.8)
      .to(".opening-card", { scale: 0.72, x: 80, autoAlpha: 0.75, duration: 0.8 }, 8)
      .call(() => setCaption(""), [], 8.1);
    let split: SplitText | null = null;
    if (h1) {
      split = SplitText.create(h1, { type: "lines", mask: "lines", ignore: ".inline-icon" });
      tl.from(split.lines, { yPercent: 110, autoAlpha: 0, stagger: 0.12, duration: 0.7 }, 8.1);
    }
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") finish(); };
    const scroll = () => finish();
    window.addEventListener("keydown", key);
    window.addEventListener("scroll", scroll, { passive: true, once: true });
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("scroll", scroll);
      split?.revert();
    };
  }, { scope: root });
  return <div className="opening" ref={root} hidden={!visible}>
    <button className="opening-skip" type="button" onClick={finish}>Skip</button>
    <motion.div className="opening-motion" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
      <div className="opening-card glass-strong">
        <span className="opening-time">9:12</span>
        <strong>India Post</strong>
        <p className="opening-message">Your parcel is held at customs. <span className="opening-payment">Pay Rs 49 to release it.</span></p>
        <span className="opening-link data">indiapost-redeliver<span className="opening-wrong">y</span>.example/pay</span>
        <div className="opening-loupe"><Icon name="loupe" size={54} /></div>
        <div className="opening-chips"><span className="opening-chip">urgency</span><span className="opening-chip">payment demand</span><span className="opening-chip">lookalike link</span></div>
      </div>
    </motion.div>
    {caption ? <p className="opening-caption" aria-live="polite">{caption}</p> : null}
  </div>;
}
