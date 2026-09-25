"use client";

import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";
import { smoothPath } from "./Sparkline";
import { useInView } from "./useCountUp";

// Bento layout: a wide opener, a row of three, and a full-width closer.
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-4", "lg:col-span-4", "lg:col-span-4", "lg:col-span-12"];

/* ---------- one icon per service (moving part animates on hover) ---------- */
const ICONS = [
  // Brand identity — pen nib over a shape
  <>
    <rect x="3" y="13" width="8" height="8" rx="2" />
    <g className="svc-move svc-rotate">
      <path d="M14 3l6 6-5 9-6-6z" />
      <circle cx="15" cy="10" r="1.3" />
    </g>
  </>,
  // Social — heart in a chat bubble
  <>
    <path d="M3 5h18v12h-9l-5 4v-4H3z" />
    <path className="svc-move svc-beat" d="M12 14s-3.5-2-3.5-4.2A1.8 1.8 0 0 1 12 9a1.8 1.8 0 0 1 3.5.8C15.5 12 12 14 12 14z" />
  </>,
  // Performance ads — target
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle className="svc-move svc-beat" cx="12" cy="12" r="1.6" />
  </>,
  // Content — play in a frame
  <>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path className="svc-move svc-slide" d="M10 9l5 3-5 3z" />
  </>,
  // Website — browser + cursor
  <>
    <rect x="3" y="4" width="18" height="14" rx="2.5" />
    <path d="M3 8h18" />
    <path className="svc-move svc-slide" d="M12 11l6 2.4-2.6 1 -1 2.6z" />
  </>,
  // SEO — magnifier over bars
  <>
    <path d="M4 20V14M8 20v-8M12 20v-5" />
    <g className="svc-move svc-slide">
      <circle cx="16" cy="8" r="4" />
      <path d="M19 11l2.5 2.5" />
    </g>
  </>,
];

// "+38%" → { prefix: "+", n: 38, suffix: "%", decimals: 0 }
function parseMetric(value) {
  const m = String(value).match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!m) return { prefix: "", n: 0, suffix: value, decimals: 0, raw: true };
  const num = m[2].replace(/,/g, "");
  return { prefix: m[1], n: parseFloat(num), suffix: m[3], decimals: (num.split(".")[1] || "").length };
}

function CountUp({ value, run }) {
  const p = parseMetric(value);
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!run || p.raw) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(p.n);
      return;
    }
    let raf;
    let start;
    const tick = (t) => {
      if (!start) start = t;
      const k = Math.min(1, (t - start) / 1600);
      setV(p.n * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, p.n, p.raw]);
  if (p.raw) return value;
  return `${p.prefix}${run ? v.toFixed(p.decimals) : (0).toFixed(p.decimals)}${p.suffix}`;
}

/** Trend line that draws itself when the section comes into view. */
function Trend({ points, run, width = 120, height = 44, id }) {
  const pad = height * 0.14;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => [+(i * step).toFixed(1), +(pad + (height - pad * 2) - ((p - min) / range) * (height - pad * 2)).toFixed(1)]);
  const line = smoothPath(coords);
  const [lx, ly] = coords[coords.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`svcFill-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${line} L ${width},${height} L 0,${height} Z`}
        fill={`url(#svcFill-${id})`}
        style={{ opacity: run ? 1 : 0, transition: "opacity 0.8s ease 0.9s" }}
      />
      <path
        d={line}
        fill="none"
        stroke="#F5A623"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        pathLength="1"
        style={{ strokeDasharray: 1, strokeDashoffset: run ? 0 : 1, transition: "stroke-dashoffset 1.4s ease-out 0.2s" }}
      />
      <circle cx={lx} cy={ly} r="3.5" fill="#fff" stroke="#F5A623" strokeWidth="2" style={{ opacity: run ? 1 : 0, transition: "opacity 0.3s ease 1.5s" }} />
    </svg>
  );
}

