"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";

// Typing speeds (ms per character) and pen timings
const SPEED = { eyebrow: 25, heading: 40, body: 7, header: 28, feature: 13, value: 20 };
const MARK_MS = 420; // time a tick / cross takes before typing moves on
const LINE_MS = 380; // underline / strike-through
const ROW_PAUSE = 120; // carriage return between rows

const GREEN = "#1F8A4C";
const RED = "#C8372D";

/**
 * Builds the typing script: every piece of text and every pen mark gets a
 * start time, so one clock drives the whole section in order.
 */
function buildScript(rows) {
  let t = 0;
  const text = (parts, speed, pause = 0) => {
    const len = parts.reduce((n, p) => n + p.text.length, 0);
    const seg = { kind: "text", parts, len, speed, start: t, end: t + len * speed };
    t = seg.end + pause;
    return seg;
  };
  const mark = (ms, pause = 0) => {
    const seg = { kind: "mark", start: t, end: t + ms };
    t = seg.end + pause;
    return seg;
  };

  const eyebrow = text([{ text: "The Difference" }], SPEED.eyebrow, 200);
  const heading = text(
    [
      { text: "Us " },
      { text: "vs.", className: "text-orange" },
      { text: " A Typical Agency" },
    ],
    SPEED.heading,
    250
  );
  const intro = text(
    [{ text: "No fine print, no surprises — see exactly what you get before you sign anything." }],
    SPEED.body,
    300
  );
  const colUs = text(
    [{ text: "Digi" }, { text: "1", className: "text-orange" }, { text: "Xprt" }],
    SPEED.header,
    80
  );
  const colThem = text([{ text: "Typical Agency" }], SPEED.header, ROW_PAUSE);

  const body = rows.map((row) => {
    const feature = text([{ text: row.feature }], SPEED.feature, 80);
    const cell = (value, ours) => {
      if (typeof value === "boolean") return { type: "mark", ok: value, seg: mark(MARK_MS, 60) };
      const typed = text([{ text: value }], SPEED.value, 20);
      return { type: "text", ours, seg: typed, line: mark(LINE_MS, 60) };
    };
    const us = cell(row.us, true);
    const them = cell(row.others, false);
    t += ROW_PAUSE;
    return { row, feature, us, them };
  });

  return { eyebrow, heading, intro, colUs, colThem, body, total: t };
}

/** Text that types in place — the full string reserves the space so nothing shifts. */
function TypeText({ seg, t, caret = true, style }) {
  const count = Math.max(0, Math.min(seg.len, Math.floor((t - seg.start) / seg.speed)));
  const active = t >= seg.start && t < seg.end + 400;

  let left = count;
  const typed = seg.parts.map((p, i) => {
    const n = Math.max(0, Math.min(p.text.length, left));
    left -= n;
    if (!n) return null;
    const isLast = left === 0 && n > 0;
    const shown = p.text.slice(0, n);
    return (
      <span key={i} className={p.className}>
        {isLast && count < seg.len ? (
          <>
            {shown.slice(0, -1)}
            <span key={count} className="tw-char">
              {shown.slice(-1)}
            </span>
          </>
        ) : (
          shown
        )}
      </span>
    );
  });

  return (
    <span className="inline-grid align-top">
      <span className="invisible [grid-area:1/1]" aria-hidden="true">
        {seg.parts.map((p) => p.text).join("")}
      </span>
      <span className="[grid-area:1/1]" style={style}>
        {typed}
        {caret && active && <span className="tw-caret" aria-hidden="true" />}
      </span>
      <span className="sr-only">{seg.parts.map((p) => p.text).join("")}</span>
    </span>
  );
}

/** Faint shimmer bar shown in a cell until the typewriter reaches it. */
function Skeleton({ className = "" }) {
  return (
    <span
      className={`absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full bg-ink/[0.07] animate-pulse ${className}`}
      aria-hidden="true"
    />
  );
}

