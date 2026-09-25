"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import { formatCount } from "@/lib/format";
import { useInView, useCountUp } from "./useCountUp";
import Mascot from "./Mascot";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// "Dec 2025" → "Jul 2026" becomes [{m:"Dec",y:2025}, {m:"Jan",y:2026}, …]
function monthRange(from, to) {
  const parse = (s) => {
    const [m, y] = s.split(" ");
    return { i: MONTHS.indexOf(m.slice(0, 3)), y: Number(y) };
  };
  const a = parse(from);
  const b = parse(to);
  if (a.i < 0 || b.i < 0) return [{ m: from, y: "" }, { m: to, y: "" }];
  const out = [];
  let { i, y } = a;
  while (y < b.y || (y === b.y && i <= b.i)) {
    out.push({ m: MONTHS[i], y });
    i += 1;
    if (i === 12) {
      i = 0;
      y += 1;
    }
    if (out.length > 60) break;
  }
  return out;
}

/* ---------- Scene 1: megaphone → a crowd of new followers ---------- */
function FollowersScene() {
  const colors = ["#1A1A5C", "#F5A623", "#5AB4F0", "#2E7D5B", "#FF6B6B"];
  const people = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 5; c++) {
      people.push({ x: 158 + c * 32 + (r % 2 ? 10 : 0), y: 72 + r * 42, color: colors[(r * 5 + c) % colors.length], i: r * 5 + c });
    }
  }
  return (
    <svg viewBox="0 0 330 190" className="w-full h-full" aria-hidden="true">
      <line x1="10" y1="176" x2="320" y2="176" stroke="#E4E4EE" strokeWidth="2" strokeLinecap="round" />

      <g transform="translate(62 176) scale(1.75)">
        <Mascot pose="megaphone" />
      </g>

      {/* sound waves from the megaphone */}
      {[0, 0.4, 0.8].map((d) => (
        <path
          key={d}
          className="wave-pulse"
          d="M110 82 Q122 98 110 114"
          fill="none"
          stroke="#F5A623"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ animationDelay: `${d}s` }}
        />
      ))}

      {/* the crowd arrives one follower at a time */}
      {people.map((p) => (
        <g key={p.i} className="crowd-pop scene-part" style={{ animationDelay: `${0.3 + p.i * 0.09}s, ${1.6 + (p.i % 5) * 0.2}s` }}>
          <circle cx={p.x} cy={p.y - 20} r="6.5" fill="#FFD7B0" />
          <path d={`M${p.x - 9} ${p.y} Q${p.x - 9} ${p.y - 12} ${p.x} ${p.y - 12} Q${p.x + 9} ${p.y - 12} ${p.x + 9} ${p.y} Z`} fill={p.color} />
          <circle cx={p.x + 2} cy={p.y - 20.5} r="0.9" fill="#11113A" />
        </g>
      ))}

      {/* +1s floating up */}
      {[
        { x: 190, y: 40, d: 1.4 },
        { x: 262, y: 52, d: 2.1 },
        { x: 226, y: 30, d: 2.8 },
        { x: 296, y: 36, d: 3.3 },
      ].map((f) => (
        <g key={f.x} className="float-plus" style={{ animationDelay: `${f.d}s` }}>
          <rect x={f.x - 13} y={f.y - 10} width="26" height="16" rx="8" fill="#1A1A5C" />
          <text x={f.x} y={f.y + 2} textAnchor="middle" fontSize="10" fontWeight="800" fill="#fff">+1</text>
        </g>
      ))}
    </svg>
  );
}

/* ---------- Scene 2: the mascot rides a rocket up a steep curve — no dice ---------- */
const ROCKET_PATH = "M 30 166 C 140 162, 190 146, 228 100 S 276 30, 304 20";

