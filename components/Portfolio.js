"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";
import PortfolioCard from "./PortfolioCard";
import PortfolioSpotlight from "./PortfolioSpotlight";
import IframeViewer from "./IframeViewer";
import Reveal from "./Reveal";

function getSizeClass(item, index) {
  if (item.wide && index < 2) return "gc-7";
  if (item.wide) return "gc-8";
  if (item.tall) return "gc-5";
  return "gc-4";
}

const COL_SPAN_CLASS = {
  "gc-7": "lg:col-span-7",
  "gc-8": "lg:col-span-8",
  "gc-5": "lg:col-span-5",
  "gc-4": "lg:col-span-4",
};

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [openUrl, setOpenUrl] = useState(null);
  const spotlightItems = CONFIG.portfolio.filter((item) => item.website && item.image);

  return (
    <section
      id="portfolio"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white"
    >
      <div className="mb-11">
        <div className="eyebrow">Our Work</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          Creative <span className="text-orange">Portfolio</span>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8] max-w-[500px]">
          A closer look at the work — swipe through the case studies below,
          or filter the full archive underneath.
        </p>
      </div>

      <PortfolioSpotlight items={spotlightItems} onOpen={setOpenUrl} />

      <div className="flex items-end justify-between gap-6 mb-11 flex-wrap">
        <div className="text-sm font-semibold text-muted">
          All Projects
        </div>

        <div className="flex gap-2 flex-wrap">
          {CONFIG.portfolioFilters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2.5 rounded-full border text-[13px] font-semibold transition-colors ${
                activeFilter === f.key
                  ? "bg-ink text-white border-ink"
                  : "bg-transparent text-muted border-silver hover:border-ink hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-[18px]">
        {CONFIG.portfolio.map((item, index) => {
          const gcClass = getSizeClass(item, index);
          const visible = activeFilter === "all" || item.filter === activeFilter;
          if (!visible) return null;
          return (
            <Reveal
              key={item.title}
              className={`col-span-1 ${COL_SPAN_CLASS[gcClass]}`}
            >
              <PortfolioCard item={item} gcClass={gcClass} index={index} onOpen={setOpenUrl} />
            </Reveal>
          );
        })}
      </div>

      <IframeViewer url={openUrl} onClose={() => setOpenUrl(null)} />
    </section>
  );
}