function ServiceCard({ svc, index, run }) {
  const wide = index === CONFIG.services.length - 1 && CONFIG.services.length % 3 === 0;
  const featured = index === 0;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const metric = svc.metric && (
    <div className={`flex items-end justify-between gap-5 ${wide ? "" : "mt-7 pt-6 border-t border-dashed border-silver"}`}>
      <div className="flex-shrink-0">
        <div className={`font-display font-extrabold leading-none text-ink tabular-nums ${wide || featured ? "text-[40px]" : "text-[30px]"}`}>
          <CountUp value={svc.metric.value} run={run} />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[1.2px] text-muted mt-2">{svc.metric.label}</div>
      </div>
      <div className={`${wide ? "w-full max-w-[520px] h-[96px]" : featured ? "w-[180px] h-[60px]" : "w-[110px] h-[44px]"}`}>
        <Trend points={svc.metric.trend} run={run} id={svc.num} width={wide ? 520 : featured ? 180 : 110} height={wide ? 96 : featured ? 60 : 44} />
      </div>
    </div>
  );

  return (
    <div
      onMouseMove={onMove}
      className={`svc-card fade-up group h-full overflow-hidden rounded-[26px] border border-silver bg-white p-7 sm:p-8 ${
        wide ? "lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:items-center" : "flex flex-col"
      }`}
      style={{ animationDelay: `${index * 90}ms`, animationPlayState: run ? "running" : "paused" }}
    >
      {/* big outlined number */}
      <span className="svc-ghost pointer-events-none absolute -top-3 right-5 font-display text-[92px] font-extrabold leading-none tracking-[-4px] select-none" aria-hidden="true">
        {svc.num}
      </span>

      <div className={wide ? "" : "flex-1"}>
        <div className="flex items-center gap-3 mb-6">
          <span className="svc-icon w-12 h-12 rounded-2xl bg-orange-lt text-orange flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {ICONS[index % ICONS.length]}
            </svg>
          </span>
          {featured && (
            <span className="text-[10px] font-bold uppercase tracking-[1.5px] text-navy bg-navy/[0.07] rounded-full px-2.5 py-1">Where it starts</span>
          )}
        </div>
        <h3 className={`font-bold text-ink mb-3 tracking-[-0.2px] ${featured || wide ? "text-[22px]" : "text-[18px]"}`}>{svc.title}</h3>
        <p className={`text-muted leading-[1.75] ${featured || wide ? "text-[15px] max-w-[440px]" : "text-[14px]"}`}>{svc.desc}</p>
        <a
          href="#contact"
          className="svc-cta inline-flex items-center gap-1.5 mt-5 text-[13px] font-bold text-orange hover:text-orange-dk"
        >
          Let&apos;s talk <span aria-hidden="true">→</span>
        </a>
      </div>

      {wide ? <div className="mt-7 lg:mt-0">{metric}</div> : metric}
    </div>
  );
}

export default function Services() {
  const [ref, inView] = useInView(0.15);

  return (
    <section id="services" className="relative px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-cloud overflow-hidden">
      {/* soft dotted texture + brand glows */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(rgba(26,26,92,0.09) 1px, transparent 1px)", backgroundSize: "22px 22px" }}
        aria-hidden="true"
      />
      <div className="absolute -top-40 -right-32 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.16),transparent_65%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-48 -left-40 w-[560px] h-[560px] rounded-full bg-[radial-gradient(circle,rgba(26,26,92,0.1),transparent_65%)] pointer-events-none" aria-hidden="true" />

      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-end mb-14">
        <div>
          <div className="eyebrow">What We Do</div>
          <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink">
            Services Built
            <br />
            for{" "}
            <span className="relative inline-block text-orange">
              Growth
              <svg viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute left-0 -bottom-2 w-full h-3" aria-hidden="true">
                <path
                  d="M3 14 C 50 4, 120 4, 197 10"
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength="1"
                  style={{ strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1, transition: "stroke-dashoffset 0.9s ease-out 0.3s" }}
                />
              </svg>
            </span>
          </h2>
        </div>
        <p className="text-[17px] text-muted leading-[1.8] max-w-[500px]">
          Every service is designed to move the needle — from visibility to conversion. No fluff, only results.
        </p>
      </div>

      <div ref={ref} className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
        {CONFIG.services.map((svc, i) => (
          <div key={svc.num} className={`${SPANS[i] || "lg:col-span-4"} ${i === CONFIG.services.length - 1 ? "sm:col-span-2" : ""}`}>
            <ServiceCard svc={svc} index={i} run={inView} />
          </div>
        ))}
      </div>
    </section>
  );
}
