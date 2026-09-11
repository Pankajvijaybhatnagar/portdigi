"use client";

import { useState } from "react";
import { CONFIG } from "@/lib/config";
import Reveal from "./Reveal";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      className="px-5 py-[72px] sm:px-12 lg:px-20 lg:py-[110px] bg-cloud"
    >
      <div className="text-center max-w-[600px] mx-auto mb-14">
        <div className="eyebrow center">Before You Reach Out</div>
        <h2 className="font-display text-[30px] sm:text-[42px] lg:text-[52px] font-extrabold leading-[1.08] tracking-[-1.5px] text-ink mb-4">
          Frequently Asked <span className="text-orange">Questions</span>
        </h2>
        <p className="text-[17px] text-muted leading-[1.8]">
          The practical questions decision-makers ask us before day one.
        </p>
      </div>

      <Reveal>
        <div className="max-w-[720px] mx-auto flex flex-col gap-3.5">
          {CONFIG.faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`bg-white rounded-lg2 border-[1.5px] transition-colors duration-300 ${
                  open ? "border-orange/40" : "border-silver"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  aria-expanded={open}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                >
                  <span className="text-[15px] sm:text-base font-extrabold text-ink">
                    {faq.q}
                  </span>
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-extrabold transition-all duration-300 ${
                      open
                        ? "bg-orange border-orange text-white rotate-45"
                        : "border-silver text-muted"
                    }`}
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[14px] text-muted leading-[1.8] px-6 pb-5 max-w-[600px]">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
