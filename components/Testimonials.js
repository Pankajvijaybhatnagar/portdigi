"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";

const TYPE_MS = 24; // per character of the quote
const READ_MS = 5200; // time to read after the quote finishes
const START_DELAY = 700; // bubble opens before typing begins

/** Cartoon bust of a client. `talking` animates the mouth, `wave` plays the hello. */
function Toon({ avatar, talking = false, wave = false, still = false }) {
  const { skin, hair, hairStyle, shirt, glasses } = avatar;
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      {/* long hair sits behind the head */}
      {hairStyle === "long" && (
        <path d="M58 88 Q54 34 100 34 Q146 34 142 88 L148 156 Q124 146 120 124 L80 124 Q76 146 52 156 Z" fill={hair} />
      )}

      {/* shoulders + collar */}
      <path d="M26 200 Q28 142 100 136 Q172 142 174 200 Z" fill={shirt} />
      <path d="M86 138 L100 158 L114 138" fill="none" stroke="#fff" strokeOpacity="0.55" strokeWidth="3" strokeLinejoin="round" />

      {/* waving arm */}
      {wave && (
        <g className="toon-wave">
          <path d="M148 164 L170 112" stroke={shirt} strokeWidth="16" strokeLinecap="round" />
          <circle cx="172" cy="104" r="10" fill={skin} />
        </g>
      )}

      {/* neck, ears, head */}
      <rect x="88" y="112" width="24" height="30" rx="8" fill={skin} />
      <rect x="88" y="118" width="24" height="8" fill="#000" fillOpacity="0.08" />
      <circle cx="62" cy="88" r="7.5" fill={skin} />
      <circle cx="138" cy="88" r="7.5" fill={skin} />
      <ellipse cx="100" cy="84" rx="38" ry="42" fill={skin} />

      {/* hair on top */}
      {hairStyle === "long" ? (
        <path d="M62 80 Q68 44 100 43 Q134 44 138 80 Q122 60 98 62 Q78 63 62 80 Z" fill={hair} />
      ) : (
        <path d="M62 82 Q58 40 100 38 Q144 40 138 82 Q132 58 102 56 Q72 57 62 82 Z" fill={hair} />
      )}
      {hairStyle === "beard" && (
        <path d="M64 92 Q68 130 100 132 Q132 130 136 92 Q130 112 118 110 Q100 104 82 110 Q70 112 64 92 Z" fill={hair} />
      )}

      {/* brows */}
      <path d="M79 72 Q86 67 93 71" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />
      <path d="M107 71 Q114 67 121 72" fill="none" stroke={hair} strokeWidth="3" strokeLinecap="round" />

      {/* eyes (blink) */}
      <g className={still ? "" : "toon-part toon-blink"}>
        <ellipse cx="86" cy="85" rx="3.8" ry="4.8" fill="#1d1d2b" />
        <ellipse cx="114" cy="85" rx="3.8" ry="4.8" fill="#1d1d2b" />
        <circle cx="87.3" cy="83.4" r="1.2" fill="#fff" />
        <circle cx="115.3" cy="83.4" r="1.2" fill="#fff" />
      </g>
      {glasses && (
        <g fill="none" stroke="#11113A" strokeWidth="2.4">
          <circle cx="86" cy="85" r="11" />
          <circle cx="114" cy="85" r="11" />
          <path d="M97 85 L103 85" />
        </g>
      )}

      {/* cheeks */}
      <circle cx="76" cy="99" r="5" fill="#FF7A7A" fillOpacity="0.28" />
      <circle cx="124" cy="99" r="5" fill="#FF7A7A" fillOpacity="0.28" />

      {/* mouth: talking oval while the quote types, big smile after */}
      {talking ? (
        <ellipse cx="100" cy="106" rx="6.5" ry="5" fill="#7A2E2E" className="toon-part toon-talk" />
      ) : (
        <path d="M87 102 Q100 116 113 102 Q100 108 87 102 Z" fill="#7A2E2E" stroke="#7A2E2E" strokeWidth="2" strokeLinejoin="round" />
      )}
      {hairStyle === "long" && <circle cx="61" cy="98" r="2.6" fill="#F5A623" />}
    </svg>
  );
}

