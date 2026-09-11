"use client";

import { CONFIG, maskHandle } from "@/lib/config";
import Reveal from "./Reveal";
import { useInView, useCountUp, formatCount } from "./useCountUp";

const GROWTH = CONFIG.growthStory;

export default function Results() {
  const [chartRef, chartInView] = useInView(0.35);
  const beforeCount = useCountUp(GROWTH.before.value, chartInView);
  const afterCount = useCountUp(GROWTH.after.value, chartInView);

  return (
    <section
      id="results"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white"
    >
      <div className="mb-16">
        <div className="eyebrow">{GROWTH.eyebrow}</div>
        <div className="text-[13px] font-semibold text-muted mb-2">
          @{maskHandle(GROWTH.handle)} · {GROWTH.platform}
        </div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          From <span className="text-orange">{GROWTH.before.display}</span> to{" "}
          <span className="text-orange">{GROWTH.after.display}</span> Followers
        </h2>
        <p className="text-[17px] text-muted leading-[1.8] max-w-[560px]">
          We took over this client&rsquo;s page in {GROWTH.before.date} at{" "}
          {GROWTH.before.display} followers. With targeted paid promotion and
          sharp business tactics, the page now sits at {GROWTH.after.display} —
          a {GROWTH.multiplier} increase in {GROWTH.span}.
        </p>
      </div>

      <Reveal>
        <div
          ref={chartRef}
          className="relative bg-cloud rounded-lg2 border-[1.5px] border-silver px-6 py-10 sm:px-10 sm:py-14 overflow-hidden"
        >
          {/* Growth chart */}
          <div className="relative w-full max-w-[720px] mx-auto">
            <svg
              viewBox="0 0 720 300"
              className="w-full h-auto"
              role="img"
              aria-label="Line chart showing Facebook followers rising from 16,000 in December 2025 to 250,000 now"
            >
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5A623" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* baseline */}
              <line x1="40" y1="248" x2="680" y2="248" stroke="#E5E1D8" strokeWidth="1.5" />

              {/* area under curve */}
              <path
                d="M 60 232 C 250 224, 380 210, 460 140 C 540 70, 600 46, 660 40 L 660 248 L 60 248 Z"
                fill="url(#growthFill)"
              />

              {/* growth line */}
              <path
                d="M 60 232 C 250 224, 380 210, 460 140 C 540 70, 600 46, 660 40"
                fill="none"
                stroke="#F5A623"
                strokeWidth="4"
                strokeLinecap="round"
                pathLength="1"
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: chartInView ? 0 : 1,
                  transition: "stroke-dashoffset 1.4s ease-out",
                }}
              />

              {/* start marker */}
              <circle cx="60" cy="232" r="7" fill="#FFFFFF" stroke="#F5A623" strokeWidth="3" />
              {/* end marker */}
              <circle
                cx="660"
                cy="40"
                r="8"
                fill="#F5A623"
                style={{
                  opacity: chartInView ? 1 : 0,
                  transition: "opacity 0.4s ease-out 1.1s",
                }}
              />
            </svg>

            {/* Before / After labels anchored under the chart */}
            <div className="flex justify-between mt-2 px-[4%]">
              <div className="text-left">
                <div className="text-[13px] font-bold text-muted">{GROWTH.before.tag}</div>
                <div className="text-[11px] text-muted/70">{GROWTH.before.date}</div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-orange">{GROWTH.after.tag}</div>
                <div className="text-[11px] text-muted/70">{GROWTH.after.date}</div>
              </div>
            </div>
          </div>

          {/* Big before/after numbers + multiplier badge */}
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mt-12">
            <div className="text-center">
              <div className="font-display text-[40px] sm:text-[52px] font-extrabold leading-none text-ink tabular-nums">
                {formatCount(beforeCount)}
              </div>
              <div className="text-[13px] text-muted mt-2">Followers · {GROWTH.before.date}</div>
            </div>

            <div className="hidden sm:flex flex-col items-center px-4">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-orange/40 flex items-center justify-center font-display text-[13px] font-extrabold text-orange">
                {GROWTH.multiplier}
              </div>
              <div className="text-[11px] text-muted mt-2 whitespace-nowrap">in {GROWTH.span}</div>
            </div>

            <div className="text-center">
              <div className="font-display text-[40px] sm:text-[52px] font-extrabold leading-none text-orange tabular-nums">
                {formatCount(afterCount)}
              </div>
              <div className="text-[13px] text-muted mt-2">Followers · {GROWTH.after.date}</div>
            </div>
          </div>

          {/* Source line */}
          <p className="text-center text-[11px] text-muted/60 mt-8">{GROWTH.source}</p>
        </div>
      </Reveal>

      {/* How we got there */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
        {GROWTH.tactics.map((tactic) => (
          <Reveal key={tactic}>
            <div className="h-full bg-white rounded-lg2 px-6 py-6 border-[1.5px] border-silver text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,0.07)] hover:border-orange/30">
              <div className="w-2 h-2 rounded-full bg-orange mx-auto mb-3" />
              <p className="text-[14px] font-bold text-ink">{tactic}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}