function Tick({ on }) {
  return (
    <svg viewBox="0 0 40 40" className={`w-9 h-9 stamp ${on ? "draw" : ""}`} aria-label="Yes">
      <circle
        cx="20" cy="20" r="15" fill="none" stroke={GREEN} strokeWidth="2" strokeOpacity="0.35"
        pathLength="1" className={`pen ${on ? "draw" : ""}`} style={{ "--pen-dur": "0.3s" }}
      />
      <path
        d="M12 21 L18 27 L29 13" fill="none" stroke={GREEN} strokeWidth="3.4"
        strokeLinecap="round" strokeLinejoin="round" pathLength="1"
        className={`pen ${on ? "draw" : ""}`} style={{ "--pen-dur": "0.28s", "--pen-delay": "0.18s" }}
      />
    </svg>
  );
}

function Cross({ on }) {
  return (
    <svg viewBox="0 0 40 40" className={`w-9 h-9 stamp ${on ? "draw" : ""}`} aria-label="No">
      <path
        d="M13 13 L27 27" fill="none" stroke={RED} strokeWidth="3.2" strokeLinecap="round"
        pathLength="1" className={`pen ${on ? "draw" : ""}`} style={{ "--pen-dur": "0.18s", "--pen-delay": "0.1s" }}
      />
      <path
        d="M27 13 L13 27" fill="none" stroke={RED} strokeWidth="3.2" strokeLinecap="round"
        pathLength="1" className={`pen ${on ? "draw" : ""}`} style={{ "--pen-dur": "0.18s", "--pen-delay": "0.3s" }}
      />
    </svg>
  );
}

/** A typed value: ours gets an orange hand-drawn underline, theirs gets struck out in red. */
function Value({ cell, t }) {
  const on = t >= cell.line.start;
  if (!cell.ours) {
    return (
      <span
        className="inline-block text-center text-[12px] sm:text-[14px] leading-snug text-ink/55"
      >
        <TypeText
          seg={cell.seg}
          t={t}
          style={{
            textDecorationLine: "line-through",
            textDecorationThickness: "2px",
            textDecorationColor: on ? RED : "transparent",
            transition: "text-decoration-color 0.3s",
          }}
        />
      </span>
    );
  }
  return (
    <span className="relative inline-block text-center text-[12px] sm:text-[14px] leading-snug font-bold text-ink">
      <TypeText seg={cell.seg} t={t} />
      <svg
        className="absolute left-0 w-full pointer-events-none overflow-visible"
        style={{ bottom: "-7px", height: "8px" }}
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M2 5 Q 25 1, 50 4 T 98 3"
          fill="none"
          stroke="#F5A623"
          strokeWidth="2.4"
          strokeLinecap="round"
          pathLength="1"
          opacity={on ? 1 : 0}
          className={`pen ${on ? "draw" : ""}`}
        />
      </svg>
    </span>
  );
}

function Cell({ cell, t }) {
  if (cell.type === "mark") {
    const on = t >= cell.seg.start;
    return cell.ok ? <Tick on={on} /> : <Cross on={on} />;
  }
  return <Value cell={cell} t={t} />;
}

