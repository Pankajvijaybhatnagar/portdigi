"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import Mascot from "./Mascot";

// The road across the stage (viewBox 1200 × 320). Stations hang below its four
// nodes, lined up with the centres of the four cards underneath.
const ROAD =
  "M 20 150 C 80 150, 100 118, 150 118 C 270 118, 330 178, 450 178 C 570 178, 630 98, 750 98 C 870 98, 930 168, 1050 168 C 1110 168, 1150 140, 1185 130";
const STATIONS = [
  { x: 150, y: 118 },
  { x: 450, y: 178 },
  { x: 750, y: 98 },
  { x: 1050, y: 168 },
];

const WALK_MS = 1500; // between stations
const DWELL_MS = 2800; // at each station

/* ---------- station icons (drawn around 0,0 inside a ~64px badge) ---------- */
function DiscoverIcon() {
  return (
    <g>
      <rect x="-17" y="-20" width="28" height="36" rx="4" fill="#fff" stroke="#1A1A5C" strokeWidth="2.2" />
      {[-11, -4, 3].map((y) => (
        <line key={y} x1="-11" y1={y} x2={y === 3 ? -1 : 5} y2={y} stroke="#C9C9D8" strokeWidth="2.4" strokeLinecap="round" />
      ))}
      <g className="magnify">
        <circle cx="8" cy="6" r="9" fill="#FFF4DF" fillOpacity="0.85" stroke="#F5A623" strokeWidth="3" />
        <path d="M14.5 12.5 L21 19" stroke="#F5A623" strokeWidth="4" strokeLinecap="round" />
      </g>
    </g>
  );
}

function StrategizeIcon({ active }) {
  return (
    <g>
      <rect x="-17" y="-19" width="34" height="40" rx="5" fill="#fff" stroke="#1A1A5C" strokeWidth="2.2" />
      <rect x="-7" y="-23" width="14" height="7" rx="2.5" fill="#1A1A5C" />
      {[-7, 3, 13].map((y, i) => (
        <g key={y}>
          <path
            d={`M-11 ${y} l3 3 l5 -6`}
            fill="none"
            stroke="#1F8A4C"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            className={`pen ${active ? "draw" : ""}`}
            style={{ "--pen-dur": "0.25s", "--pen-delay": `${0.2 + i * 0.35}s` }}
          />
          <line x1="0" y1={y} x2="11" y2={y} stroke="#C9C9D8" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      ))}
    </g>
  );
}

function CreateIcon() {
  return (
    <g>
      <rect x="-19" y="-17" width="34" height="32" rx="5" fill="#fff" stroke="#1A1A5C" strokeWidth="2.2" />
      <circle className="shape" cx="-9" cy="-6" r="5.5" fill="#F5A623" style={{ animationDelay: "0.1s" }} />
      <path className="shape" d="M1 -11 L8 1 L-6 1 Z" fill="#1A1A5C" style={{ animationDelay: "0.35s" }} />
      <rect className="shape" x="-13" y="3" width="10" height="8" rx="2" fill="#2E7D5B" style={{ animationDelay: "0.6s" }} />
      <g className="pencil">
        <path d="M22 -2 L9 11 L7 17 L13 15 L26 2 Z" fill="#F5A623" stroke="#D4881A" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M7 17 L9 11 L13 15 Z" fill="#11113A" />
      </g>
    </g>
  );
}

function OptimizeIcon() {
  return (
    <g>
      <line x1="-19" y1="16" x2="15" y2="16" stroke="#1A1A5C" strokeWidth="2.2" strokeLinecap="round" />
      <rect className="bar" x="-16" y="4" width="7" height="12" rx="2" fill="#C9C9D8" style={{ animationDelay: "0.05s" }} />
      <rect className="bar" x="-6" y="-4" width="7" height="20" rx="2" fill="#F5A623" style={{ animationDelay: "0.2s" }} />
      <rect className="bar" x="4" y="-14" width="7" height="30" rx="2" fill="#1A1A5C" style={{ animationDelay: "0.35s" }} />
      <g className="gear" transform="translate(16 -14)">
        <circle r="7" fill="none" stroke="#2E7D5B" strokeWidth="3.5" strokeDasharray="3.2 2.3" />
        <circle r="4" fill="#fff" stroke="#2E7D5B" strokeWidth="2" />
      </g>
    </g>
  );
}

const ICONS = [DiscoverIcon, StrategizeIcon, CreateIcon, OptimizeIcon];

function StepIcon({ index, active, size = 64 }) {
  const Icon = ICONS[index] || DiscoverIcon;
  return (
    <svg viewBox="-32 -32 64 64" width={size} height={size} className={active ? "is-active" : ""} aria-hidden="true">
      <Icon active={active} />
    </svg>
  );
}

