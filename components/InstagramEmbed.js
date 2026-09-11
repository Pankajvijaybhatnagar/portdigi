"use client";

import { useEffect } from "react";

const SCRIPT_ID = "instagram-embed-script";

export default function InstagramEmbed({ url }) {
  useEffect(() => {
    function process() {
      if (window.instgrm) window.instgrm.Embeds.process();
    }

    if (window.instgrm) {
      process();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      existing.addEventListener("load", process);
      return () => existing.removeEventListener("load", process);
    }

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = process;
    document.body.appendChild(script);
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        borderRadius: "12px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        margin: "0 auto",
        maxWidth: "400px",
        minWidth: "270px",
        width: "100%",
      }}
    />
  );
}
