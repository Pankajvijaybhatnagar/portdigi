"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIG } from "@/lib/config";

const TYPING_MS = 750; // "Digi1Xprt is typing…" before the answer lands

const ICONS = {
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="3" />
      <path d="M3 10h18M16 14.5h2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  contract: (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4M10 12h5M10 16h5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8 16v-4M12 16V9M16 16v-7" />
    </>
  ),
};

function Icon({ name, className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.chart}
    </svg>
  );
}

export default function FAQ() {
  const faqs = CONFIG.faqs;
  const [active, setActive] = useState(0);
  const [typing, setTyping] = useState(true);
  const [seen, setSeen] = useState(false);
  const panelRef = useRef(null);
  const sectionRef = useRef(null);

  // Start the first conversation when the section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Each new question: show the typing dots, then the answer
  useEffect(() => {
    if (!seen) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const id = setTimeout(() => setTyping(false), TYPING_MS);
    return () => clearTimeout(id);
  }, [active, seen]);

  const choose = (i) => {
    setActive(i);
    // On small screens the chat sits below the list — bring it into view
    if (window.innerWidth < 1024 && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };

  const faq = faqs[active];
  const next = (active + 1) % faqs.length;

  return (
    <section
      ref={sectionRef}
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

      <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-6 lg:gap-8 items-start">
        {/* Question list — scan the one-line answers at a glance */}
        <div className="flex flex-col gap-3" role="tablist" aria-label="Frequently asked questions">
          {faqs.map((f, i) => {
            const isActive = i === active;
            return (
              <button
                key={f.q}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="faq-chat"
                onClick={() => choose(i)}
                className={`group relative w-full text-left flex items-start gap-4 rounded-md2 border-[1.5px] px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? "bg-white border-orange shadow-[0_16px_40px_-18px_rgba(245,166,35,0.55)] lg:translate-x-2"
                    : "bg-white/60 border-silver hover:bg-white hover:border-orange/40"
                }`}
              >
                <span
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isActive ? "bg-orange text-white" : "bg-orange-lt text-orange group-hover:bg-orange/20"
                  }`}
                >
                  <Icon name={f.icon} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] sm:text-[15px] font-extrabold text-ink leading-snug">
                    {f.q}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 mt-2 text-[12px] font-bold rounded-full px-2.5 py-1 transition-colors duration-300 ${
                      isActive ? "bg-ink text-white" : "bg-silver/60 text-muted"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange" />
                    {f.short}
                  </span>
                </span>
                <span
                  className={`hidden sm:flex flex-shrink-0 self-center text-lg transition-all duration-300 ${
                    isActive ? "text-orange translate-x-0" : "text-silver -translate-x-1 group-hover:text-orange/60"
                  }`}
                  aria-hidden="true"
                >
                  →
                </span>
              </button>
            );
          })}
        </div>

        {/* Chat panel */}
        <div
          ref={panelRef}
          id="faq-chat"
          role="tabpanel"
          aria-live="polite"
          className="lg:sticky lg:top-24 bg-white rounded-lg2 border-[1.5px] border-silver shadow-[0_24px_60px_-28px_rgba(17,17,24,0.25)] overflow-hidden scroll-mt-24"
        >
          {/* chat header */}
          <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-silver bg-cloud/60">
            <div className="relative w-10 h-10 rounded-full bg-ink flex items-center justify-center font-display font-extrabold text-orange text-lg">
              1
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#25D366] border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-extrabold text-ink">
                Digi<span className="text-orange">1</span>Xprt
              </div>
              <div className="text-[12px] text-muted">
                {typing && seen ? "typing…" : "Online · replies instantly"}
              </div>
            </div>
            <div className="text-[12px] font-bold text-muted tabular-nums">
              {active + 1} / {faqs.length}
            </div>
          </div>

          {/* conversation */}
          <div key={`${active}-${seen}`} className="px-5 sm:px-6 py-6 flex flex-col gap-4 min-h-[420px]">
            {seen && (
              <>
                {/* visitor's question */}
                <div className="msg-right self-end max-w-[85%] bg-ink text-white rounded-[18px] rounded-br-[6px] px-4 py-3 text-[14px] sm:text-[15px] font-semibold leading-snug">
                  {faq.q}
                </div>

                {typing ? (
                  <div className="msg-left self-start bg-cloud rounded-[18px] rounded-bl-[6px] px-4 py-3.5 flex gap-1.5" aria-label="Typing">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="typing-dot w-2 h-2 rounded-full bg-muted" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                ) : (
                  <div className="msg-left self-start w-full max-w-[95%] bg-cloud rounded-[18px] rounded-bl-[6px] p-5 sm:p-6">
                    {/* the answer in one line */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="w-8 h-8 rounded-lg bg-orange text-white flex items-center justify-center flex-shrink-0">
                        <Icon name={faq.icon} className="w-4 h-4" />
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted">Short answer</span>
                    </div>
                    <div className="font-display text-[22px] sm:text-[26px] font-extrabold text-ink leading-tight tracking-[-0.5px] mb-3">
                      {faq.short}
                    </div>
                    <p className="text-[14px] sm:text-[15px] text-muted leading-[1.75]">{faq.a}</p>

                    {/* the same answer as a 3-step picture */}
                    {faq.steps?.length > 0 && (
                      <div className="mt-5 pt-5 border-t border-dashed border-silver">
                        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-muted mb-4">How it works</div>
                        <ol className="relative grid grid-cols-3 gap-2">
                          <span
                            className="line-grow absolute top-[15px] left-[16.66%] right-[16.66%] h-[2px] bg-orange/40"
                            style={{ animationDelay: "200ms" }}
                            aria-hidden="true"
                          />
                          {faq.steps.map((step, i) => (
                            <li
                              key={step}
                              className="step-in relative flex flex-col items-center text-center gap-2"
                              style={{ animationDelay: `${150 + i * 180}ms` }}
                            >
                              <span
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-extrabold border-2 ${
                                  i === faq.steps.length - 1
                                    ? "bg-orange border-orange text-white"
                                    : "bg-white border-orange text-orange"
                                }`}
                              >
                                {i === faq.steps.length - 1 ? "✓" : i + 1}
                              </span>
                              <span className="text-[12px] sm:text-[13px] font-bold text-ink leading-snug">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {/* quick replies */}
                {!typing && (
                  <div className="msg-right self-end flex flex-wrap justify-end gap-2 mt-auto" style={{ animationDelay: "500ms" }}>
                    <button
                      type="button"
                      onClick={() => choose(next)}
                      className="text-[13px] font-bold rounded-full border-[1.5px] border-orange text-orange px-4 py-2 hover:bg-orange hover:text-white transition-colors"
                    >
                      Next: {faqs[next].q.length > 34 ? `${faqs[next].q.slice(0, 32)}…` : faqs[next].q}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* still stuck? */}
          <a
            href={`https://wa.me/${CONFIG.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-silver bg-cloud/60 hover:bg-orange-lt transition-colors"
          >
            <span className="text-[13px] sm:text-sm text-muted">
              Still have a question? <span className="font-bold text-ink">Ask us directly on WhatsApp</span>
            </span>
            <span className="text-orange font-bold transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