function ResultChart({ chart, delay }) {
  const style = { animationDelay: `${delay}ms` };
  if (chart.kind === "line") {
    return (
      <div className="fade-up" style={style}>
        <svg viewBox="0 0 220 90" className="w-full h-[90px]" aria-hidden="true">
          <line x1="8" y1="80" x2="212" y2="80" stroke="#E4E4EE" strokeWidth="1.5" />
          <path
            d="M10 78 C 70 76, 110 70, 140 50 S 190 14, 210 10 L 210 80 L 10 80 Z"
            fill="#F5A623"
            fillOpacity="0.14"
            className="fade-up"
            style={{ animationDelay: `${delay + 900}ms` }}
          />
          <path
            d="M10 78 C 70 76, 110 70, 140 50 S 190 14, 210 10"
            fill="none"
            stroke="#F5A623"
            strokeWidth="3.5"
            strokeLinecap="round"
            pathLength="1"
            className="pen draw"
            style={{ "--pen-dur": "1.1s", "--pen-delay": `${delay + 150}ms` }}
          />
          <circle cx="10" cy="78" r="4" fill="#fff" stroke="#F5A623" strokeWidth="2.5" />
          <circle
            cx="210" cy="10" r="5.5" fill="#F5A623"
            className="fade-up" style={{ animationDelay: `${delay + 1200}ms` }}
          />
        </svg>
        <div className="flex justify-between text-[12px] font-bold mt-1">
          <span className="text-muted">{chart.from}</span>
          <span className="text-orange">{chart.to}</span>
        </div>
      </div>
    );
  }

  const max = Math.max(...chart.bars.map((b) => b.value));
  return (
    <div className="flex items-end justify-center gap-6 h-[118px]">
      {chart.bars.map((b, i) => {
        const last = i === chart.bars.length - 1;
        return (
          <div key={b.label} className="flex flex-col items-center gap-1.5 w-16">
            <span
              className={`text-[15px] font-extrabold fade-up ${last ? "text-orange" : "text-muted"}`}
              style={{ animationDelay: `${delay + 500 + i * 250}ms` }}
            >
              {b.display}
            </span>
            <div
              className={`w-full rounded-t-[10px] bar-grow ${last ? "bg-orange" : "bg-silver"}`}
              style={{ height: `${Math.max(12, (b.value / max) * 78)}px`, animationDelay: `${delay + i * 250}ms` }}
            />
            <span className="text-[11px] font-semibold text-muted">{b.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Testimonials() {
  const items = CONFIG.testimonials;
  const [active, setActive] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [seen, setSeen] = useState(false); // entrance animations wait until first in view
  const sectionRef = useRef(null);
  const paused = useRef(false);
  const visible = useRef(false);

  const t = items[active];
  const typeEnd = START_DELAY + t.quote.length * TYPE_MS;
  const duration = typeEnd + READ_MS;

  // One clock per slide: drives typing, talking, chart timing and autoplay
  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);
    if (isReduced) {
      setSeen(true);
      return;
    }

    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dt = now - last;
      last = now;
      if (visible.current && !paused.current) {
        setElapsed((e) => e + dt);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!reduced && elapsed >= duration) {
      setActive((a) => (a + 1) % items.length);
      setElapsed(0);
    }
  }, [elapsed, duration, reduced, items.length]);

  const go = (i) => {
    setActive((i + items.length) % items.length);
    setElapsed(0);
  };

  const chars = reduced
    ? t.quote.length
    : Math.max(0, Math.min(t.quote.length, Math.floor((elapsed - START_DELAY) / TYPE_MS)));
  const typing = !reduced && chars < t.quote.length && elapsed >= START_DELAY;
  const done = reduced || chars >= t.quote.length;
  // Chart appears once the bubble has opened; delays are relative to slide start
  const chartDelay = START_DELAY + 300;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-cloud overflow-hidden"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="text-center mb-12 max-w-[600px] mx-auto">
        <div className="eyebrow center">Client Love</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          What They <span className="text-orange">Say</span>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8] mx-auto">
          Real results. Real relationships. Real growth.
        </p>
      </div>

      {/* Stage */}
      <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-12 items-center">
        {/* Character */}
        <div className="relative flex flex-col items-center">
          <div
            key={`toon-${active}-${seen}`}
            className={`${seen ? "toon-enter" : "opacity-0"} relative w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] rounded-full flex items-end justify-center overflow-visible`}
          >
            <div
              className="absolute inset-0 rounded-full transition-colors duration-500"
              style={{ background: t.avatar.bg }}
            />
            {/* orbiting sparkle ring */}
            <div className="absolute -inset-3 rounded-full border-2 border-dashed border-orange/30 animate-[spin2_24s_linear_infinite]" />
            <div className="relative w-[88%] h-[88%] toon-bob overflow-hidden rounded-b-full">
              <Toon avatar={t.avatar} talking={typing} wave />
            </div>

            {/* hearts float up once they've said their piece */}
            {done &&
              [
                { left: "12%", drift: "-30px", spin: "-20deg", d: 0, s: 22 },
                { left: "78%", drift: "25px", spin: "15deg", d: 250, s: 18 },
                { left: "30%", drift: "-10px", spin: "10deg", d: 600, s: 14 },
                { left: "62%", drift: "18px", spin: "-12deg", d: 900, s: 20 },
                { left: "46%", drift: "0px", spin: "0deg", d: 1300, s: 16 },
              ].map((h, i) => (
                <span
                  key={`${active}-${i}`}
                  className="heart-float"
                  style={{
                    left: h.left,
                    fontSize: h.s,
                    animationDelay: `${h.d}ms`,
                    "--drift": h.drift,
                    "--spin": h.spin,
                    color: i % 2 ? "#F5A623" : "#FF5A6E",
                  }}
                  aria-hidden="true"
                >
                  ♥
                </span>
              ))}
          </div>

          <div key={`name-${active}-${seen}`} className="text-center mt-6 fade-up" style={{ animationDelay: "300ms" }}>
            <div className="text-base font-extrabold text-ink">{t.name}</div>
            <div className="text-[13px] text-muted mt-0.5">{t.role}</div>
          </div>
        </div>

        {/* Speech bubble + result */}
        <div key={`bubble-${active}-${seen}`} className={`relative ${seen ? "bubble-open" : "opacity-0"}`}>
          {/* tail — points at the character */}
          <div className="hidden lg:block absolute top-1/2 -left-[13px] -translate-y-1/2 w-7 h-7 rotate-45 bg-white border-l border-b border-silver" />
          <div className="lg:hidden absolute -top-[13px] left-1/2 -translate-x-1/2 w-7 h-7 rotate-45 bg-white border-l border-t border-silver" />

          <div className="relative bg-white rounded-lg2 border border-silver shadow-[0_24px_60px_-24px_rgba(17,17,24,0.18)] p-7 sm:p-10">
            <div className="text-orange text-lg tracking-[3px] mb-4" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((s) => (
                <span key={s} className="star-pop" style={{ animationDelay: `${550 + s * 110}ms` }}>
                  ★
                </span>
              ))}
            </div>

            {/* quote types in place; full text reserves the space */}
            <blockquote className="relative text-[17px] sm:text-[20px] leading-[1.7] text-ink font-medium min-h-[6.8em]">
              <span className="invisible" aria-hidden="true">&ldquo;{t.quote}&rdquo;</span>
              <span className="absolute inset-0">
                &ldquo;{t.quote.slice(0, chars)}
                {typing && <span className="tw-caret" aria-hidden="true" />}
                {done && <>&rdquo;</>}
              </span>
              <span className="sr-only">{t.quote}</span>
            </blockquote>

            <div className="mt-6 pt-6 border-t border-dashed border-silver grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-5 items-center">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted">Result</div>
                <div className="text-[18px] font-extrabold text-ink mt-1">{t.chart.title}</div>
                <div className="text-[13px] text-muted">{t.chart.note}</div>
              </div>
              <ResultChart chart={t.chart} delay={chartDelay} />
            </div>
          </div>
        </div>
      </div>

      {/* Client switcher with autoplay progress */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-12">
        <button
          type="button"
          onClick={() => go(active - 1)}
          aria-label="Previous testimonial"
          className="w-10 h-10 rounded-full border border-silver bg-white text-ink hover:border-orange hover:text-orange transition-colors"
        >
          ←
        </button>
        {items.map((item, i) => {
          const isActive = i === active;
          const progress = isActive ? Math.min(1, elapsed / duration) : 0;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${item.name}'s testimonial`}
              className={`relative flex flex-col items-center gap-2 transition-all duration-300 ${
                isActive ? "scale-110" : "opacity-50 hover:opacity-90"
              }`}
            >
              <span
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 ${
                  isActive ? "border-orange" : "border-transparent"
                }`}
                style={{ background: item.avatar.bg }}
              >
                <Toon avatar={item.avatar} still />
              </span>
              <span className="w-10 h-1 rounded-full bg-silver overflow-hidden">
                <span
                  className="block h-full bg-orange"
                  style={{ width: `${(reduced && isActive ? 1 : progress) * 100}%` }}
                />
              </span>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => go(active + 1)}
          aria-label="Next testimonial"
          className="w-10 h-10 rounded-full border border-silver bg-white text-ink hover:border-orange hover:text-orange transition-colors"
        >
          →
        </button>
      </div>
    </section>
  );
}
