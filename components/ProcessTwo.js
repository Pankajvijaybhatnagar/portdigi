"use client";

import { CONFIG, maskHandle } from "@/lib/config";
import Reveal from "./Reveal";
import GrowthRunner from "./GrowthRunner";
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
          className="relative bg-cloud rounded-lg2 border-[1.5px] border-silver px-3 pt-20 pb-8 sm:px-10 sm:pt-32 sm:pb-14 overflow-hidden"
        >
          {/* Growth chart */}
          <div className="relative w-full max-w-[820px] mx-auto">
            <GrowthRunner
              before={GROWTH.before.value}
              after={GROWTH.after.value}
              milestones={[50000, 100000, 150000, 200000]}
            />

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