function GrowthScene({ on }) {
  const pathRef = useRef(null);
  const rocketRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const rocket = rocketRef.current;
    if (!path || !rocket) return;
    const total = path.getTotalLength();
    const place = (l) => {
      const p = path.getPointAtLength(l);
      const a = path.getPointAtLength(Math.min(total, l + 1));
      const angle = (Math.atan2(a.y - p.y, a.x - p.x) * 180) / Math.PI;
      rocket.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!on || reduced) {
      place(on ? total : 0);
      return;
    }

    let raf;
    let start;
    const CYCLE = 4200; // climb 2.6s, then hover at the top
    const frame = (now) => {
      if (!start) start = now;
      const t = ((now - start) % CYCLE) / 2600;
      const eased = t >= 1 ? 1 : t * t * (3 - 2 * t);
      place(eased * total);
      rocket.style.opacity = t > 1.5 ? String(Math.max(0, 1 - (t - 1.5) * 8)) : "1";
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  return (
    <svg viewBox="0 0 330 190" className="w-full h-full overflow-visible" aria-hidden="true">
      {/* stars */}
      {[
        [60, 40, 0], [120, 24, 0.5], [180, 50, 1], [250, 70, 0.3], [150, 90, 1.3], [290, 110, 0.8],
      ].map(([x, y, d]) => (
        <path key={`${x}-${y}`} className="twinkle" d={`M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z`} fill="#F5A623" style={{ animationDelay: `${d}s` }} />
      ))}

      <line x1="20" y1="176" x2="316" y2="176" stroke="#E4E4EE" strokeWidth="2" strokeLinecap="round" />
      <path d={`${ROCKET_PATH} L 304 176 L 30 176 Z`} fill="#F5A623" fillOpacity={on ? 0.12 : 0} style={{ transition: "fill-opacity 1.2s ease 0.8s" }} />
      <path
        ref={pathRef}
        d={ROCKET_PATH}
        fill="none"
        stroke="#F5A623"
        strokeWidth="4"
        strokeLinecap="round"
        pathLength="1"
        className={`pen ${on ? "draw" : ""}`}
        style={{ "--pen-dur": "2.6s" }}
      />

      {/* luck? crossed out */}
      <g transform="translate(46 108)">
        <rect x="-14" y="-14" width="28" height="28" rx="6" fill="#fff" stroke="#1A1A5C" strokeWidth="2.2" transform="rotate(-12)" />
        {[[-6, -6], [6, 6], [0, 0], [6, -6], [-6, 6]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r="2.2" fill="#1A1A5C" transform="rotate(-12)" />
        ))}
        <path d="M-20 -20 L20 20" stroke="#C8372D" strokeWidth="3.5" strokeLinecap="round" pathLength="1" className={`pen ${on ? "draw" : ""}`} style={{ "--pen-delay": "1.4s", "--pen-dur": "0.3s" }} />
        <text x="0" y="34" textAnchor="middle" fontSize="11" fontWeight="700" fill="#7A7A90">luck</text>
      </g>

      {/* rocket with the mascot in the window — drawn pointing right */}
      <g ref={rocketRef}>
        <g transform="translate(-6 -12)">
          <path className="flame" d="M-30 0 Q-20 -7 -12 0 Q-20 7 -30 0 Z" fill="#FF8A3D" />
          <path className="flame" d="M-24 0 Q-17 -4 -12 0 Q-17 4 -24 0 Z" fill="#FFE08A" style={{ animationDelay: "0.06s" }} />
          <path d="M-12 -9 L-18 -16 L-4 -9 Z" fill="#C8372D" />
          <path d="M-12 9 L-18 16 L-4 9 Z" fill="#C8372D" />
          <path d="M-13 -9 L14 -9 Q28 -9 32 0 Q28 9 14 9 L-13 9 Q-15 0 -13 -9 Z" fill="#fff" stroke="#1A1A5C" strokeWidth="2" />
          <circle cx="10" cy="0" r="6" fill="#DDF0FF" stroke="#1A1A5C" strokeWidth="2" />
          {/* mascot head in the porthole */}
          <circle cx="10" cy="1" r="4" fill="#FFD7B0" />
          <path d="M6.2 -0.5 Q10 -3 13.8 -0.5" fill="none" stroke="#F5A623" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M26 -4 Q30 0 26 4" fill="none" stroke="#F5A623" strokeWidth="2.2" />
        </g>
      </g>
    </svg>
  );
}

/* ---------- Scene 3: calendar flips month by month; mascot outruns a 5-year snail ---------- */
function TimeScene({ on, months }) {
  const [idx, setIdx] = useState(0);
  const last = months.length - 1;

  useEffect(() => {
    if (!on) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIdx(last);
      return;
    }
    let i = 0;
    setIdx(0);
    const id = setInterval(() => {
      i = i >= last + 6 ? 0 : i + 1; // hold on the final month for a beat, then replay
      setIdx(Math.min(i, last));
    }, 480);
    return () => clearInterval(id);
  }, [on, last]);

  const cur = months[idx];
  const done = idx === last;

  return (
    <svg viewBox="0 0 330 190" className="w-full h-full" aria-hidden="true" style={{ perspective: "400px" }}>
      <line x1="10" y1="176" x2="320" y2="176" stroke="#E4E4EE" strokeWidth="2" strokeLinecap="round" />

      {/* calendar */}
      <g transform="translate(40 26)">
        <rect x="0" y="0" width="120" height="118" rx="14" fill="#fff" stroke="#E4E4EE" strokeWidth="2" />
        <path d="M0 14 Q0 0 14 0 L106 0 Q120 0 120 14 L120 32 L0 32 Z" fill="#F5A623" />
        {[30, 60, 90].map((x) => (
          <rect key={x} x={x - 3} y="-7" width="6" height="16" rx="3" fill="#1A1A5C" />
        ))}
        <text x="60" y="23" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff" letterSpacing="1">
          {String(cur.y)}
        </text>
        <g key={idx} className="cal-flip">
          <text x="60" y="84" textAnchor="middle" fontSize="36" fontWeight="900" fill="#111118">
            {cur.m}
          </text>
        </g>
        {/* month progress dots */}
        {months.map((m, i) => (
          <circle
            key={`${m.m}${m.y}`}
            cx={60 + (i - last / 2) * 12}
            cy="104"
            r="3.6"
            fill={i <= idx ? "#F5A623" : "#E4E4EE"}
            style={{ transition: "fill 0.25s" }}
          />
        ))}
        {done && (
          <g className="done-stamp">
            <rect x="92" y="38" width="58" height="24" rx="6" fill="#fff" stroke="#1F8A4C" strokeWidth="2.5" />
            <text x="121" y="55" textAnchor="middle" fontSize="12" fontWeight="900" fill="#1F8A4C">DONE!</text>
          </g>
        )}
      </g>

      {/* the slow way */}
      <g className="snail-crawl">
        <g transform="translate(26 176)">
          <path d="M0 0 Q2 -8 12 -8 L30 -8 Q34 -8 34 0 Z" fill="#C9C3B3" />
          <circle cx="18" cy="-14" r="10" fill="#E8C98E" stroke="#B5925A" strokeWidth="2" />
          <path d="M18 -14 m-5 0 a5 5 0 1 1 5 5" fill="none" stroke="#B5925A" strokeWidth="1.8" />
          <path d="M31 -8 L34 -18 M34 -8 L38 -17" stroke="#9C9686" strokeWidth="1.6" strokeLinecap="round" />
          <text x="44" y="-4" fontSize="10" fontWeight="700" fill="#7A7A90">5-yr plan</text>
        </g>
      </g>

      {/* the Digi1Xprt way */}
      <g transform="translate(250 176) scale(1.75)">
        <Mascot pose="run" />
      </g>
      {/* speed lines */}
      {[0, 0.2, 0.4].map((d, i) => (
        <line key={d} className="float-plus" x1={205} y1={120 + i * 14} x2={222} y2={120 + i * 14} stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" style={{ animationDelay: `${d}s`, animationDuration: "0.9s" }} />
      ))}
    </svg>
  );
}

