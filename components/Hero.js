"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG, maskHandle } from "@/lib/config";
import { useInView, useCountUp, formatCount } from "./useCountUp";
import InstagramEmbed from "./InstagramEmbed";
import Mascot from "./Mascot";

// Same growth-curve shape used in the "Proof, Not Promises" chart
const GROWTH_CURVE = "M 6 70 C 90 66, 140 60, 175 42 C 210 22, 240 12, 294 8";

// "150+" → { prefix: "", n: 150, suffix: "+" }
function parseStat(value) {
  const m = String(value).match(/^([^\d]*)([\d.]+)(.*)$/);
  if (!m) return null;
  return { prefix: m[1], n: parseFloat(m[2]), suffix: m[3], decimals: (m[2].split(".")[1] || "").length };
}

function StatNumber({ value, run }) {
  const p = parseStat(value);
  const count = useCountUp(p ? p.n * 10 ** p.decimals : 0, run, 1600);
  if (!p) return value;
  return `${p.prefix}${(count / 10 ** p.decimals).toFixed(p.decimals)}${p.suffix}`;
}

/* floating social icons in the backdrop */
const FLOATERS = [
  { top: "14%", left: "46%", depth: "18px", r: "-8deg", delay: "0s", icon: "heart" },
  { top: "72%", left: "4%", depth: "-14px", r: "10deg", delay: "1.2s", icon: "play" },
  { top: "82%", left: "44%", depth: "22px", r: "-4deg", delay: "2.1s", icon: "like" },
  { top: "5%", left: "62%", depth: "-20px", r: "6deg", delay: "0.6s", icon: "chat" },
];

function FloaterIcon({ icon }) {
  const paths = {
    heart: <path d="M12 20s-7-4.3-7-9.2A3.9 3.9 0 0 1 12 8.6a3.9 3.9 0 0 1 7 2.2C19 15.7 12 20 12 20z" fill="#F5A623" />,
    play: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="4" fill="#1A1A5C" />
        <path d="M10 9l5 3-5 3z" fill="#F5A623" />
      </>
    ),
    like: <path d="M7 11v9H4v-9zM9 20h7.5a2 2 0 0 0 2-1.6l1.2-5.6a2 2 0 0 0-2-2.4H14l.7-3.4A1.6 1.6 0 0 0 13.1 5L9 11z" fill="#1A1A5C" />,
    chat: <path d="M4 5h16v11h-8l-5 4v-4H4z" fill="#F5A623" />,
  };
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
      {paths[icon]}
    </svg>
  );
}

