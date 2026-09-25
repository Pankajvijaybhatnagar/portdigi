"use client";

import { useRef } from "react";
import Image from "next/image";
import Mascot from "./Mascot";

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function PortfolioCard({ item, index = 0, categoryLabel, onOpen }) {
  const cardRef = useRef(null);
  const hasImage = !!item.image;
  const hasUrl = !!item.website;
  const comingSoon = !!item.comingSoon;
  const domain = hasUrl ? domainOf(item.website) : "";

  // Gentle 3D tilt + light sheen that follow the cursor
  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 7}deg`);
    el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    el.style.setProperty("--mx", `${x * 100}%`);
    el.style.setProperty("--my", `${y * 100}%`);
  };
  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  const open = () => hasUrl && onOpen(item.website);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={open}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && hasUrl && (e.preventDefault(), open())}
      role={hasUrl ? "button" : undefined}
      tabIndex={hasUrl ? 0 : undefined}
      aria-label={hasUrl ? `Open ${item.title}` : undefined}
      className={`tilt-card group relative h-full flex flex-col rounded-[22px] overflow-hidden bg-white border border-silver hover:border-orange/40 hover:shadow-[0_30px_70px_-30px_rgba(17,17,24,0.35)] outline-none focus-visible:ring-2 focus-visible:ring-orange ${
        hasUrl ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-3 px-4 h-9 bg-cloud border-b border-silver flex-shrink-0">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="w-2.5 h-2.5 rounded-full bg-orange" />
          <span className="w-2.5 h-2.5 rounded-full bg-navy" />
          <span className="w-2.5 h-2.5 rounded-full bg-silver" />
        </span>
        <span className="flex-1 min-w-0 truncate text-center text-[11px] font-semibold text-muted bg-white rounded-full px-3 py-1 border border-silver">
          {domain || (comingSoon ? "in development…" : item.tag)}
        </span>
        <span className="w-8 text-right text-[10px] font-bold text-muted/70 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* media */}
      <div className="relative h-[230px] sm:h-[260px] lg:h-[280px] overflow-hidden flex-shrink-0">
        {hasImage ? (
          <>
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
            />
            {/* hover reveal */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-x-0 bottom-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              {item.blurb && <p className="text-white/90 text-[13px] leading-[1.6] mb-3 max-w-[480px]">{item.blurb}</p>}
              {hasUrl && (
                <span className="inline-flex items-center gap-1.5 bg-white text-ink text-[12px] font-bold px-4 py-2 rounded-full">
                  View live site <span aria-hidden="true">↗</span>
                </span>
              )}
            </div>
          </>
        ) : comingSoon ? (
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#26267A] to-ink flex flex-col items-center justify-center gap-4 p-6">
            <svg viewBox="-60 -70 120 80" className="w-[150px] h-[100px]" aria-hidden="true">
              <line x1="-55" y1="0" x2="55" y2="0" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6 6" />
              <g transform="scale(1.1)">
                <Mascot pose="run" />
              </g>
            </svg>
            <div className="text-center">
              <div className="font-display text-lg font-extrabold text-white">{item.tag}</div>
              <div className="text-[11px] tracking-[3px] uppercase text-white/50 mt-1">In the works</div>
            </div>
            <div className="shimmer-bar w-40 h-1.5 rounded-full bg-white/15" aria-hidden="true" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-ink flex flex-col items-center justify-center gap-3 p-8">
            <div className="font-display text-lg font-bold text-white text-center">{item.tag}</div>
            <div className="text-[10px] tracking-[3px] uppercase text-white/35 text-center">
              {hasUrl ? "Click to view website" : "Add image in CONFIG"}
            </div>
          </div>
        )}

        {comingSoon && (
          <span className="absolute top-3 right-3 bg-orange text-ink text-[11px] font-bold px-3 py-1.5 rounded-full">
            Coming Soon
          </span>
        )}

        <div className="card-shine absolute inset-0 pointer-events-none" aria-hidden="true" />
      </div>

      {/* footer */}
      <div className="flex items-center justify-between gap-4 px-5 py-4 flex-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-orange">{item.tag}</span>
            {categoryLabel && (
              <span className="text-[10px] font-semibold text-muted bg-cloud border border-silver rounded-full px-2 py-0.5">
                {categoryLabel}
              </span>
            )}
          </div>
          <div className="text-[15px] font-bold text-ink leading-snug">{item.title}</div>
        </div>
        <div
          className={`w-10 h-10 rounded-full border flex items-center justify-center text-[15px] flex-shrink-0 transition-all duration-300 ${
            hasUrl
              ? "border-silver text-ink group-hover:bg-orange group-hover:border-orange group-hover:text-white group-hover:rotate-45"
              : "border-silver text-muted"
          }`}
          aria-hidden="true"
        >
          {hasUrl ? "↑" : comingSoon ? "···" : "→"}
        </div>
      </div>
    </div>
  );
}