export default function Comparison() {
  const rows = CONFIG.comparison;
  const script = useMemo(() => buildScript(rows), [rows]);
  const [t, setT] = useState(-1);
  const [run, setRun] = useState(0);
  const sectionRef = useRef(null);

  // Start typing when the section scrolls into view (and again on "Retype")
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(script.total + 1000);
      return;
    }

    let raf;
    let startAt = 0;
    const tick = (now) => {
      if (!startAt) startAt = now;
      const elapsed = now - startAt;
      setT(elapsed);
      if (elapsed < script.total + 1500) raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [script, run]);

  const retype = () => {
    setT(-1);
    setRun((r) => r + 1);
  };

  const done = t >= script.total;

  return (
    <section
      ref={sectionRef}
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-[#F4EFE4]"
    >
      <div className="text-center max-w-[860px] mx-auto mb-12">
        <div className="eyebrow center">
          <TypeText seg={script.eyebrow} t={t} />
        </div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          <TypeText seg={script.heading} t={t} />
        </h2>
        <p className="text-[15px] sm:text-[17px] text-ink/60 leading-[1.8] max-w-[620px] mx-auto">
          <TypeText seg={script.intro} t={t} />
        </p>
      </div>

      {/* The typed sheet */}
      <div className="relative max-w-[880px] mx-auto">
        {/* stacked paper behind */}
        <div className="absolute inset-0 translate-x-2 translate-y-2 rotate-[0.6deg] bg-[#FFFDF6] border border-[#E6DDC8] rounded-[6px]" />
        <div
          className="relative bg-[#FFFDF6] border border-[#E6DDC8] rounded-[6px] shadow-[0_24px_60px_-20px_rgba(60,40,10,0.25)] overflow-hidden"
        >
          {/* red margin rule, like a classic ledger sheet */}
          <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-px bg-[#E8A7A0]" aria-hidden="true" />

          <div className="grid grid-cols-[1fr_96px_96px] sm:grid-cols-[1fr_170px_170px]">
            {/* header */}
            <div className="pl-12 sm:pl-20 pr-3 py-5 border-b-2 border-ink text-[11px] sm:text-xs font-bold uppercase tracking-[2px] text-muted self-end">
              Feature
            </div>
            <div className="py-5 px-1 border-b-2 border-ink text-center font-display text-[13px] sm:text-base font-extrabold text-ink">
              <TypeText seg={script.colUs} t={t} />
            </div>
            <div className="py-5 px-1 border-b-2 border-ink text-center text-[11px] sm:text-sm font-bold text-ink/45">
              <TypeText seg={script.colThem} t={t} />
            </div>

            {script.body.map(({ row, feature, us, them }, i) => {
              const border = i !== script.body.length - 1 ? "border-b border-dashed border-ink/15" : "";
              const rowOn = t >= feature.start;
              return [
                <div
                  key={`${row.feature}-f`}
                  className={`${border} relative pl-12 sm:pl-20 pr-3 py-5 sm:py-6 text-[13px] sm:text-[15px] font-bold text-ink flex items-center`}
                >
                  <span
                    className={`absolute left-3 sm:left-5 text-[11px] text-muted tabular-nums transition-opacity duration-300 ${
                      rowOn ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t < feature.start && <Skeleton className="left-12 sm:left-20 w-[55%]" />}
                  <TypeText seg={feature} t={t} />
                </div>,
                <div
                  key={`${row.feature}-u`}
                  className={`${border} relative flex items-center justify-center py-5 sm:py-6 px-2 bg-orange/[0.05]`}
                >
                  {t < us.seg.start && <Skeleton className="left-1/2 -translate-x-1/2 w-[55%]" />}
                  <Cell cell={us} t={t} />
                </div>,
                <div key={`${row.feature}-o`} className={`${border} relative flex items-center justify-center py-5 sm:py-6 px-2`}>
                  {t < them.seg.start && <Skeleton className="left-1/2 -translate-x-1/2 w-[55%]" />}
                  <Cell cell={them} t={t} />
                </div>,
              ];
            })}
          </div>

          {/* signature line */}
          <div
            className={`flex items-center justify-between gap-4 pl-12 sm:pl-20 pr-5 sm:pr-8 py-5 border-t-2 border-ink transition-opacity duration-700 ${
              done ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-[12px] sm:text-[13px] text-muted">
              Signed, sealed &amp; delivered —{" "}
              <span className="font-bold text-ink">Digi<span className="text-orange">1</span>Xprt</span>
            </span>
            <button
              type="button"
              onClick={retype}
              className="text-[12px] font-bold text-muted hover:text-orange transition-colors whitespace-nowrap"
            >
              ↻ Retype
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