export default function Hero() {
  const growthStory = CONFIG.growthStory;
  const [statRef, statInView] = useInView(0.4);
  const [statsRowRef, statsRowInView] = useInView(0.5);
  const followerCount = useCountUp(growthStory.after.value, statInView, 1800);
  const maskedHandle = maskHandle(growthStory.handle);
  const gain = growthStory.after.value - growthStory.before.value;

  const sectionRef = useRef(null);
  const reelsRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Backdrop icons drift slightly with the mouse
  const onMove = (e) => {
    const el = sectionRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--hx", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    el.style.setProperty("--hy", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };

  const scrollReels = (dir) => {
    const el = reelsRef.current;
    if (el) el.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMove}
      className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-start gap-10 lg:gap-14 px-5 pt-28 pb-20 sm:px-12 lg:px-20 lg:pt-36 lg:pb-24 bg-white overflow-hidden"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(26,26,92,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(26,26,92,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
        aria-hidden="true"
      />
      <div className="sp-glow absolute -top-40 right-[-10%] w-[680px] h-[680px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.18),transparent_65%)] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-[-30%] left-[-15%] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle,rgba(26,26,92,0.08),transparent_65%)] pointer-events-none" aria-hidden="true" />
      {FLOATERS.map((f) => (
        <div
          key={f.icon}
          className="hidden md:block absolute pointer-events-none hero-parallax"
          style={{ top: f.top, left: f.left, "--depth": f.depth }}
          aria-hidden="true"
        >
          <div
            className="hero-float w-12 h-12 rounded-2xl bg-white border border-silver shadow-[0_14px_30px_-14px_rgba(17,17,24,0.3)] flex items-center justify-center"
            style={{ animationDelay: f.delay, "--r": f.r }}
          >
            <FloaterIcon icon={f.icon} />
          </div>
        </div>
      ))}

      {/* ---------- left: message (stays in view beside the taller proof column) ---------- */}
      <div className="relative z-[1] lg:sticky lg:top-32 lg:pt-10">
        <div className="fade-up inline-flex items-center gap-2 rounded-full border border-silver bg-white/80 backdrop-blur-sm pl-2.5 pr-4 py-1.5 mb-6 shadow-[0_6px_18px_-10px_rgba(17,17,24,0.25)]">
          <span className="live-dot-orange w-2 h-2 rounded-full bg-orange" />
          <span className="text-[12px] font-bold tracking-[1.5px] uppercase text-ink/70">Digital Marketing Agency</span>
        </div>

        <h1 className="font-display text-[40px] sm:text-[56px] lg:text-[76px] font-extrabold leading-[1.02] tracking-[-2.5px] text-ink mb-6">
          <span className="hero-line">
            <span style={{ animationDelay: "0.1s" }}>We Make</span>
          </span>
          <span className="hero-line">
            <span style={{ animationDelay: "0.25s" }}>
              Brands{" "}
              <span className="relative inline-block text-orange">
                Do Big.
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-3 sm:h-4" aria-hidden="true">
                  <path
                    d="M4 20 C 70 6, 170 4, 296 14"
                    fill="none"
                    stroke="#F5A623"
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength="1"
                    style={{ strokeDasharray: 1, strokeDashoffset: mounted ? 0 : 1, transition: "stroke-dashoffset 0.9s ease-out 0.9s" }}
                  />
                </svg>
                <svg viewBox="0 0 40 40" className="absolute -top-3 -right-7 w-7 h-7 sm:w-9 sm:h-9" aria-hidden="true">
                  <path className="sparkle" d="M20 2 L23 17 L38 20 L23 23 L20 38 L17 23 L2 20 L17 17 Z" fill="#1A1A5C" />
                </svg>
                <svg viewBox="0 0 40 40" className="absolute -top-6 right-6 w-4 h-4" aria-hidden="true">
                  <path className="sparkle" style={{ animationDelay: "0.6s" }} d="M20 2 L23 17 L38 20 L23 23 L20 38 L17 23 L2 20 L17 17 Z" fill="#F5A623" />
                </svg>
              </span>
            </span>
          </span>
        </h1>

        <p className="fade-up text-[17px] sm:text-[18px] text-muted leading-[1.75] max-w-[460px] mb-9" style={{ animationDelay: "0.45s" }}>
          Creative digital marketing that drives real results — like growing one Instagram &amp; Facebook page from{" "}
          <span className="font-bold text-ink">{growthStory.before.display}</span> to{" "}
          <span className="font-bold text-orange">{growthStory.after.display}</span> followers in {growthStory.span}.
        </p>

        <div className="fade-up flex items-center gap-6 flex-wrap mb-12" style={{ animationDelay: "0.6s" }}>
          <a
            href="#portfolio"
            className="group inline-flex items-center gap-3 bg-orange text-white pl-7 pr-2 py-2 rounded-full font-bold text-[15px] shadow-[0_14px_30px_-12px_rgba(245,166,35,0.8)] transition-all hover:bg-orange-dk hover:-translate-y-0.5"
          >
            View Our Work
            <span className="cta-arrow w-9 h-9 rounded-full bg-white text-orange flex items-center justify-center" aria-hidden="true">
              →
            </span>
          </a>
          <a href="#contact" className="group inline-flex items-center gap-2 text-ink font-bold text-[15px] transition-colors hover:text-orange">
            <span className="w-9 h-9 rounded-full border border-silver flex items-center justify-center transition-colors group-hover:border-orange" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h16v11h-8l-5 4v-4H4z" />
              </svg>
            </span>
            Start a Project
          </a>
        </div>

        <div ref={statsRowRef} className="fade-up grid grid-cols-2 sm:grid-cols-4 gap-y-6 pt-7 border-t border-silver" style={{ animationDelay: "0.75s" }}>
          {CONFIG.stats.map((s, i) => (
            <div key={s.label} className={`${i > 0 ? "sm:border-l sm:border-silver sm:pl-6" : ""} ${i % 2 === 1 ? "border-l border-silver pl-6 sm:pl-6" : ""}`}>
              <div className="font-display text-[30px] font-extrabold leading-none text-ink tabular-nums">
                <StatNumber value={s.num} run={statsRowInView} />
              </div>
              <div className="text-xs text-muted font-semibold mt-1.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- right: proof ---------- */}
      <div className="relative z-[1] flex flex-col gap-8 min-w-0">
        {/* Growth snapshot card — real client numbers, handle masked for confidentiality */}
        <div className="relative pt-16">
          {/* mascot cheering on top of the card */}
          <svg viewBox="-40 -70 80 74" className="absolute right-8 -top-10 w-[124px] h-[115px] z-[2] fade-up" style={{ animationDelay: "1s" }} aria-hidden="true">
            <Mascot pose="megaphone" />
          </svg>

          <div
            ref={statRef}
            className="fade-up relative rounded-[26px] overflow-hidden bg-ink p-7 lg:p-8 shadow-[0_40px_80px_-40px_rgba(17,17,24,0.7)]"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(245,166,35,0.35),transparent_65%)] pointer-events-none" aria-hidden="true" />

            <div className="relative flex items-center gap-2 mb-5">
              <span className="live-dot-orange w-2 h-2 rounded-full bg-orange flex-shrink-0" />
              <span className="text-white/55 text-[11px] font-bold tracking-[1.5px] uppercase">{growthStory.platform}</span>
            </div>

            <div className="relative flex flex-wrap items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-white/50 text-[13px] font-medium truncate">@{maskedHandle}</span>
                  <span className="w-[15px] h-[15px] rounded-full bg-orange flex items-center justify-center text-ink text-[9px] font-bold flex-shrink-0">✓</span>
                </div>
                <div className="font-display text-white font-extrabold text-[46px] lg:text-[58px] leading-none tabular-nums mb-2">
                  {formatCount(followerCount)}
                </div>
                <div className="text-white/45 text-xs font-medium">Followers &amp; growing</div>
              </div>
              <div className="text-ink text-[13px] font-extrabold bg-orange rounded-full px-3.5 py-1.5">
                ↗ {growthStory.multiplier} in {growthStory.span}
              </div>
            </div>

            {/* growth line drawing from before → after */}
            <div className="relative mt-6">
              <svg viewBox="0 0 300 80" className="w-full h-[80px]" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="heroGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5A623" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${GROWTH_CURVE} L 294 80 L 6 80 Z`} fill="url(#heroGrowth)" style={{ opacity: statInView ? 1 : 0, transition: "opacity 1s ease 1s" }} />
                <path
                  d={GROWTH_CURVE}
                  fill="none"
                  stroke="#F5A623"
                  strokeWidth="3"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                  pathLength="1"
                  style={{ strokeDasharray: 1, strokeDashoffset: statInView ? 0 : 1, transition: "stroke-dashoffset 1.8s ease-out" }}
                />
              </svg>
              <div className="flex justify-between text-[11px] font-semibold mt-1">
                <span className="text-white/45">
                  {growthStory.before.display} · {growthStory.before.date}
                </span>
                <span className="text-orange">
                  {growthStory.after.display} · {growthStory.after.date}
                </span>
              </div>
            </div>
          </div>

          {/* floating gain chip */}
          <div className="hidden sm:block absolute -left-8 lg:-left-24 top-[60%] z-[2] fade-up" style={{ animationDelay: "1.2s" }}>
            <div className="hero-float bg-white rounded-2xl px-4 py-3 border border-silver shadow-[0_20px_40px_-18px_rgba(17,17,24,0.4)]" style={{ "--r": "-3deg" }}>
              <div className="font-display text-[20px] font-extrabold text-ink leading-none">+{formatCount(gain)}</div>
              <div className="text-[11px] font-semibold text-muted mt-1">new followers</div>
            </div>
          </div>
        </div>

        {/* Real reels from the account behind those numbers */}
        {growthStory.reelUrls?.length > 0 && (
          <div className="fade-up min-w-0" style={{ animationDelay: "0.9s" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="eyebrow !mb-0">Real Reels, Real Results</div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => scrollReels(-1)}
                  aria-label="Previous reel"
                  className="w-9 h-9 rounded-full border border-silver bg-white text-ink flex items-center justify-center transition-colors hover:bg-ink hover:text-white hover:border-ink"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => scrollReels(1)}
                  aria-label="Next reel"
                  className="w-9 h-9 rounded-full border border-silver bg-white text-ink flex items-center justify-center transition-colors hover:bg-ink hover:text-white hover:border-ink"
                >
                  →
                </button>
              </div>
            </div>
            <div className="relative">
              <div
                ref={reelsRef}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 pt-3 px-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {growthStory.reelUrls.map((url, i) => (
                  <div key={url} className="relative flex-shrink-0 snap-center w-[280px]">
                    <span className="absolute -top-2.5 -left-2.5 z-20 inline-flex items-center gap-1 bg-orange text-ink text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      ▶ Reel {i + 1}
                    </span>
                    <div className="rounded-[18px] overflow-hidden bg-white border border-silver shadow-[0_18px_40px_-24px_rgba(17,17,24,0.35)]">
                      <InstagramEmbed url={url} />
                    </div>
                  </div>
                ))}
              </div>
              {/* edge fades hinting there's more to swipe */}
              <div className="hidden sm:block absolute top-0 bottom-3 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="hidden sm:block absolute top-0 bottom-3 right-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
            <div className="text-[11px] text-muted font-medium mt-1">Swipe to explore →</div>
          </div>
        )}
      </div>

      {/* scroll cue */}
      <a href="#services" className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-muted hover:text-orange transition-colors" aria-label="Scroll to services">
        <span className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
          <span className="scroll-dot w-1 h-2 rounded-full bg-current" />
        </span>
      </a>
    </section>
  );
}