export default function Process() {
  const steps = CONFIG.process;
  const [active, setActive] = useState(-1);
  const [dwell, setDwell] = useState(0); // 0..1 progress at the current station

  const sectionRef = useRef(null);
  const roadRef = useRef(null);
  const trailRef = useRef(null);
  const mascotRef = useRef(null);
  const anim = useRef({ lengths: [], len: 0, from: 0, to: 0, phase: "idle", t: 0, target: 0 });

  useEffect(() => {
    const road = roadRef.current;
    const trail = trailRef.current;
    const mascot = mascotRef.current;
    if (!road || !mascot) return;

    // The stage is hidden on phones; some browsers can't measure a hidden path,
    // so fall back to evenly spaced "stations" and keep the timeline running.
    let total = 0;
    try {
      total = road.getTotalLength();
    } catch {
      total = 0;
    }
    const measurable = total > 0;
    if (!measurable) total = STATIONS.length;
    // Road length at each station (sample for the matching x)
    const lengths = !measurable ? STATIONS.map((_, i) => i) : STATIONS.map((st) => {
      let best = 0;
      let bestD = Infinity;
      for (let l = 0; l <= total; l += 2) {
        const p = road.getPointAtLength(l);
        const d = Math.abs(p.x - st.x) + Math.abs(p.y - st.y);
        if (d < bestD) {
          bestD = d;
          best = l;
        }
      }
      return best;
    });

    const a = anim.current;
    a.lengths = lengths;

    const place = (l) => {
      if (!measurable) return;
      const p = road.getPointAtLength(l);
      mascot.setAttribute("transform", `translate(${p.x} ${p.y - 4}) scale(1.9)`);
      if (trail) trail.style.strokeDashoffset = String(1 - l / total);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      a.len = lengths[lengths.length - 1];
      place(a.len);
      setActive(steps.length - 1);
      return;
    }
    place(0);

    let visible = false;
    let raf;
    let last = performance.now();
    let shownActive = -1;

    const setMascotState = (walking) => {
      mascot.classList.toggle("celebrating", !walking);
    };

    const goTo = (i) => {
      a.from = a.len;
      a.to = lengths[i];
      a.target = i;
      a.phase = "walk";
      a.t = 0;
      setMascotState(true);
      if (shownActive !== -1) {
        shownActive = -1;
        setActive(-1);
      }
    };
    a.goTo = goTo;

    const frame = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (visible) {
        a.t += dt;
        if (a.phase === "idle") {
          goTo(0);
        } else if (a.phase === "walk") {
          const dur = Math.max(500, (Math.abs(a.to - a.from) / (lengths[1] - lengths[0])) * WALK_MS);
          const k = Math.min(1, a.t / dur);
          const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          a.len = a.from + (a.to - a.from) * e;
          place(a.len);
          if (k >= 1) {
            a.phase = "dwell";
            a.t = 0;
            setMascotState(false);
            shownActive = a.target;
            setActive(a.target);
          }
        } else if (a.phase === "dwell") {
          setDwell(Math.min(1, a.t / DWELL_MS));
          if (a.t >= DWELL_MS) {
            if (a.target < lengths.length - 1) {
              goTo(a.target + 1);
            } else {
              // end of the road — fade out and start the journey again
              a.phase = "reset";
              a.t = 0;
              mascot.style.opacity = "0";
            }
          }
        } else if (a.phase === "reset" && a.t > 500) {
          a.len = 0;
          place(0);
          mascot.style.opacity = "1";
          goTo(0);
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        last = performance.now();
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [steps.length]);

  const jump = (i) => {
    setDwell(0);
    anim.current.goTo?.(i);
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white overflow-hidden"
    >
      <div className="mb-12 lg:mb-6">
        <div className="eyebrow">How We Work</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          Our <span className="text-orange">4-Step</span> Process
        </h2>
        <p className="text-[17px] text-muted leading-[1.8] max-w-[500px]">
          A clear, collaborative approach that delivers results from day one.
        </p>
      </div>

      {/* The journey stage (desktop) */}
      <div className="hidden lg:block relative -mx-2">
        <svg viewBox="0 0 1200 320" className="w-full h-auto overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id="roadTrail" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5A623" />
              <stop offset="100%" stopColor="#D4881A" />
            </linearGradient>
          </defs>

          {/* road */}
          <path d={ROAD} fill="none" stroke="#F1EFEA" strokeWidth="26" strokeLinecap="round" />
          <path d={ROAD} fill="none" stroke="#E4E4EE" strokeWidth="2" strokeDasharray="10 12" strokeLinecap="round" />
          <path
            ref={(el) => {
              roadRef.current = el;
            }}
            d={ROAD}
            fill="none"
            stroke="none"
          />
          {/* trail the mascot leaves behind */}
          <path
            ref={trailRef}
            d={ROAD}
            fill="none"
            stroke="url(#roadTrail)"
            strokeWidth="6"
            strokeLinecap="round"
            pathLength="1"
            style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
          />

          {/* finish flag */}
          <g transform="translate(1185 130)">
            <line x1="0" y1="0" x2="0" y2="-40" stroke="#1A1A5C" strokeWidth="3" strokeLinecap="round" />
            <path d="M0 -40 L26 -33 L0 -25 Z" fill="#F5A623" />
          </g>

          {/* stations */}
          {STATIONS.map((st, i) => {
            const isActive = i === active;
            const done = active > i;
            return (
              <g
                key={i}
                transform={`translate(${st.x} ${st.y + 84})`}
                className={`cursor-pointer ${isActive ? "is-active" : ""}`}
                onClick={() => jump(i)}
              >
                {/* stem down to the road */}
                <line x1="0" y1="-42" x2="0" y2="-72" stroke={isActive || done ? "#F5A623" : "#E4E4EE"} strokeWidth="3" strokeDasharray="4 4" />
                <circle className="st-ring" r="40" fill="none" stroke="#F5A623" strokeWidth="3" />
                <g className="st-badge">
                  <circle
                    r="40"
                    fill="#fff"
                    stroke={isActive ? "#F5A623" : "#E4E4EE"}
                    strokeWidth={isActive ? 3.5 : 2}
                    style={{ transition: "stroke 0.3s" }}
                  />
                  <g transform="scale(1.05)">
                    {(() => {
                      const Icon = ICONS[i];
                      return <Icon active={isActive} />;
                    })()}
                  </g>
                </g>
                {/* step number pill */}
                <g transform="translate(28 -30)">
                  <rect x="-15" y="-10" width="30" height="20" rx="10" fill={isActive ? "#F5A623" : "#111118"} style={{ transition: "fill 0.3s" }} />
                  <text x="0" y="4.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff">
                    {steps[i]?.step}
                  </text>
                </g>
              </g>
            );
          })}

          {/* the mascot walking the road */}
          <g ref={mascotRef} className="runner" style={{ transition: "opacity 0.4s" }}>
            <Mascot pose="run" />
          </g>
        </svg>
      </div>

      {/* Step cards — a row on desktop, a vertical timeline on phones */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 lg:mt-2">
        {/* vertical rail (mobile / tablet single column) */}
        <div className="sm:hidden absolute left-[27px] top-6 bottom-6 w-[3px] rounded-full bg-silver" aria-hidden="true">
          <div
            className="w-full rounded-full bg-orange transition-all duration-500"
            style={{ height: `${active < 0 ? 0 : ((active + dwell) / steps.length) * 100}%` }}
          />
        </div>

        {steps.map((p, i) => {
          const isActive = i === active;
          const done = i < active;
          return (
            <button
              key={p.step}
              type="button"
              onClick={() => jump(i)}
              className={`group relative text-left flex sm:flex-col gap-4 sm:gap-0 rounded-lg2 border-[1.5px] px-4 sm:px-6 pt-5 sm:pt-7 pb-5 sm:pb-6 transition-all duration-500 ${
                isActive
                  ? "bg-white border-orange shadow-[0_24px_50px_-22px_rgba(245,166,35,0.55)] lg:-translate-y-2"
                  : "bg-cloud border-silver hover:border-orange/40 hover:bg-white"
              }`}
            >
              {/* icon badge (cards carry the icon on smaller screens) */}
              <span
                className={`relative z-[1] lg:hidden flex-shrink-0 w-[56px] h-[56px] rounded-full bg-white border-2 flex items-center justify-center sm:mb-4 transition-colors ${
                  isActive ? "border-orange" : "border-silver"
                }`}
              >
                <StepIcon index={i} active={isActive} size={44} />
              </span>

              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-2.5 mb-2">
                  <span
                    className={`font-display text-[13px] font-extrabold rounded-full px-2.5 py-0.5 transition-colors ${
                      isActive ? "bg-orange text-white" : done ? "bg-ink text-white" : "bg-white text-orange border border-silver"
                    }`}
                  >
                    {done ? "✓" : p.step}
                  </span>
                  <span className="text-[17px] font-extrabold text-ink">{p.title}</span>
                </span>
                <span className="block text-[13px] sm:text-[14px] text-muted leading-[1.75]">{p.desc}</span>

                {/* time spent on this step */}
                <span className="block mt-4 h-1 rounded-full bg-silver/70 overflow-hidden">
                  <span
                    className="step-fill block h-full bg-orange rounded-full"
                    style={{ width: `${done ? 100 : isActive ? dwell * 100 : 0}%`, transition: isActive ? "none" : "width 0.4s" }}
                  />
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
