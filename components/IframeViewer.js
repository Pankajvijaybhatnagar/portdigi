"use client";

import { useEffect, useRef, useState } from "react";

export default function IframeViewer({ url, onClose }) {
  const [loading, setLoading] = useState(true);
  const frameRef = useRef(null);
  const open = !!url;

  useEffect(() => {
    if (open) {
      setLoading(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, url]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Website Preview"
      className={`fixed inset-0 z-[2000] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center transition-[opacity,visibility] duration-300 ${
        open ? "opacity-100 visible pointer-events-auto" : "opacity-0 invisible pointer-events-none"
      }`}
      aria-hidden={!open}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`w-[100vw] h-[100vh] sm:w-[92vw] sm:max-w-[1300px] sm:h-[88vh] bg-white sm:rounded-lg2 overflow-hidden flex flex-col shadow-[0_40px_120px_rgba(0,0,0,0.5)] transition-transform duration-300 ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        <div className="h-[52px] bg-ink flex items-center justify-between px-5 gap-4 flex-shrink-0">
          <div className="flex gap-[7px]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 bg-white/[0.08] border border-white/[0.12] rounded-full px-4 h-8 flex items-center text-xs text-white/50 overflow-hidden whitespace-nowrap">
            {url}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="bg-white/[0.08] text-white/70 rounded-lg px-3.5 py-1.5 text-xs font-bold hover:bg-white/[0.15] transition-colors"
              onClick={() => url && window.open(url, "_blank", "noopener,noreferrer")}
            >
              ↗ Open
            </button>
            <button
              type="button"
              className="bg-red-500/[0.18] text-[#ff6b6b] rounded-lg px-3.5 py-1.5 text-xs font-bold hover:bg-red-500/30 transition-colors"
              onClick={onClose}
            >
              ✕ Close
            </button>
          </div>
        </div>

        <div className="relative flex-1 flex flex-col">
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white z-[1] transition-opacity duration-300 ${
              // only intercept clicks while the viewer is actually open — otherwise this
              // invisible layer would sit over the middle of the page and block it
              open && loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="w-10 h-10 rounded-full border-[3px] border-silver border-t-orange animate-spin" />
            <div className="text-sm text-muted font-semibold">
              Loading website…
            </div>
          </div>
          <iframe
            ref={frameRef}
            className="flex-1 w-full border-0 bg-white"
            src={open ? url : "about:blank"}
            title="Website Preview"
            allowFullScreen
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  );
}
