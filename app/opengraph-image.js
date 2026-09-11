import { ImageResponse } from "next/og";
import { CONFIG } from "@/lib/config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const nameParts = CONFIG.agencyName.split(/(\d)/);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "90px",
          background: "#111118",
        }}
      >
        <div
          style={{
            display: "flex",
            color: "#86868b",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Digital Marketing Agency
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: -3,
            lineHeight: 1.05,
          }}
        >
          {nameParts.map((part, i) =>
            /\d/.test(part) ? (
              <span key={i} style={{ color: "#F5A623" }}>
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "rgba(255,255,255,0.55)",
            marginTop: 28,
            maxWidth: 800,
          }}
        >
          {CONFIG.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
