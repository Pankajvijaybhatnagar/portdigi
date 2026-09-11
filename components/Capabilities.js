"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

export default function Capabilities() {
  const [activeKey, setActiveKey] = useState(CONFIG.capabilities[0].key);
  const active = CONFIG.capabilities.find((c) => c.key === activeKey);

  return (
    <section
      id="capabilities"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-white"
    >
      <div className="mb-11 max-w-[640px]">
        <div className="eyebrow">How We Work</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          What <span className="text-orange">Branding</span>,{" "}
          <span className="text-orange">Social</span>,{" "}
          <span className="text-orange">Ads</span> &amp;{" "}
          <span className="text-orange">Content</span> Mean Here
        </h2>
        <p className="text-[17px] text-muted leading-[1.8]">
          The same categories you see in our portfolio filters, broken down
          into the actual tools, channels, and techniques behind each one.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap mb-10">
        {CONFIG.capabilities.map((cap) => (
          <button
            key={cap.key}
            type="button"
            onClick={() => setActiveKey(cap.key)}
            className={`px-5 py-2.5 rounded-full border text-[13px] font-semibold transition-colors ${
              activeKey === cap.key
                ? "bg-ink text-white border-ink"
                : "bg-cloud text-muted border-silver hover:border-ink hover:text-ink"
            }`}
          >
            {cap.label}
          </button>
        ))}
      </div>

      <Reveal key={active.key}>
        <div className="bg-cloud rounded-lg2 border border-silver p-6 sm:p-10 lg:p-12">
          <p className="text-[16px] sm:text-[17px] text-muted leading-[1.8] max-w-[680px] mb-10">
            {active.description}
          </p>

          <div className="flex flex-col gap-10">
            {active.groups.map((group, gi) => (
              <div key={group.title}>
                {gi > 0 && (
                  <div className="flex items-center gap-3 mb-8 -mt-2">
                    <div className="flex-1 h-px bg-silver" />
                    <div className="w-8 h-8 rounded-full border border-silver flex items-center justify-center text-muted text-sm flex-shrink-0">
                      ↓
                    </div>
                    <div className="flex-1 h-px bg-silver" />
                  </div>
                )}
                <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-orange mb-4">
                  {group.title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {group.items.map((item) => (
                    <div
                      key={item.name}
                      className="p-5 rounded-md2 border border-silver bg-white"
                    >
                      <h4 className="text-[15px] font-bold text-ink mb-1.5">
                        {item.name}
                      </h4>
                      <p className="text-[13px] text-muted leading-[1.65]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
