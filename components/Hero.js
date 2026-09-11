"use client";

import { CONFIG, maskHandle } from "@/lib/config";
import { useInView, useCountUp, formatCount } from "./useCountUp";
import InstagramEmbed from "./InstagramEmbed";

export default function Hero() {
  const growthStory = CONFIG.growthStory;
  const [statRef, statInView] = useInView(0.5);
  const followerCount = useCountUp(growthStory.after.value, statInView, 1800);
  const maskedHandle = maskHandle(growthStory.handle);

  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-14 px-5 pt-28 pb-16 sm:px-12 lg:px-20 lg:pt-36 lg:pb-20 bg-white">
      <div>
        <div className="eyebrow">Digital Marketing Agency</div>

        <h1 className="font-display text-[36px] sm:text-[52px] lg:text-[74px] font-extrabold leading-[1.05] tracking-[-2px] text-ink mb-5">
          We Make
          <br />
          Brands <span className="text-orange">Do Big.</span>
        </h1>

        <p className="text-[17px] text-muted leading-[1.7] max-w-[430px] mb-9">
          Creative digital marketing that drives real results — like growing
          one Instagram &amp; Facebook page from {growthStory.before.display}{" "}
          to {growthStory.after.display} followers in {growthStory.span}.
        </p>

        <div className="flex items-center gap-6 flex-wrap mb-12">
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 bg-orange text-white px-7 py-3.5 rounded-full font-semibold text-[15px] transition-colors hover:bg-orange-dk"
          >
            View Our Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-1.5 text-ink font-semibold text-[15px] transition-colors hover:text-orange"
          >
            Start a Project <span aria-hidden="true">›</span>
          </a>
        </div>

        <div className="flex gap-9 pt-7 border-t border-silver flex-wrap">
          {CONFIG.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-[30px] font-bold leading-none text-ink tabular-nums">
                {s.num}
              </div>
              <div className="text-xs text-muted font-medium mt-1.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-7">
        {/* Growth snapshot card — real client numbers, handle masked for confidentiality */}
        <div
          ref={statRef}
          className="rounded-lg2 overflow-hidden relative bg-ink flex flex-col gap-5 p-7 lg:p-8"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange flex-shrink-0" />
            <span className="text-white/45 text-[11px] font-semibold tracking-[1.5px] uppercase">
              {growthStory.platform}
            </span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-white/45 text-[13px] font-medium truncate">
                  @{maskedHandle}
                </span>
                <span className="w-[15px] h-[15px] rounded-full bg-white/15 flex items-center justify-center text-white text-[9px] flex-shrink-0">
                  ✓
                </span>
              </div>
              <div className="font-display text-white font-extrabold text-[40px] lg:text-[50px] leading-none tabular-nums mb-2">
                {formatCount(followerCount)}
              </div>
              <div className="text-white/35 text-xs font-medium">
                Followers &amp; growing
              </div>
            </div>

            <div className="text-orange text-[13px] font-semibold">
              ↗ {growthStory.multiplier} in {growthStory.span}
            </div>
          </div>
        </div>

        {/* Real reels from the account behind those numbers */}
        {growthStory.reelUrls?.length > 0 && (
          <div>
            <div className="eyebrow !mb-4">Real Reels, Real Results</div>
            <div className="relative">
              <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {growthStory.reelUrls.map((url, i) => (
                  <div
                    key={url}
                    className="relative flex-shrink-0 snap-center w-[280px]"
                  >
                    <span className="absolute -top-2.5 -left-2.5 z-20 inline-flex items-center gap-1 bg-ink text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                      Reel {i + 1}
                    </span>
                    <div className="rounded-[18px] overflow-hidden bg-white border border-silver">
                      <InstagramEmbed url={url} />
                    </div>
                  </div>
                ))}
              </div>
              {/* edge fades hinting there's more to swipe */}
              <div className="hidden sm:block absolute top-0 bottom-3 left-0 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              <div className="hidden sm:block absolute top-0 bottom-3 right-0 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            </div>
            <div className="text-[11px] text-muted font-medium mt-1">
              Swipe to explore →
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