function StatCard({ index, scene, tint, stat, label, desc, delay, on }) {
  return (
    <div
      className={`scene-card ${on ? "fade-up" : "opacity-0"} h-full flex flex-col bg-white rounded-lg2 border border-silver overflow-hidden`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-[200px] px-3 pt-4" style={{ background: tint }}>
        <span className="absolute top-4 left-5 font-display text-sm font-semibold text-ink/30 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        {scene}
      </div>
      <div className="px-7 pt-6 pb-7 flex-1">
        <div className="font-display text-[38px] font-extrabold leading-none text-ink mb-2 tabular-nums">{stat}</div>
        <div className="text-[13px] font-bold uppercase tracking-[1px] text-orange mb-3">{label}</div>
        <p className="text-[14px] text-muted leading-[1.75]">{desc}</p>
      </div>
    </div>
  );
}

export default function ROI() {
  const { before, after, span } = CONFIG.growthStory;
  const gain = after.value - before.value;
  const growthPercent = Math.round((gain / before.value) * 100);
  const spanNum = parseInt(span, 10) || 0;
  const spanUnit = span.replace(/^\d+\s*/, "");
  const months = monthRange(before.date, after.date);

  const [ref, inView] = useInView(0.25);
  const gainCount = useCountUp(gain, inView, 2200);
  const pctCount = useCountUp(growthPercent, inView, 2600);
  const monthCount = useCountUp(spanNum, inView, months.length * 480);

  const cards = [
    {
      stat: `+${formatCount(Math.round(gainCount / 1000) * 1000)}`,
      label: "New Followers",
      desc: "That's how many more people now see this brand's content every single day — reach that didn't exist before.",
      tint: "linear-gradient(160deg, #FFF4DF 0%, #FFFBF3 100%)",
      scene: <FollowersScene />,
    },
    {
      stat: `${pctCount.toLocaleString()}%`,
      label: "Growth, Not Luck",
      desc: "A trajectory this steep only happens with a strategy that's working — not a one-off spike in attention.",
      tint: "linear-gradient(160deg, #EDEDFA 0%, #F8F8FE 100%)",
      scene: <GrowthScene on={inView} />,
    },
    {
      stat: `${monthCount} ${spanUnit}`,
      label: "Time To Get There",
      desc: "Fast enough to move the needle this fiscal year — not a five-year plan you have to take on faith.",
      tint: "linear-gradient(160deg, #E6F5EC 0%, #F6FBF8 100%)",
      scene: <TimeScene on={inView} months={months} />,
    },
  ];

  return (
    <section className="relative px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white overflow-hidden">
      <div className="mb-14 max-w-[600px]">
        <div className="eyebrow">In Plain Business Terms</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          What The Numbers <span className="text-orange">Actually Mean</span>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8]">
          Follower counts are nice — here&rsquo;s what they translate to for
          a business owner deciding where to spend next quarter&rsquo;s
          marketing budget.
        </p>
      </div>

      <div ref={ref} className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${inView ? "scene-on" : ""}`}>
        {cards.map((card, i) => (
          <StatCard key={card.label} index={i} delay={i * 150} on={inView} {...card} />
        ))}
      </div>
    </section>
  );
}
