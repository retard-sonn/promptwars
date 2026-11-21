"use client";

import { Icon } from "@/components/icons/icon";
import { useSceneStore } from "@/lib/state/scene-store";
import { PixelIntercept } from "@/features/scenes/pixel-intercept";

export function HeroScene() {
  const { status, verdict } = useSceneStore();
  return (
    <div className="hero-scene" data-state={status} data-verdict={verdict} aria-label="Example message inspection">
      <div className="scene-time">9:12</div>
      <div className="scene-dom">
        <div className="scene-card glass-strong">
          <div className="scene-sender"><Icon name="parcel" size={24} /><span>India Post</span></div>
          <p>Your parcel is held at customs. Pay Rs 49 to release it.</p>
          <span className="scene-url data">indiapost-redelivery.example/pay</span>
          <div className="scene-evidence"><span>Payment demand</span><span>Lookalike link</span></div>
        </div>
        <div className="scene-shield"><Icon name={verdict === "No clear signs of fraud" ? "shield-check" : "shield-alert"} size={112} /></div>
        <div className="scene-hook"><Icon name="hook" size={82} /></div>
      </div>
      <PixelIntercept />
      <p className="scene-caption">A held parcel, a payment demand and a domain that does not match India Post.</p>
    </div>
  );
}
