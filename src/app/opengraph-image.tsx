import { ImageResponse } from "next/og";

export const alt = "ScamShield message check";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#FFF9F4",
        color: "#0A0A0A",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 540,
          height: 540,
          borderRadius: "45%",
          right: -100,
          top: -180,
          background: "#FFC7A3",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 34,
            fontWeight: 700,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 58,
              height: 66,
              background: "#FF6A1F",
              border: "5px solid #0A0A0A",
              borderRadius: "24px 24px 36px 36px",
            }}
          />
          ScamShield
        </div>
        <div
          style={{
            maxWidth: 820,
            marginTop: 52,
            fontSize: 68,
            lineHeight: 1.02,
            letterSpacing: "-0.04em",
            fontWeight: 650,
          }}
        >
          Check a suspicious message before you reply.
        </div>
        <div style={{ marginTop: 36, fontSize: 28, color: "#0A0A0A" }}>
          Warning signs, link inspection and what to do next.
        </div>
      </div>
    </div>,
    size,
  );
}
