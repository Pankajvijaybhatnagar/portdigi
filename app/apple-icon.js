import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111118",
          fontFamily: "sans-serif",
          fontWeight: 900,
          fontSize: 100,
          color: "#F5A623",
        }}
      >
        1
      </div>
    ),
    { ...size }
  );
}
