"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";
import PortfolioCard from "./PortfolioCard";
import PortfolioSpotlight from "./PortfolioSpotlight";
import IframeViewer from "./IframeViewer";

// Bento rows that alternate wide/narrow, so any filter result still lays out
// neatly. A short last row is split evenly instead of leaving a gap.
const ROW_PATTERNS = [[7, 5], [4, 4, 4], [5, 7], [4, 4, 4]];
const SPAN_CLASS = {
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  12: "lg:col-span-12",
};

function bentoSpans(count) {
  const spans = [];
  let row = 0;
  while (spans.length < count) {
    const left = count - spans.length;
    const pattern = ROW_PATTERNS[row % ROW_PATTERNS.length];
    if (left < pattern.length) {
      spans.push(...(left === 1 ? [12] : Array(left).fill(12 / left)));
    } else {
      spans.push(...pattern);
    }
    row += 1;
  }
  return spans;
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openUrl, setOpenUrl] = useState(null);
  const spotlightItems = CONFIG.portfolio.filter((item) => item.website && item.image);

  // Filters from config, plus any category a project uses that isn't listed
  const filters = [...CONFIG.portfolioFilters];
  CONFIG.portfolio.forEach((item) => {
    if (item.filter && !filters.some((f) => f.key === item.filter)) {
      filters.push({ key: item.filter, label: item.filter.charAt(0).toUpperCase() + item.filter.slice(1) });
    }
  });
  const countFor = (key) =>
    key === "all" ? CONFIG.portfolio.length : CONFIG.portfolio.filter((i) => i.filter === key).length;
  const labelFor = (key) => filters.find((f) => f.key === key)?.label;

  const visibleItems = CONFIG.portfolio
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => activeFilter === "all" || item.filter === activeFilter);
  const spans = bentoSpans(visibleItems.length);

  // Sliding highlight behind the active filter pill
  const btnRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  useIsoLayoutEffect(() => {
    const update = () => {
      const btn = btnRefs.current[activeFilter];
      if (btn) setPill({ left: btn.offsetLeft, width: btn.offsetWidth, ready: true });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [activeFilter]);

  return (
    <section
      id="portfolio"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white"
    >
      <div className="mb-11 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <div className="eyebrow">Our Work</div>
          <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
            Creative <span className="text-orange">Portfolio</span>
          </h2>
          <p className="text-[17px] text-muted leading-[1.8] max-w-[500px]">
            A closer look at the work — swipe through the case studies below,
            or filter the full archive underneath.
          </p>
        </div>

        {/* quick facts, counted straight from the portfolio config */}
        <div className="grid grid-cols-3 gap-3 lg:flex">
          {[
            { n: spotlightItems.length, label: "Live websites" },
            { n: CONFIG.portfolio.length, label: "Projects" },
            { n: filters.length - 1, label: "Categories" },
          ].map((f, i) => (
            <div
              key={f.label}
              className="fade-up lg:min-w-[118px] rounded-2xl border border-silver bg-cloud px-4 sm:px-5 py-4 transition-all duration-300 hover:-translate-y-1 hover:border-orange/40 hover:bg-white"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="font-display text-[30px] font-extrabold text-ink leading-none tabular-nums">
                {f.n}
              </div>
              <div className="text-[12px] font-semibold text-muted mt-1.5">{f.label}</div>
            </div>
          ))}
        </div>
      </div>

      <PortfolioSpotlight items={spotlightItems} labelFor={labelFor} onOpen={setOpenUrl} />

      {/* All Projects header + filters */}
      <div className="flex items-end justify-between gap-6 mb-9 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-display text-[24px] sm:text-[28px] font-extrabold text-ink tracking-[-0.5px]">
              All Projects
            </h3>
            <span className="text-[12px] font-bold text-orange bg-orange-lt rounded-full px-2.5 py-1 tabular-nums">
              {visibleItems.length} {visibleItems.length === 1 ? "project" : "projects"}
            </span>
          </div>
          <p className="text-[14px] text-muted mt-1">Tap any card to open the live site right here.</p>
        </div>

        <div className="max-w-full overflow-x-auto -mx-1 px-1 pb-1">
          <div className="relative inline-flex gap-1 p-1.5 rounded-full bg-cloud border border-silver" role="tablist" aria-label="Filter projects">
            <span
              className="absolute top-1.5 bottom-1.5 rounded-full bg-ink shadow-[0_6px_16px_-6px_rgba(17,17,24,0.5)] transition-all duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
              style={{ left: pill.left, width: pill.width, opacity: pill.ready ? 1 : 0 }}
              aria-hidden="true"
            />
            {filters.map((f) => {
              const on = activeFilter === f.key;
              return (
                <button
                  key={f.key}
                  ref={(el) => (btnRefs.current[f.key] = el)}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActiveFilter(f.key)}
                  className={`relative z-[1] flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-[13px] font-semibold transition-colors duration-300 ${
                    on ? "text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {f.label}
                  <span
                    className={`text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center transition-colors duration-300 ${
                      on ? "bg-orange text-ink" : "bg-white text-muted border border-silver"
                    }`}
                  >
                    {countFor(f.key)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {visibleItems.length > 0 ? (
        <div key={activeFilter} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {visibleItems.map(({ item, index }, i) => (
            <div
              key={item.title}
              className={`fade-up ${SPAN_CLASS[spans[i]] || "lg:col-span-4"}`}
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <PortfolioCard item={item} index={index} categoryLabel={labelFor(item.filter)} onOpen={setOpenUrl} />
            </div>
          ))}
        </div>
      ) : (
        <div key={activeFilter} className="fade-up rounded-[22px] border-[1.5px] border-dashed border-silver bg-cloud/60 px-6 py-14 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-white border border-silver flex items-center justify-center text-2xl mb-4" aria-hidden="true">
            🚧
          </div>
          <div className="font-display text-xl font-extrabold text-ink mb-2">
            {labelFor(activeFilter)} case studies are on the way
          </div>
          <p className="text-[14px] text-muted max-w-[420px] mx-auto mb-5">
            We&apos;re putting these together now. Want to see results from this kind of work? Ask us directly.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href={`https://wa.me/${CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange text-white px-5 py-2.5 rounded-full text-[13px] font-bold hover:bg-orange-dk transition-colors"
            >
              Ask on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className="inline-flex items-center gap-2 border border-silver bg-white text-ink px-5 py-2.5 rounded-full text-[13px] font-bold hover:border-ink transition-colors"
            >
              See all projects
            </button>
          </div>
        </div>
      )}

      <IframeViewer url={openUrl} onClose={() => setOpenUrl(null)} />
    </section>
  );
}
